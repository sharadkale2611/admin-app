import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect, useCallback } from "react";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import {
    fetchCourseFees,
    createCourseFee,
    updateCourseFee,
    deleteCourseFee,
    fetchCourseFeeById
} from "./feesThunks";
import {
    setCourseIdFilter,
    clearFilters,
    clearCurrentCourseFee,
    clearError
} from "./feesSlice";

export const useCourseFeesViewModel = () => {
    const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useAppDispatch();

    const {
        courseFees,
        currentCourseFee,
        loading,
        error,
        filters
    } = useAppSelector((state: RootState) => state.courseFees);

    const safeCourseFees = courseFees || [];

    // Memoized fetch function
    const fetchCourseFeesData = useCallback(() => {
        dispatch(fetchCourseFees({
            courseId: filters.courseId
        }));
    }, [dispatch, filters.courseId]);

    // Fetch course fees when filters change
    useEffect(() => {
        fetchCourseFeesData();
    }, [fetchCourseFeesData]);

    // Action Handlers
    const handleCourseIdFilter = useCallback((courseId: number | undefined) => {
        dispatch(setCourseIdFilter(courseId));
    }, [dispatch]);

    const handleClearFilters = useCallback(() => {
        dispatch(clearFilters());
    }, [dispatch]);

    const handleClearCurrentCourseFee = useCallback(() => {
        dispatch(clearCurrentCourseFee());
    }, [dispatch]);

    const handleClearError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    const handleFetchCourseFeeById = useCallback((courseFeeId: number) => {
        return dispatch(fetchCourseFeeById(courseFeeId));
    }, [dispatch]);

    const handleCreateCourseFee = useCallback((courseFeeData: any) => {
        return dispatch(createCourseFee(courseFeeData));
    }, [dispatch]);

    const handleUpdateCourseFee = useCallback((courseFeeData: any) => {
        return dispatch(updateCourseFee(courseFeeData));
    }, [dispatch]);

    const handleDeleteCourseFee = useCallback((id: number) => {
        return dispatch(deleteCourseFee(id));
    }, [dispatch]);

    return {
        // State
        courseFees: safeCourseFees,
        currentCourseFee,
        isLoading: loading,
        error,
        filters,

        // Actions
        handleCourseIdFilter,
        handleClearFilters,
        handleClearCurrentCourseFee,
        handleClearError,
        handleFetchCourseFeeById,
        handleCreateCourseFee,
        handleUpdateCourseFee,
        handleDeleteCourseFee,
        refetch: fetchCourseFeesData
    };
};