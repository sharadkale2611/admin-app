// lib/features/staff/useStaffDetailsViewModel.ts
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchStaffById } from "@/lib/features/staff/staffThunks";
import { useEffect } from "react";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";

export const useStaffDetailsViewModel = (staffId: string) => {
    const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useAppDispatch();

    const {
        currentStaff, // We'll add this to the state
        loading,
        error
    } = useAppSelector((state: RootState) => state.staff);

    useEffect(() => {
        if (staffId) {
            dispatch(fetchStaffById(staffId));
        }
    }, [dispatch, staffId]);

    return {
        staff: currentStaff,
        isLoading: loading,
        error
    };
};