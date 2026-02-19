"use client";

import { useCallback } from "react";
import Swal from "sweetalert2";
import { useAppDispatch } from "@/lib/hooks";
import { deleteFirmSaaSFeatureUsage } from "./firmSaaSFeatureUsageThunks";

export const useDeleteFirmSaaSFeatureUsage = () => {
  const dispatch = useAppDispatch();

  const handleDelete = useCallback(
    async (firmId: number, saasFeatureId: number, title?: string) => {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `You are about to delete "${title ?? `${firmId}/${saasFeatureId}`}". This action cannot be undone.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        reverseButtons: true,
      });

      if (!result.isConfirmed) return false;

      await dispatch(deleteFirmSaaSFeatureUsage({ firmId, saasFeatureId })).unwrap();
      return true;
    },
    [dispatch]
  );

  return { handleDelete };
};