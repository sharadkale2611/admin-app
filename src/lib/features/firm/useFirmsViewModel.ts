import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchFirms } from "./firmThunks";
import { setSearchTerm, toggleActiveOnly, resetFilters, setPage } from "./firmSlice";

export const useFirmsViewModel = () => {
    const dispatch = useAppDispatch();
    const {
        firms,
        loading,
        error,
        page,
        searchTerm,
        activeOnly,
        totalPages
    } = useAppSelector((state) => state.firms);

    // ⭐ Reusable function to fetch data
    const refetch = () => {
        dispatch(
            fetchFirms({
                page,
                searchTerm,
                activeOnly
            })
        );
    };

    // Fetch on mount & when filters change
    useEffect(() => {
        refetch();
    }, [page, searchTerm, activeOnly]);

    const handleSearch = (value: string) => {
        dispatch(setSearchTerm(value));
        dispatch(setPage(1)); // reset to first page
    };

    const handleToggleActive = () => {
        dispatch(toggleActiveOnly());
        dispatch(setPage(1));
    };

    const handleResetFilters = () => {
        dispatch(resetFilters());
        dispatch(setPage(1));
    };

    const handlePageChange = (newPage: number) => {
        dispatch(setPage(newPage));
    };

    return {
        firms,
        isLoading: loading,
        error,
        page,
        totalPages,
        searchTerm,
        activeOnly,
        handleSearch,
        handleToggleActive,
        handleResetFilters,
        handlePageChange,
        refetch,   // ⭐ NOW AVAILABLE
    };
};
