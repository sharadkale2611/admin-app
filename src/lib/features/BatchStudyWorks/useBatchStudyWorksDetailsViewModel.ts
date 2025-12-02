"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchBatchStudyWorkById } from "./batchStudyWorkThunk";
import { clearBatchStudyWorkState } from "./batchStudyWorkSlice";

export const useBatchStudyWorksDetailsViewModel = (
  id: string | number | undefined
) => {
  const dispatch = useAppDispatch();

  const { current, loading, error } = useAppSelector(
    (state) => state.batchStudyWorks
  );

  useEffect(() => {
    if (!id) return;

    const numericId = typeof id === "string" ? Number(id) : id;

    if (!numericId || isNaN(numericId)) return;

    // CLEAR old record
    dispatch(clearBatchStudyWorkState());

    // ALWAYS FETCH NEW RECORD
    dispatch(fetchBatchStudyWorkById(numericId));

  }, [id, dispatch]);

  return {
    batchStudyWork: current,
    isLoading: loading,
    error,
  };
};
