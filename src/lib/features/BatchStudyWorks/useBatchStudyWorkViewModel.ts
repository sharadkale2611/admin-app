"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

import { fetchBatchStudyWorks } from "./batchStudyWorkThunk";

import {
  setSearchTerm,
  toggleActiveOnly,
  resetFilters,
  setPage,
} from "./batchStudyWorkSlice";

export const useBatchStudyWorkViewModel = () => {
  const dispatch = useAppDispatch();

  const {
    items,
    loading,
    error,
    searchTerm,
    activeOnly,
    page,
    totalPages,
    pageSize,
    totalCount,
  } = useAppSelector((state) => state.batchStudyWorks);

  // ---------------------------------------------------
  // 🔄 REFETCH FUNCTION
  // ---------------------------------------------------
  const refetch = () => {
    dispatch(
      fetchBatchStudyWorks({
        page,
        searchTerm,
        activeOnly,
      })
    );
  };

  // ---------------------------------------------------
  // 📌 FETCH WHEN FILTERS CHANGE
  // ---------------------------------------------------
  useEffect(() => {
    dispatch(
      fetchBatchStudyWorks({
        page,
        searchTerm,
        activeOnly,
      })
    );
  }, [page, searchTerm, activeOnly, dispatch]);

  // ---------------------------------------------------
  // 🔍 SEARCH HANDLER
  // ---------------------------------------------------
  const handleSearch = (value: string) => {
    dispatch(setSearchTerm(value));
    dispatch(setPage(1)); // Reset page when searching
  };

  // ---------------------------------------------------
  // 🟢 ACTIVE TOGGLE HANDLER
  // ---------------------------------------------------
  const handleToggleActive = () => {
    dispatch(toggleActiveOnly());
    dispatch(setPage(1)); // Reset page
  };

  // ---------------------------------------------------
  // 🔄 RESET FILTERS
  // ---------------------------------------------------
  const handleResetFilters = () => {
    dispatch(resetFilters());
    dispatch(setPage(1));
  };

  // ---------------------------------------------------
  // 📄 PAGINATION
  // ---------------------------------------------------
  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
  };

  return {
    // Data
    items,
    loading,
    error,

    // Filters
    searchTerm,
    activeOnly,

    // Pagination
    page,
    totalPages,
    pageSize,
    totalCount,

    // Actions
    handleSearch,
    handleToggleActive,
    handleResetFilters,
    handlePageChange,
    refetch,
  };
};
