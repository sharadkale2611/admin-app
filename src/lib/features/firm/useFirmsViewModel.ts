// lib/featres/firm/useFirmsViewModel.ts

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { resetFilters, setSearchTerm, toggleActiveOnly, setPage } from "@/lib/features/firm/firmSlice";
import { fetchFirms } from "@/lib/features/firm/firmThunks";
import { useEffect, useCallback } from "react";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";

export const useFirmsViewModel = () => {
    // const dispatch = useAppDispatch();
    const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useAppDispatch();

    const {
        firms,
        loading,
        error,
        page,
        totalPages,
        searchTerm,
        activeOnly
    } = useAppSelector((state: RootState) => state.firms);

    // Memoized fetch function to prevent unnecessary recreations
    const fetchFirmsData = useCallback(() => {
        dispatch(fetchFirms({ page, searchTerm, activeOnly }));
    }, [dispatch, page, searchTerm, activeOnly]);

    // Fetch firms when filters change with debounce for search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchFirmsData();
        }, searchTerm ? 300 : 0); // Debounce only for search

        return () => clearTimeout(timer);
    }, [fetchFirmsData, searchTerm]);

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
        firms,
        isLoading: loading,
        error,
        page,
        totalPages,
        searchTerm,
        activeOnly,

        // Actions
        handleSearch,
        handleToggleActive,
        handleResetFilters,
        handlePageChange
    };
};