import { ChangeEvent, useEffect, useState } from "react";
import { useAuth } from "../utils/useAuth";
import { CompleteProfileInput } from "../types";
import toast from "react-hot-toast";
import { authApi } from "../../../apis/authApis";
import _ from 'lodash'
import Button from "../components/button/Button";
import TextBox from "../components/textBox/TextBox";
import z from 'zod';
import { setUserId } from "@/features/userSlice";
import { useDispatch } from "react-redux";

const completeProfileSchema = z.object({
    username: z.string().min(1, { message: "Username is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    ip: z.string().optional(),
    projectCode: z.string().optional(),
});


export default function CompleteProfile() {
    const [userData, setUserData] = useState<CompleteProfileInput>({
        email: "",
        username: "",
        projectCode: "",
        ip: ""
    });
    const [checkedData, setCheckedData] = useState<any>();
    const [errors, setErrors] = useState<any>({});
    const { projectCode, ipAddress, successNavigate } = useAuth();
    const dispatch = useDispatch();

    const handleSubmit = async () => {
        const validation = completeProfileSchema.safeParse(userData);

        if (!validation.success) {
            const validationErrors = validation.error.format();
            setErrors({
                username: validationErrors.username?._errors[0],
            });
            return;
        }
        try {
            const response = await authApi.completeProfile(userData)
            if (response.data.success) {
                toast.success(response.data.message)
                localStorage.clear()
                localStorage.setItem('authtoken', response.data.data)
                dispatch(setUserId(response.data.userId));
                successNavigate()
            }
            else {
                toast.error(response.data.message)
            }
        }
        catch (err: any) {
            console.log("err", err);
            toast.error("Something went wrong!")
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>, fieldName: keyof CompleteProfileInput) => {
        const { value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [fieldName]: value,
        }));
    };

    const handleCheckUserData = async (userData: any) => {
        try {
            const res = await authApi.checkUserData({
                username: userData.username,
            });
            setCheckedData(res.data)
        } catch (err: any) {
            toast.error("Something went wrong!");
            console.log(err);
        }
    };

    const debouncedCheckUserData = _.debounce(handleCheckUserData, 500);

    useEffect(() => {
        if (userData.username) {
            debouncedCheckUserData(userData);
        }
        return () => {
            debouncedCheckUserData.cancel();
        };
    }, [userData]);

    useEffect(() => {
        setUserData({
            email: localStorage.getItem("email") || "",
            username: "",
            projectCode: projectCode,
            ip: ipAddress
        })
    }, [ipAddress, projectCode])

    return (
        <div className="page-div">
            <div className="box-heading">
                Complete Profile
            </div>
            <div className="page-flex">
                <TextBox
                    type='text'
                    label="Username"
                    name="username"
                    error={checkedData?.username === false || !!errors.username}
                    value={userData.username}
                    onChange={(e) => handleChange(e, 'username')}
                />
                {checkedData?.username === false && <div className="auth-error-data">Username already exists!</div>}
                {errors.username && <div className="auth-error-data">{errors.username}</div>}

                <Button
                    name="Submit"
                    onClick={() => { handleSubmit(); }}
                />
            </div>
        </div>
    )
}
