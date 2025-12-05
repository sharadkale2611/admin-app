"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import { createBatchStudyWork } from "./batchStudyWorkThunk";

export interface CreateFormData {
  workType: string;
  assignedBy: number | null;
  batchId: number | null;
  workTitle: string;
  workDescription?: string | null;
  expectedCompletionDate?: string | null;
  isActive: boolean;
}

export const useCreateBatchStudyWorkViewModel = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: CreateFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await dispatch(createBatchStudyWork(formData)).unwrap();

      // Redirect after success
      router.push("/BatchStudyWorks");
      return result;
    } catch (err: any) {
      console.error("Create Batch Study Work Error:", err);

      // Better error message extraction
      const message =
        err?.message ||
        err?.error ||
        err?.data?.message ||
        "Failed to create Batch Study Work";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    handleSubmit,
  };
};
