import { authApi } from '@/apis/authApis';
import { setUserData } from '@/features/userDataSlice';
import { selectUserId } from '@/features/userSlice';
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

type AuthContextType = {
    projectCode: string;
    ipAddress: string;
    setIpAddress: (ipAddress: string) => void;
    projectRole: string[];
    successNavigate: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const projectCode: string = import.meta.env.VITE_PROJECT_CODE;
    const projectRole: string[] = [import.meta.env.VITE_PROJECT_ROLE];
    const successNavigateRoute: string = "/chat";
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userId = useSelector(selectUserId);

    const [ipAddress, setIpAddress] = useState<string>('');

    const successNavigate = () => {
        navigate(successNavigateRoute)
    }

    const fetchIpAddress = () => {
        fetch('https://geolocation-db.com/json/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setIpAddress(data.IPv4);
            })
            .catch(error => {
                console.error('Error fetching IP address:', error);
            });
    };

    const getUserData = async () => {
        try {
            const res = await authApi.getUserById(userId as string);
            if (res.data.success) {
                console.log(res.data.data);
                const userData = {
                    id: res.data.data._id,
                    email: res.data.data.email,
                    name: res.data.data.name,
                    profileImage: res.data.data.profileImage || "",
                    username: res.data.data.username || "",
                    isActive: res.data.data.isActive,
                }
                dispatch(setUserData(userData));
            }
            else {
                toast.error(res.data.message)
            }
        }
        catch (err) {
            console.log(err);
            toast.error("Something went wrong")
        }
    }

    useEffect(() => {
        fetchIpAddress();
    }, []);

    useEffect(() => {
        userId && getUserData()
    }, [userId])
    return (
        <AuthContext.Provider value={{ projectCode, ipAddress, setIpAddress, projectRole, successNavigate }}>
            {children}
        </AuthContext.Provider>
    );
};
