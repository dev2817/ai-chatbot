import { useState } from "react";
import "./OtpBox.css";
import { OtpInputProps } from "../types";

export default function OtpBox({ length, onChange }: OtpInputProps) {
    const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));

    const handleChange = (element: HTMLInputElement, index: number) => {
        const value = element.value;
        if (/^[0-9]$/.test(value) || value === '') {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            onChange(newOtp.join(''));

            if (value && index < length - 1) {
                (element.nextSibling as HTMLInputElement)?.focus();
            }
        }
    };

    const handleBackspace = (element: HTMLInputElement, index: number) => {
        if (!element.value && index > 0) {
            (element.previousSibling as HTMLInputElement)?.focus();
        }
    };

    return (
        <div className="otp-container">
            {otp.map((value, index) => (
                <input
                    key={index}
                    type="text"
                    maxLength={1}
                    className="otp-input"
                    value={value}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => e.key === 'Backspace' && handleBackspace(e.currentTarget, index)}
                />
            ))}
        </div>
    );
}
