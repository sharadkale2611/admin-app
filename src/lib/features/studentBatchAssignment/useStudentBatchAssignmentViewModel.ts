import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect, useCallback } from "react";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";

import { 
    fetchSBAPaginated 
} from "./studentBatchAssignmentThunks";

import { 
    resetFilters, 
    setPage, 
    setSearchTerm, 
    toggleActiveOnly 
} from "./studentBatchAssignmentSlice";


// ------------------------------------------------------
//   ViewModel Hook - Student Batch Assignments
// ------------------------------------------------------
export const useStudentBatchAssignmentViewModel = () => {

    const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useAppDispatch();

    const {
        assignments,
        loading,
        error,
        page,
        totalPages,
        searchTerm,
        activeOnly
    } = useAppSelector((state: RootState) => state.studentBatchAssignments);

    const safeAssignments = assignments || [];

    // Wrapped fetch logic
    const fetchData = useCallback(() => {
        dispatch(
            fetchSBAPaginated({
                page,
                searchTerm,
                activeOnly
            })
        );
    }, [dispatch, page, searchTerm, activeOnly]);

    // Auto fetch on search, page, filter change
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, searchTerm ? 300 : 0); // Debounce search

        return () => clearTimeout(timer);
    }, [fetchData, searchTerm]);

    // Action handlers
    const handleSearch = useCallback(
        (term: string) => {
            dispatch(setSearchTerm(term));
        },
        [dispatch]
    );

    const handleToggleActive = useCallback(
        () => {
            dispatch(toggleActiveOnly());
        },
        [dispatch]
    );

    const handleResetFilters = useCallback(
        () => {
            dispatch(resetFilters());
        },
        [dispatch]
    );

    const handlePageChange = useCallback(
        (newPage: number) => {
            if (newPage >= 1 && newPage <= (totalPages || 1)) {
                dispatch(setPage(newPage));
            }
        },
        [dispatch, totalPages]
    );

    return {
        // State
        assignments: safeAssignments,
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

        // Manual refresh
        refetch: fetchData
    };
};
