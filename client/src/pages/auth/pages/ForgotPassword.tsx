import { Link, useNavigate } from "react-router-dom"
import Button from "../components/button/Button"
import TextBox from "../components/textBox/TextBox"
import { useState } from "react"
import { authApi } from "../../../apis/authApis";
import toast from "react-hot-toast";
import z from 'zod'

const forgotPasswordSchema = z.object({
  userName: z.string().min(1, { message: "Username or email is required" }).email({ message: "Invalid email format" }),
});

export default function ForgotPassword() {
  const [userName, setUserName] = useState<string>('');
  const [errors, setErrors] = useState<{ userName?: string }>({});
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const validation = forgotPasswordSchema.safeParse({ userName });
    if (!validation.success) {
      const validationErrors = validation.error.format();
      setErrors({
        userName: validationErrors.userName?._errors[0], // Set custom error message
      });
      return;
    }
    try {
      const response = await authApi.forgotPassword({ name: userName })
      if (response.data.success) {
        toast.success(response.data.message)
        localStorage.setItem('name', userName);
        navigate('/auth/otp-verify')
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
  return (
    <div className="page-div">
      <div className="box-heading">
        Forgot Password
      </div>
      <div className="page-flex">
        <TextBox
          type='text'
          label="Username or Email"
          name="username"
          value={userName}
          error={!!errors.userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        {errors.userName && <p className="error-message">{errors.userName}</p>}
        <Button
          name="Submit"
          onClick={() => { handleSubmit() }}
        />
        <div className="auth-box-link-right">
          Back to&nbsp;
          <Link className="auth-link" to="/auth/sign-up">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
