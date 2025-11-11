// src/lib/features/admission/useAdmissionsViewModel.ts
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect, useCallback } from "react";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { fetchAdmissions } from "./admissionThunks";
import {
    resetFilters,
    setSearchTerm,
    setStatusFilter,
    setPaymentStatusFilter,
    setEnrollmentTypeFilter,
    setCourseFilter,
    setPage
} from "./admissionSlice";
import { AdmissionStatus, PaymentStatus, EnrollmentType } from "./admissionTypes";

export const useAdmissionsViewModel = () => {
    const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useAppDispatch();

    const {
        admissions,
        loading,
        error,
        page,
        totalPages,
        searchTerm,
        statusFilter,
        paymentStatusFilter,
        enrollmentTypeFilter,
        courseFilter
    } = useAppSelector((state: RootState) => state.admissions);

    const safeAdmissions = admissions || [];

    // Memoized fetch function
    const fetchAdmissionData = useCallback(() => {
        dispatch(fetchAdmissions({
            page,
            searchTerm,
            statusFilter,
            paymentStatusFilter,
            enrollmentTypeFilter,
            courseFilter
        }));
    }, [dispatch, page, searchTerm, statusFilter, paymentStatusFilter, enrollmentTypeFilter, courseFilter]);

    // Fetch admissions when filters change with debounce for search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchAdmissionData();
        }, searchTerm ? 300 : 0);

        return () => clearTimeout(timer);
    }, [fetchAdmissionData, searchTerm]);

    // Action Handlers
    const handleSearch = useCallback((term: string) => {
        dispatch(setSearchTerm(term));
    }, [dispatch]);

    const handleStatusFilter = useCallback((status: AdmissionStatus | null) => {
        dispatch(setStatusFilter(status));
    }, [dispatch]);

    const handlePaymentStatusFilter = useCallback((status: PaymentStatus | null) => {
        dispatch(setPaymentStatusFilter(status));
    }, [dispatch]);

    const handleEnrollmentTypeFilter = useCallback((type: EnrollmentType | string | null) => {
        const filteredType = type === '' || type === null ? null : type as EnrollmentType;
        dispatch(setEnrollmentTypeFilter(filteredType));
    }, [dispatch]);

    const handleCourseFilter = useCallback((courseId: number | null) => {
        dispatch(setCourseFilter(courseId?.toString() ?? null));
    }, [dispatch]);

    const handleResetFilters = useCallback(() => {
        dispatch(resetFilters());
    }, [dispatch]);

    const handlePageChange = useCallback((newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            dispatch(setPage(newPage));
        }
    }, [dispatch, totalPages]);

    return {
        // State
        admissions: safeAdmissions,
        isLoading: loading,
        error,
        page,
        totalPages: totalPages || 1,
        searchTerm,
        statusFilter,
        paymentStatusFilter,
        enrollmentTypeFilter,
        courseFilter,

        // Actions
        handleSearch,
        handleStatusFilter,
        handlePaymentStatusFilter,
        handleEnrollmentTypeFilter,
        handleCourseFilter,
        handleResetFilters,
        handlePageChange,
        refetch: fetchAdmissionData
    };
};
