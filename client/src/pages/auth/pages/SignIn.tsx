import { ChangeEvent, useEffect, useState } from "react";
import TextBox from "../components/textBox/TextBox";
import { UserSignInData } from "../types";
import { useAuth } from "../utils/useAuth";
import Button from "../components/button/Button";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../../../apis/authApis";
import toast from "react-hot-toast";
import z from 'zod';
import GoogleButton from "../components/googleButton/GoogleButton";
import { useDispatch } from "react-redux";
import { setUserId } from "@/features/userSlice";

const signInSchema = z.object({
  name: z.string().min(3, { message: "Username or Email is required" }),
  password: z.string().min(3, { message: "Password is required" }),
  projectCode: z.string().optional(),
  ip: z.string().optional(),
});

export default function SignIn() {
  const { ipAddress, projectCode, successNavigate } = useAuth();
  const [userData, setUserData] = useState<UserSignInData>({
    name: "",
    password: "",
    projectCode: "",
    ip: ""
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [errors, setErrors] = useState<{ name?: string; password?: string }>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>, fieldName: keyof UserSignInData) => {
    const { value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async () => {
    const validation = signInSchema.safeParse(userData);

    if (!validation.success) {
      const validationErrors = validation.error.format();
      setErrors({
        name: validationErrors.name?._errors[0],
        password: validationErrors.password?._errors[0],
      });
      return;
    }
    try {
      const response = await authApi.signIn(userData)
      if (response.data.success) {
        toast.success(response.data.message)
        localStorage.clear();
        localStorage.setItem('authtoken', response.data.data)
        dispatch(setUserId(response.data.userId));
        successNavigate()
      }
      else {
        toast.error(response.data.message)
        if (response.data.verify === false) {
          localStorage.setItem('name', userData.name)
          localStorage.setItem("verify", 'false');
          navigate("/auth/otp-verify")
        }
      }
    }
    catch (err: any) {
      console.log("err", err);
      toast.error("Something went wrong!")
    }
  }

  useEffect(() => {
    setUserData({
      name: "",
      password: "",
      projectCode: projectCode,
      ip: ipAddress
    })
  }, [ipAddress, projectCode])

  return (
    <div className="page-div">
      <div className="box-heading">
        Sign In
      </div>
      <div className="page-flex">
        <TextBox
          type='text'
          label="Username or Email"
          name="username"
          value={userData.name}
          error={!!errors.name}
          onChange={(e) => handleChange(e, 'name')}
        />
        {errors.name && <p className="error-message">{errors.name}</p>}
        <TextBox
          type='password'
          label="Password"
          name="password"
          value={userData.password}
          error={!!errors.password}
          onChange={(e) => handleChange(e, 'password')}
        />
        {errors.password && <p className="error-message">{errors.password}</p>}
        <Button
          name="Sign In"
          onClick={() => { handleSubmit(); }}
        />
        <GoogleButton name="Sign In" />
        <div className="auth-box-links">
          <div>
            <Link className="auth-link" to="/auth/forgot-password">
              Forgot password?
            </Link>
          </div>
          <div>
            New here?&nbsp;
            <Link className="auth-link" to="/auth/sign-up">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
