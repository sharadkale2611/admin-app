import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect, useCallback } from "react";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import {
    fetchCourseFees,
    createCourseFee,
    updateCourseFee,
    deleteCourseFee,
    fetchCourseFeeById,
    fetchCourseFeesByFirm
} from "./feesThunks";
import {
    setCourseIdFilter,
    clearFilters,
    clearCurrentCourseFee,
    clearError
} from "./feesSlice";
import { useCourseViewModel } from "@/lib/features/course/useCourseViewModel";

export const useCourseFeesViewModel = () => {
    const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useAppDispatch();

    const {
        courseFees,
        currentCourseFee,
        loading,
        error,
        filters
    } = useAppSelector((state: RootState) => state.courseFees);

    const { firmId } = useCourseViewModel();

    const safeCourseFees = courseFees || [];

    // Memoized fetch function
    const fetchCourseFeesData = useCallback(() => {
        dispatch(fetchCourseFees({
            courseId: filters.courseId
        }));
    }, [dispatch, filters.courseId]);

    const fetchCourseFeesDataByFirm = useCallback(() => {
        if (!firmId) return;
        return dispatch(fetchCourseFeesByFirm(firmId));
    }, [dispatch, firmId]);

    const loadFees = useCallback(() => {
        if (filters.courseId) {
            return fetchCourseFeesData();
        }
        return fetchCourseFeesDataByFirm();
    }, [filters.courseId, fetchCourseFeesData, fetchCourseFeesDataByFirm]);

    useEffect(() => {
        if (!firmId) return;
        loadFees();
    }, [loadFees, firmId]);

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
        refetch: loadFees,                 // smart
        refetchByFirm: fetchCourseFeesDataByFirm,
        refetchByCourse: fetchCourseFeesData,

    };
};