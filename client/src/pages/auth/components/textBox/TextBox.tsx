import { useState } from "react"
import { TTextBox } from "../types"
import "./TextBox.css"
export default function TextBox({
    error,
    type,
    label,
    value,
    onChange,
    name,
    disabled
}: TTextBox) {
    const [focused, setFocused] = useState(false);
    return (
        <>
            <div className="inputWrapper">
                <label className={`label ${focused || value ? 'focused' : ''}`}>
                    {label}
                </label>
                <input
                    type={type}
                    className={error ? "textbox error" : "textbox"}
                    disabled={disabled}
                    name={name}
                    value={value}
                    autoComplete="new-password"
                    onChange={onChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder={focused ? '' : label}
                />
            </div>
        </>
    )
}
