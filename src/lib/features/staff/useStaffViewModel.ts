// lib/features/staff/useStaffViewModel.ts
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
    setFirmId,
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

    // ⭐ Auth user (firmId comes from backend)
    const authUser = useAppSelector((state: RootState) => state.auth.user);

    // ⭐ Staff slice state
    const {
        staff,
        loading,
        error,
        page,
        totalPages,
        pageSize,
        searchTerm,
        isActive,
        selectedDepartment,
        selectedPosition,
        firmId
    } = useAppSelector((state: RootState) => state.staff);

    const safeStaff = staff || [];

    /* ============================================================
       ⭐ Auto-set firmId when user logs in (only when changed)
       ============================================================ */
    useEffect(() => {
        if (authUser?.firmId && firmId !== Number(authUser.firmId)) {
            dispatch(setFirmId(Number(authUser.firmId))); 
        }
    }, [authUser?.firmId, firmId, dispatch]);

    /* ============================================================
       ⭐ Fetch staff with all filters + firmId
       ============================================================ */
    const fetchStaffData = useCallback(() => {
        dispatch(
            fetchStaff({
                page,
                pageSize,
                searchTerm,
                isActive,
                department: selectedDepartment,
                position: selectedPosition,
                firmId
            })
        );
    }, [
        dispatch,
        page,
        pageSize,
        searchTerm,
        isActive,
        selectedDepartment,
        selectedPosition,
        firmId
    ]);

    /* ============================================================
       ⭐ Auto refetch (debounced search)
       ============================================================ */
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchStaffData();
        }, searchTerm ? 300 : 0);

        return () => clearTimeout(timer);
    }, [fetchStaffData, searchTerm]);

    /* ============================================================
       ⭐ Action handlers for UI
       ============================================================ */
    const handleSearch = useCallback(
        (term: string) => {
            dispatch(setSearchTerm(term));
        },
        [dispatch]
    );

    const handleToggleActive = useCallback(() => {
        dispatch(toggleActiveOnly());
    }, [dispatch]);

    const handleDepartmentChange = useCallback(
        (value: string) => {
            dispatch(setDepartmentFilter(value));
        },
        [dispatch]
    );

    const handlePositionChange = useCallback(
        (value: string) => {
            dispatch(setPositionFilter(value));
        },
        [dispatch]
    );

    const handleResetFilters = useCallback(() => {
        dispatch(resetFilters());
    }, [dispatch]);

    const handlePageChange = useCallback(
        (newPage: number) => {
            if (newPage >= 1 && newPage <= totalPages) {
                dispatch(setPage(newPage));
            }
        },
        [dispatch, totalPages]
    );

    /* ============================================================
       ⭐ Return values to UI
       ============================================================ */
    return {
        staff: safeStaff,
        isLoading: loading,
        error,
        page,
        totalPages: totalPages || 1,

        searchTerm,
        isActive,
        department: selectedDepartment,
        position: selectedPosition,
        firmId,

        handleSearch,
        handleToggleActive,
        handleDepartmentChange,
        handlePositionChange,
        handleResetFilters,
        handlePageChange,
        refetch: fetchStaffData
    };
};
