"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchFirmById } from "./firmThunks";

export const useFirmDetailsViewModel = (id: string | undefined) => {
  const dispatch = useAppDispatch();

  const { currentFirm, loading, error } = useAppSelector((state) => state.firms);

  useEffect(() => {
    // 🔥 Fix: Avoid dispatching until id exists
    if (!id) return;

    dispatch(fetchFirmById(id));
  }, [id, dispatch]);

  return {
    firm: currentFirm,
    isLoading: loading,
    error,
  };
};
