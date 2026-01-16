import React from "react";
import { TextField } from "@mui/material";

interface CustomInputProps {
    label: string;
    name: string;
    value: string;
    className?: string;
    type?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    error?: string;
    readOnly?: boolean;
    disabled?: boolean;
}

export default function CustomInput({
    label,
    name,
    value,
    className,
    onChange,
    type = "text",
    placeholder,
    error,
    readOnly,
    disabled,
}: CustomInputProps) {
    return (
        <TextField
            fullWidth
            label={label}
            name={name}
            value={value}
            type={type}
            placeholder={placeholder}
            onChange={onChange}
            error={!!error}
            helperText={error}
            disabled={disabled}
            InputProps={{
                readOnly: readOnly,
            }}
            className={className}
            variant="outlined"
            size="medium"
        />
    );
}
