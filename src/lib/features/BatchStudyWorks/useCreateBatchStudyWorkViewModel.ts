"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import { createBatchStudyWork } from "./batchStudyWorkThunk";
import Swal from "sweetalert2";

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

      // ✔ SUCCESS SweetAlert (same style as update)
      Swal.fire({
        icon: "success",
        title: "Created!",
        text: "Batch Study Work created successfully!",
        timer: 1000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      // Redirect only after success
      setTimeout(() => {
        router.push("/BatchStudyWorks");
      }, 1000);

      return result;
    } catch (err: any) {
      console.error("Create Batch Study Work Error:", err);

      // Extract proper error detail
      const message =
        err?.message ||
        err?.error ||
        err?.data?.message ||
        "Failed to create Batch Study Work";

      setError(message);

      // ❌ ERROR SweetAlert
      Swal.fire({
        icon: "error",
        title: "Create Failed",
        text: message,
      });
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
