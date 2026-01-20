// lib/features/staff/useTrainersByCourseViewModel.ts
import { useEffect } from "react";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import type { RootState } from "@/lib/store";
import { fetchTrainersByCourse } from "@/lib/features/staff/staffThunks";

export const useTrainersByCourseViewModel = (courseId: number | null) => {
    const dispatch: ThunkDispatch<RootState, unknown, AnyAction> =
        useAppDispatch();

    const {
        trainersByCourse,
        loading,
        error
    } = useAppSelector((state: RootState) => state.staff);

    useEffect(() => {
        if (courseId) {
            dispatch(fetchTrainersByCourse(courseId));
        }
    }, [dispatch, courseId]);

    return {
        trainers: trainersByCourse,
        isLoading: loading,
        error
    };
};
