"use client";

import { useCallback } from "react";
import Swal from "sweetalert2";
import { useAppDispatch } from "@/lib/hooks";
import { deleteFirmSaaSFeature } from "./firmSaaSFeatureThunks";

export const useDeleteFirmSaaSFeature = () => {
  const dispatch = useAppDispatch();

  const handleDelete = useCallback(
    async (id: number, title?: string) => {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `You are about to delete "${title ?? `#${id}`}". This action cannot be undone.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        await dispatch(deleteFirmSaaSFeature(id)).unwrap();
        return true;
      }

      return false;
    },
    [dispatch]
  );

  return { handleDelete };
};