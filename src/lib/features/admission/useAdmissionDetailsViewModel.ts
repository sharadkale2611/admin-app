// src/lib/features/admission/useAdmissionDetailsViewModel.ts

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect, useCallback } from "react";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { fetchAdmissionById } from "./admissionThunks";
import { clearCurrentAdmission } from "./admissionSlice";

export const useAdmissionDetailsViewModel = (id: string) => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useAppDispatch();

  // Convert the route param string → number
  const numericId = Number(id);

  const { currentAdmission, loading, error } = useAppSelector(
    (state: RootState) => state.admissions
  );

  // Load admission details
  const loadAdmission = useCallback(() => {
    if (!isNaN(numericId)) {
      dispatch(fetchAdmissionById(numericId));
    }
  }, [dispatch, numericId]);

  useEffect(() => {
    loadAdmission();

    // Cleanup when leaving the details page
    return () => {
      dispatch(clearCurrentAdmission());
    };
  }, [loadAdmission, dispatch]);

  return {
    admission: currentAdmission,
    isLoading: loading,
    error,
    refetch: loadAdmission,
  };
};
