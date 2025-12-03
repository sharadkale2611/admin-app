// src/lib/features/batch/useBatchViewModel.ts

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useCallback, useEffect } from "react";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { fetchBatches } from "./batchThunks";
import {
  resetBatchFilters,
  setBatchPage,
  setBatchSearchTerm,
  toggleBatchActiveOnly,
} from "./batchSlice";

export const useBatchViewModel = () => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useAppDispatch();

  const {
    batches,
    loading,
    error,
    page,
    totalPages,
    searchTerm,
    activeOnly,
  } = useAppSelector((state: RootState) => state.batches);

  const safeBatches = batches || [];

  // API call
  const fetchBatchData = useCallback(() => {
    dispatch(
      fetchBatches({
        page,
        searchTerm,
        activeOnly,
      })
    );
  }, [dispatch, page, searchTerm, activeOnly]);

  // 1️⃣ FETCH IMMEDIATELY ON FIRST LOAD (IMPORTANT FIX)
  useEffect(() => {
    fetchBatchData();
  }, []); // run only once

  // 2️⃣ Debounce when searchTerm changes
  useEffect(() => {
    if (!searchTerm) return; // skip debounce for empty search

    const timer = setTimeout(() => {
      fetchBatchData();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, fetchBatchData]);

  // Search handler
  const handleSearch = useCallback(
    (term: string) => {
      dispatch(setBatchSearchTerm(term));
    },
    [dispatch]
  );

  const handleToggleActive = useCallback(() => {
    dispatch(toggleBatchActiveOnly());
  }, [dispatch]);

  const handleResetFilters = useCallback(() => {
    dispatch(resetBatchFilters());
  }, [dispatch]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= (totalPages || 1)) {
        dispatch(setBatchPage(newPage));
      }
    },
    [dispatch, totalPages]
  );

  return {
    batches: safeBatches,
    isLoading: loading,
    error,
    page,
    totalPages: totalPages || 1,
    searchTerm,
    activeOnly,

    handleSearch,
    handleToggleActive,
    handleResetFilters,
    handlePageChange,

    // Allow manual reload
    refetch: fetchBatchData,
  };
};
