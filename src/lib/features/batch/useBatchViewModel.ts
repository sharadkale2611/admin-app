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
    totalCount,
    searchTerm,
    activeOnly,
  } = useAppSelector((state: RootState) => state.batches);

  // 🔹 Fetch paginated batches whenever filters/page change
  useEffect(() => {
    dispatch(
      fetchBatches({
        page,
        searchTerm,
        activeOnly,
      })
    );
  }, [dispatch, page, searchTerm, activeOnly]);

  // 🔹 Search input handler (with debounce)
  const handleSearch = useCallback(
    (term: string) => {
      dispatch(setBatchSearchTerm(term));
      dispatch(setBatchPage(1)); // reset page
    },
    [dispatch]
  );

  const handleToggleActive = useCallback(() => {
    dispatch(toggleBatchActiveOnly());
    dispatch(setBatchPage(1));
  }, [dispatch]);

  const handleResetFilters = useCallback(() => {
    dispatch(resetBatchFilters());
  }, [dispatch]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      dispatch(setBatchPage(newPage));
    },
    [dispatch]
  );

  return {
    batches,
    isLoading: loading,
    error,

    page,
    totalPages,
    totalCount,

    searchTerm,
    activeOnly,

    handleSearch,
    handleToggleActive,
    handleResetFilters,
    handlePageChange,

    refetch: () =>
      dispatch(
        fetchBatches({
          page,
          searchTerm,
          activeOnly,
        })
      ),
  };
};
