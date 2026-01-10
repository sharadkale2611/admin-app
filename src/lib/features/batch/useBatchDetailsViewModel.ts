"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchBatchById } from "./batchThunks";
import { Batch } from "./batchTypes";

export function useBatchDetailsViewModel(id: number) {
  const dispatch = useAppDispatch();

  const { currentBatch, loading, error } = useAppSelector(
    (state) => state.batches
  );

  const [batch, setBatch] = useState<Batch | null>(null);

  useEffect(() => {
    if (!id) return;
    dispatch(fetchBatchById(id));
  }, [id]);

  useEffect(() => {
    if (currentBatch) {
      setBatch(currentBatch);
    }
  }, [currentBatch]);

  return {
    batch,
    isLoading: loading,
    error,
  };
}
