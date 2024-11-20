import { Link, useNavigate } from "react-router-dom"
import Button from "../components/button/Button"
import TextBox from "../components/textBox/TextBox"
import { ChangeEvent, useState } from "react";
import { UserResetPassword } from "../types";
import { authApi } from "../../../apis/authApis";
import toast from "react-hot-toast";
import z from 'zod';

const resetPasswordSchema = z.object({
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: "Passwords do not match",
});

export default function ResetPassword() {
  const [userData, setUserData] = useState<UserResetPassword>({
    name: localStorage.getItem('name') || '',
    password: "",
  });
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>, fieldName: keyof UserResetPassword) => {
    const { value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async () => {
    const validation = resetPasswordSchema.safeParse({
      password: userData.password,
      confirmPassword
    });

    if (!validation.success) {
      const validationErrors = validation.error.format();
      setErrors({
        password: validationErrors.password?._errors[0],
        confirmPassword: validationErrors.confirmPassword?._errors[0],
      });
      return;
    }
    try {
      const response = await authApi.resetPassword(userData)
      if (response.data.success) {
        toast.success(response.data.message)
        localStorage.clear();
        navigate('/auth/sign-in')
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

  return (
    <div className="page-div">
      <div className="box-heading">
        Reset Password
      </div>
      <div className="page-flex">
        <TextBox
          type='password'
          label="New Password"
          name="password"
          value={userData.password}
          error={!!errors.password}
          onChange={(e) => handleChange(e, 'password')}
        />
        {errors.password && <p className="error-message">{errors.password}</p>}

        <TextBox
          type='password'
          label="Confirm Password"
          name="confirmPassword"
          value={confirmPassword}
          error={!!errors.confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}

        <Button
          name="Reset"
          onClick={() => handleSubmit()}
        />

        <div className="auth-box-link-right">
          Back to&nbsp;
          <Link className="auth-link" to="/auth/sign-in">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
