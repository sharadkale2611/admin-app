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
    clearError,
    setFirmIdFilter
} from "./feesSlice";

export const useCourseFeesViewModel = () => {
    const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useAppDispatch();

    const authUser = useAppSelector((state) => state.auth.user);

    const {
        courseFees,
        currentCourseFee,
        loading,
        error,
        filters
    } = useAppSelector((state: RootState) => state.courseFees);

    const safeCourseFees = courseFees || [];

    // ---------------------------------------------------
    // Fetch All Course Fees (firm-wise + course filter)
    // ---------------------------------------------------
    const fetchCourseFeesData = useCallback(() => {
        dispatch(fetchCourseFees({
            firmId: authUser?.firmId ? Number(authUser.firmId) : undefined,
            courseId: filters.courseId
        }));
    }, [dispatch, authUser?.firmId, filters.courseId]);

    // ---------------------------------------------------
    // Auto-Set firmId filter when user logs in
    // ---------------------------------------------------
    useEffect(() => {
        if (authUser?.firmId) {
            dispatch(setFirmIdFilter(Number(authUser.firmId)));
        }
        fetchCourseFeesData();
    }, [authUser?.firmId, dispatch, fetchCourseFeesData]);

    // ---------------------------------------------------
    // Action Handlers
    // ---------------------------------------------------
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

    const handleFetchCourseFeeById = useCallback((id: number) => {
        return dispatch(fetchCourseFeeById(id));
    }, [dispatch]);

    const handleCreateCourseFee = useCallback((data: any) => {
        return dispatch(createCourseFee(data));
    }, [dispatch]);

    const handleUpdateCourseFee = useCallback((data: any) => {
        return dispatch(updateCourseFee(data));
    }, [dispatch]);

    const handleDeleteCourseFee = useCallback((id: number) => {
        return dispatch(deleteCourseFee(id));
    }, [dispatch]);

    // ---------------------------------------------------
    // Return state + actions
    // ---------------------------------------------------
    return {
        courseFees: safeCourseFees,
        currentCourseFee,
        isLoading: loading,
        error,
        filters,

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
