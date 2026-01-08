import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  setFirmId,
  resetFilters,
  setSearchTerm,
  toggleActiveOnly,
  setPage,
} from "./examSlice";

import { fetchExams } from "./examThunks";
import { useEffect, useCallback } from "react";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";

export const useExamViewModel = () => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> =
    useAppDispatch();

  // ⭐ Get auth user (firmId comes from backend)
  const authUser = useAppSelector((state: RootState) => state.auth.user);

  // ⭐ Exam slice state
  const {
    exams,
    loading,
    error,

    page,
    totalPages,
    pageSize,

    searchTerm,
    isActive,
    firmId
  } = useAppSelector((state: RootState) => state.exam);

  const safeExams = exams || [];

  /* ============================================================
      ⭐ Auto-set firmId when user logs in
  ============================================================ */
  useEffect(() => {
    if (authUser?.firmId && firmId !== Number(authUser.firmId)) {
      dispatch(setFirmId(Number(authUser.firmId)));
    }
  }, [authUser?.firmId, firmId, dispatch]);

  /* ============================================================
      ⭐ Fetch exams with filters + firmId
  ============================================================ */
  const fetchExamData = useCallback(() => {
    dispatch(
      fetchExams({
        page,
        pageSize,
        searchTerm,
        isActive,
        firmId
      })
    );
  }, [dispatch, page, pageSize, searchTerm, isActive, firmId]);

  /* ============================================================
      ⭐ Auto refetch (debounced search)
  ============================================================ */
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchExamData();
    }, searchTerm ? 300 : 0);

    return () => clearTimeout(timer);
  }, [fetchExamData, searchTerm]);

  /* ============================================================
      ⭐ UI handlers
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
      ⭐ Return values for UI components
  ============================================================ */
  return {
    exams: safeExams,
    isLoading: loading,
    error,

    page,
    totalPages: totalPages || 1,

    searchTerm,
    isActive,
    firmId,

    handleSearch,
    handleToggleActive,
    handleResetFilters,
    handlePageChange,
    refetch: fetchExamData
  };
};
