import { signInWithPopup, UserCredential } from "firebase/auth";
import { firebase } from "../../utils/firebaseConfig";
import { authApi } from "../../../../apis/authApis";
import { useAuth } from "../../utils/useAuth";
import { GoogleSignData } from "../../types";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "./GoogleButton.css"
import { useNavigate } from "react-router-dom";
import { setUserId } from "@/features/userSlice";
import { useDispatch } from "react-redux";

export default function GoogleButton({ name }: { name: string }) {
    const { ipAddress, projectCode, projectRole } = useAuth();
    const [userData, setUserData] = useState<GoogleSignData>({
        googleUid: "",
        name: "",
        email: "",
        profileImage: "",
        roles: [],
        projectCode: "",
        ip: ""
    });
    const { successNavigate } = useAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const updateUserData = (
        displayName: any,
        email: any,
        photoURL: any,
        uid: any
    ) => {
        setUserData((prevData) => ({
            ...prevData,
            name: displayName || prevData.name,
            email: email || prevData.email,
            profileImage: photoURL || prevData.profileImage,
            googleUid: uid,
        }));
    };

    const handleGoogleSignIn = async () => {
        try {
            const result: UserCredential = await signInWithPopup(firebase.auth, firebase.provider);
            const user = result.user;

            const userDetails = {
                googleUid: user.uid,
                name: user.displayName as string,
                email: user.email as string,
                profileImage: user.photoURL as string,
                roles: userData.roles,
                projectCode: userData.projectCode,
                ip: userData.ip
            };
            updateUserData(userDetails.name, userDetails.email, userDetails.profileImage, userDetails.googleUid)
            const response = await authApi.signWithGoogle(userDetails);
            if (response.data.success) {
                if (!response.data.completeProfile) {
                    localStorage.setItem('email', user.email as string)
                    navigate('/auth/complete-profile');
                }
                toast.success(response.data.message)
                localStorage.clear();
                localStorage.setItem('authtoken', response.data.data)
                dispatch(setUserId(response.data.userId));
                successNavigate()
            }
            else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error("Something went wrong!")
            console.error('Error signing in with Google:', error);
        }
    };


    useEffect(() => {
        setUserData({
            googleUid: "",
            name: "",
            email: "",
            profileImage: "",
            ip: ipAddress,
            roles: projectRole,
            projectCode: projectCode,
        })
    }, [projectCode, projectRole, ipAddress])

    return (
        <div className="google-signin-container">
            <button className="google-signin-btn" onClick={() => handleGoogleSignIn()}>
                <img className="google-logo" src="https://img.icons8.com/color/48/google-logo.png" alt="google-logo" />
                <span>{name} with Google</span>
            </button>
        </div>
    )
}
