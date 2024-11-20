import { useEffect, useState } from "react";
import OtpBox from "../components/otpBox/OtpBox";
import Button from "../components/button/Button";
import { UserOtpVerify } from "../types";
import { useAuth } from "../utils/useAuth";
import toast from "react-hot-toast";
import { authApi } from "../../../apis/authApis";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserId } from "@/features/userSlice";

export default function OtpVerify() {
  const [verifyData, setVerifyData] = useState<UserOtpVerify>({
    otp: "",
    name: "",
    verify: false,
    forgotPassword: false,
    projectCode: "",
    ip: ""
  });
  const { projectCode, ipAddress, successNavigate } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleOtpChange = (otpValue: string) => {
    setVerifyData((prevData) => ({
      ...prevData,
      otp: otpValue,
    }));
  };

  const handleResendOtp = async () => {
    try {
      const response = await authApi.resentOtp({ name: localStorage.getItem('name') || '' });
      if (response.data.success) {
        toast.success(response.data.message)
      }
      else {
        toast.error(response.data.message)
      }
    }
    catch (err) {
      console.log("err", err);
      toast.error("Something went wrong!")
    }
  }

  const handleSubmit = async () => {
    try {
      const response = await authApi.verifyOtp(verifyData)
      if (response.data.success) {
        toast.success(response.data.message)
        if (response.data.forgotPassword) {
          navigate('/auth/reset-password')
        }
        else {
          localStorage.clear()
          localStorage.setItem('authtoken', response.data.data)
          dispatch(setUserId(response.data.userId));
          successNavigate()
        }
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

  useEffect(() => {
    setVerifyData({
      otp: "",
      name: localStorage.getItem('name') || "",
      verify: localStorage.getItem('verify') === 'false' ? true : false,
      forgotPassword: localStorage.getItem('verify') === 'false' ? false : true,
      projectCode: projectCode,
      ip: ipAddress
    })
  }, [ipAddress, projectCode])

  return (
    <div className="page-div">
      <div className="box-heading">
        Verify OTP
      </div>
      <div className="page-flex">
        <OtpBox length={6} onChange={handleOtpChange} />
        <Button
          name="Verify"
          onClick={() => { handleSubmit() }}
        />
        <div className="auth-box-link-right">
          <Link className="auth-link" to="" onClick={async () => { await handleResendOtp() }}>
            Resend OTP
          </Link>
        </div>
      </div>
    </div>
  )
}
