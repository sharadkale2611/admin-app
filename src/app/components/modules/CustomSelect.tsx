import React from "react";
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    SelectChangeEvent,
} from "@mui/material";

interface CustomSelectProps {
    label: string;
    name: string;
    value: string | number;
    onChange: (e: SelectChangeEvent<string | number>) => void;
    options: { id: number | string; name: string }[];
    disabled?: boolean;
    error?: string;
}

export default function CustomSelect({
    label,
    name,
    value,
    onChange,
    options,
    disabled = false,
    error,
}: CustomSelectProps) {
    return (
        <FormControl
            fullWidth
            error={!!error}
            disabled={disabled}
            variant="outlined"
        >
            <InputLabel id={`${name}-label`}>
                {label}
            </InputLabel>

            <Select
                labelId={`${name}-label`}
                name={name}
                value={value}
                label={label}
                onChange={onChange}
            >
                <MenuItem value="">
                    <em>Select {label}</em>
                </MenuItem>

                {options.map((opt) => (
                    <MenuItem key={opt.id} value={opt.id}>
                        {opt.name}
                    </MenuItem>
                ))}
            </Select>

            {error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
    );
}
