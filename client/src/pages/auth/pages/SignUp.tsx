import { ChangeEvent, useEffect, useState } from "react";
import { useAuth } from "../utils/useAuth";
import TextBox from "../components/textBox/TextBox";
import Button from "../components/button/Button";
import { UserSignUpData } from "../types";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../../../apis/authApis";
import toast from "react-hot-toast";
import _ from 'lodash';
import z from 'zod'
import GoogleButton from "../components/googleButton/GoogleButton";

const signUpSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  username: z.string().min(1, { message: "Username is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  mobile: z.string().min(1, { message: "Mobile number is required" }),
  password: z.string().min(6, { message: "Password is required" }),
  roles: z.array(z.string()).optional(),
  projectCode: z.string().optional(),
});

export default function SignUp() {
  const { projectRole, projectCode, successNavigate } = useAuth();
  const [userData, setUserData] = useState<UserSignUpData>({
    name: "",
    password: "",
    username: "",
    email: "",
    mobile: "",
    roles: [],
    projectCode: "",
  });
  const [checkedData, setCheckedData] = useState<any>();
  const [errors, setErrors] = useState<any>({});

  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>, fieldName: keyof UserSignUpData) => {
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
        email: userData.email,
        mobile: userData.mobile
      });
      setCheckedData(res.data)
    } catch (err: any) {
      toast.error("Something went wrong!");
      console.log(err);
    }
  };

  const debouncedCheckUserData = _.debounce(handleCheckUserData, 500);

  useEffect(() => {
    if (userData.username || userData.email || userData.mobile) {
      debouncedCheckUserData(userData);
    }
    return () => {
      debouncedCheckUserData.cancel();
    };
  }, [userData]);

  const handleSubmit = async () => {
    const validation = signUpSchema.safeParse(userData);

    if (!validation.success) {
      const validationErrors = validation.error.format();
      setErrors({
        name: validationErrors.name?._errors[0],
        username: validationErrors.username?._errors[0],
        email: validationErrors.email?._errors[0],
        mobile: validationErrors.mobile?._errors[0],
        password: validationErrors.password?._errors[0],
      });
      return;
    }

    try {
      console.log(userData);
      const response = await authApi.signUp(userData)
      if (response.data.success) {
        if (response.data.verify === false) {
          localStorage.setItem('name', userData.username)
          localStorage.setItem("verify", 'false');
          navigate('/auth/otp-verify')
        }
        else {
          toast.success(response.data.message)
          successNavigate()
        }
      }
      else {
        toast.error(response.data.message)
      }
    }
    catch (err: any) {
      toast.error("Something went wrong!")
      console.log(err);
    }
  }

  useEffect(() => {
    setUserData({
      name: "",
      password: "",
      username: "",
      email: "",
      mobile: "",
      roles: projectRole,
      projectCode: projectCode,
    })
  }, [projectCode, projectRole])
  return (
    <div className="page-div">
      <div className="box-heading">
        Sign Up
      </div>
      <div className="page-flex">
        <TextBox
          type='text'
          label="Name"
          name="name"
          value={userData.name}
          error={!!errors.name}
          onChange={(e) => handleChange(e, 'name')}
        />
        {errors.name && <div className="auth-error-data">{errors.name}</div>}

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

        <TextBox
          type='email'
          label="Email"
          name="email"
          value={userData.email}
          error={checkedData?.email === false || !!errors.email}
          onChange={(e) => handleChange(e, 'email')}
        />
        {checkedData?.email === false && <div className="auth-error-data">Email already exists!</div>}
        {errors.email && <div className="auth-error-data">{errors.email}</div>}

        <TextBox
          type='password'
          label="Password"
          name="password"
          value={userData.password}
          error={!!errors.password}
          onChange={(e) => handleChange(e, 'password')}
        />
        {errors.password && <div className="auth-error-data">{errors.password}</div>}

        <TextBox
          type='text'
          label="Phone"
          name="mobile"
          error={checkedData?.mobile === false || !!errors.mobile}
          value={userData.mobile}
          onChange={(e) => handleChange(e, 'mobile')}
        />
        {checkedData?.mobile === false && <div className="auth-error-data">Phone already exists!</div>}
        {errors.mobile && <div className="auth-error-data">{errors.mobile}</div>}

        <Button
          name="Sign Up"
          onClick={() => { handleSubmit(); }}
        />
        <GoogleButton name="Sign Up" />
        <div className="auth-box-link-right">
          Already a user?&nbsp;
          <Link className="auth-link" to="/auth/sign-in">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
