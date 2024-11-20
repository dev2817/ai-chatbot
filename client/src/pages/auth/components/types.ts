/* eslint-disable @typescript-eslint/no-explicit-any */

export type TTextBox = {
    type: string;
    name: string;
    label?: string;
    value: any;
    disabled?: boolean;
    error?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export type TButton = {
    name: string;
    onClick: () => void;
}

export type OtpInputProps = {
    length: number;
    onChange: (otp: string) => void;
}