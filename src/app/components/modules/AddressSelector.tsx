"use client";

import React, { useEffect } from "react";
import {
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import LocationSelector from "./LocationSelector";

export type AddressType = "Permanent" | "Residential" | "Office";

export interface AddressValue {
    fullAddress: string;
    pincode: string;
    stateId: number | null;
    cityId: number | null;
    addressType: AddressType | "";
}

interface AddressSelectorProps {
    value: AddressValue;
    onChange: (value: AddressValue) => void;
    disabled?: boolean;
}

export default function AddressSelector({
    value,
    onChange,
    disabled = false,
}: AddressSelectorProps) {

    /* ============================
       Handlers
    ============================ */
    const handleFieldChange =
        (field: keyof AddressValue) =>
            (e: React.ChangeEvent<HTMLInputElement>) => {
                const newValue = {
                    ...value,
                    [field]: e.target.value,
                };
                onChange(newValue);
            };

    const handleAddressTypeChange = (e: SelectChangeEvent) => {
        const newValue = {
            ...value,
            addressType: e.target.value as AddressType,
        };

        onChange(newValue);
    };

    return (
        <Grid container spacing={2}>
            {/* FULL ADDRESS */}
            <Grid size={{ xs: 12 }}>
                <TextField
                    label="Full Address"
                    value={value.fullAddress}
                    onChange={handleFieldChange("fullAddress")}
                    fullWidth
                    size="small"
                    multiline
                    minRows={1}
                    disabled={disabled}
                />
            </Grid>

            {/* PINCODE */}
            <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                    label="Pincode"
                    value={value.pincode}
                    onChange={handleFieldChange("pincode")}
                    fullWidth
                    size="small"
                    disabled={disabled}
                    inputProps={{
                        maxLength: 6,
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                    }}
                />
            </Grid>

            {/* ADDRESS TYPE */}
            <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth disabled={disabled}>
                    <InputLabel>Address Type</InputLabel>
                    <Select
                        value={value.addressType}
                        label="Address Type"
                        size="small"
                        onChange={handleAddressTypeChange}
                    >
                        <MenuItem value="">
                            <em>Select Address Type</em>
                        </MenuItem>
                        <MenuItem value="Permanent">Permanent</MenuItem>
                        <MenuItem value="Residential">Residential</MenuItem>
                        <MenuItem value="Office">Office</MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            {/* STATE & CITY */}
            <Grid size={{ xs: 12 }}>
                <LocationSelector
                    stateId={value.stateId}
                    cityId={value.cityId}
                    onStateChange={(stateId) => {
                        const newValue = {
                            ...value,
                            stateId,
                            cityId: null, // ✅ reset safely HERE
                        };

                        console.log("🟦 [AS-4] State selected:", newValue);
                        onChange(newValue);
                    }}
                    onCityChange={(cityId) => {
                        const newValue = {
                            ...value,
                            cityId,
                        };

                        console.log("🟦 [AS-5] City selected:", newValue);
                        onChange(newValue);
                    }}
                    disabled={disabled}
                />
            </Grid>
        </Grid>
    );
}
