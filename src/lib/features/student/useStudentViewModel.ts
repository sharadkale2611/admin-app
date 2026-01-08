import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect, useCallback } from "react";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { fetchStudents } from "./studentThunks";
import { resetFilters, setPage, setSearchTerm, toggleActiveOnly } from "./studentSlice";

export const useStudentViewModel = () => {
    const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useAppDispatch();

    const {
        students,
        loading,
        error,
        page,
        totalPages,
        searchTerm,
        activeOnly
    } = useAppSelector((state: RootState) => state.students);

    const safeStudents = students || [];

    // Memoized fetch function
    const fetchStudentData = useCallback(() => {
        dispatch(fetchStudents({
            page,
            searchTerm,
            activeOnly
        }));
    }, [dispatch, page, searchTerm, activeOnly]);

    // Fetch students when filters change with debounce for search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchStudentData();
        }, searchTerm ? 300 : 0);

        return () => clearTimeout(timer);
    }, [fetchStudentData, searchTerm]);

    /* ===============================
    DROPDOWN SUPPORT (NON-PAGINATED)
 ================================ */

    const ensureStudentsLoaded = useCallback(() => {
        if (!safeStudents.length && !loading) {
            dispatch(fetchStudents({
            page,
            searchTerm,
            activeOnly
        }));
        }
    }, [dispatch, safeStudents.length, loading]);

    // Action Handlers
    const handleSearch = useCallback((term: string) => {
        dispatch(setSearchTerm(term));
    }, [dispatch]);

    const handleToggleActive = useCallback(() => {
        dispatch(toggleActiveOnly());
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
        students: safeStudents,
        isLoading: loading,
        error,
        page,
        totalPages: totalPages || 1,
        searchTerm,
        activeOnly,

        // Actions
        handleSearch,
        handleToggleActive,
        handleResetFilters,
        handlePageChange,
        refetch: fetchStudentData,
        /* Dropdown */
        dropdownStudents: safeStudents,
        ensureStudentsLoaded,
    };
};