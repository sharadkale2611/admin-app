"use client";

import React, { useEffect } from "react";
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    CircularProgress,
    OutlinedInput,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
    fetchStates,
    fetchCitiesByState,
} from "@/lib/features/location/locationThunks";

interface LocationSelectorProps {
    stateId: number | null;
    cityId: number | null;
    onStateChange: (stateId: number | null) => void;
    onCityChange: (cityId: number | null) => void;
    disabled?: boolean;
}

export default function LocationSelector({
    stateId,
    cityId,
    onStateChange,
    onCityChange,
    disabled = false,
}: LocationSelectorProps) {
    const dispatch = useAppDispatch();

    const { states, cities, loadingStates, loadingCities } =
        useAppSelector((s) => s.location);

    /* ============================
       Load States (once)
    ============================ */
    useEffect(() => {
        dispatch(fetchStates());
    }, [dispatch]);

    /* ============================
       Load Cities when stateId changes
    ============================ */
    useEffect(() => {
        console.log("🟩 [LS-1] stateId changed:", stateId);

        if (stateId !== null) {
            console.log("🟩 [LS-2] Fetching cities for stateId:", stateId);
            dispatch(fetchCitiesByState(stateId));
        }
    }, [stateId, dispatch]);

    useEffect(() => {
        console.log("🟩 [LS-3] Cities updated:", cities);
    }, [cities]);

    /* ============================
       Handlers
    ============================ */
    const handleStateChange = (e: SelectChangeEvent<string>) => {
        const value =
            e.target.value === "" ? null : Number(e.target.value);

        console.log("🟩 [LS-4] User selected state:", value);
        onStateChange(value); // 🔥 ONLY ONE UPDATE
    };

    const handleCityChange = (e: SelectChangeEvent<string>) => {
        const value =
            e.target.value === "" ? null : Number(e.target.value);

        console.log("🟩 [LS-5] User selected city:", value);
        onCityChange(value);
    };

    return (
        <Grid container spacing={2}>
            {/* STATE */}
            <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth disabled={disabled} size="small">
                    <InputLabel id="state-label">State</InputLabel>

                    <Select
                        labelId="state-label"
                        value={stateId === null ? "" : String(stateId)}
                        label="State"
                        onChange={handleStateChange}
                        input={<OutlinedInput label="State" />}
                    >
                        <MenuItem value="">
                            <em>Select State</em>
                        </MenuItem>

                        {states.map((state) => (
                            <MenuItem
                                key={state.stateId}
                                value={String(state.stateId)}
                            >
                                {state.stateName}
                            </MenuItem>
                        ))}
                    </Select>

                    {loadingStates && (
                        <CircularProgress
                            size={20}
                            sx={{
                                position: "absolute",
                                top: "50%",
                                right: 16,
                                transform: "translateY(-50%)",
                            }}
                        />
                    )}
                </FormControl>
            </Grid>

            {/* CITY */}
            <Grid size={{ xs: 12, md: 6 }}>
                <FormControl
                    fullWidth
                    disabled={disabled || stateId === null}
                    size="small"
                >
                    <InputLabel id="city-label">City</InputLabel>

                    <Select
                        labelId="city-label"
                        value={cityId === null ? "" : String(cityId)}
                        label="City"
                        onChange={handleCityChange}
                        input={<OutlinedInput label="City" />}
                    >
                        <MenuItem value="">
                            <em>Select City</em>
                        </MenuItem>

                        {cities.map((city) => (
                            <MenuItem
                                key={city.cityId}
                                value={String(city.cityId)}
                            >
                                {city.cityName}
                            </MenuItem>
                        ))}
                    </Select>

                    {loadingCities && (
                        <CircularProgress
                            size={20}
                            sx={{
                                position: "absolute",
                                top: "50%",
                                right: 16,
                                transform: "translateY(-50%)",
                            }}
                        />
                    )}
                </FormControl>
            </Grid>
        </Grid>

    );
}
