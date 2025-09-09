// lib/features/staff/useStaffViewModel.ts
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
    resetFilters,
    setSearchTerm,
    toggleActiveOnly,
    setPage,
    setDepartmentFilter,
    setPositionFilter
} from "@/lib/features/staff/staffSlice";
import { fetchStaff } from "@/lib/features/staff/staffThunks";
import { useEffect, useCallback } from "react";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";

export const useStaffViewModel = () => {
    const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useAppDispatch();


    const {
        staff,
        loading,
        error,
        page,
        totalPages,
        searchTerm,
        activeOnly,
        selectedDepartment: department,
        selectedPosition: position
    } = useAppSelector((state: RootState) => state.staff);

    const safeStaff = staff || [];

    // Memoized fetch function
    const fetchStaffData = useCallback(() => {
        dispatch(fetchStaff({
            page,
            searchTerm,
            activeOnly,
            department,
            position
        }));
    }, [dispatch, page, searchTerm, activeOnly, department, position]);

    // Fetch staff when filters change with debounce for search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchStaffData();
        }, searchTerm ? 300 : 0);

        return () => clearTimeout(timer);
    }, [fetchStaffData, searchTerm]);

    // Action Handlers
    const handleSearch = useCallback((term: string) => {
        dispatch(setSearchTerm(term));
    }, [dispatch]);

    const handleToggleActive = useCallback(() => {
        dispatch(toggleActiveOnly());
    }, [dispatch]);

    const handleDepartmentChange = useCallback((dept: string) => {
        dispatch(setDepartmentFilter(dept));
    }, [dispatch]);

    const handlePositionChange = useCallback((pos: string) => {
        dispatch(setPositionFilter(pos));
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
        staff: safeStaff,
        isLoading: loading,
        error,
        page,
        totalPages: totalPages || 1,
        searchTerm,
        activeOnly,
        department,
        position,

        // Actions
        handleSearch,
        handleToggleActive,
        handleDepartmentChange,
        handlePositionChange,
        handleResetFilters,
        handlePageChange,
        refetch: fetchStaffData
    };
};