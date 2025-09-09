// lib/features/courses/useCourseDetailsViewModel.ts
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect } from "react";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { fetchCourseById } from "./courseThunks";

export const useCourseDetailsViewModel = (courseId: string) => {
    const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useAppDispatch();

    const {
        currentCourse,
        loading,
        error
    } = useAppSelector((state: RootState) => state.courses);

    useEffect(() => {
        if (courseId) {
            dispatch(fetchCourseById(parseInt(courseId)));
        }
    }, [dispatch, courseId]);

    return {
        course: currentCourse,
        isLoading: loading,
        error
    };
};