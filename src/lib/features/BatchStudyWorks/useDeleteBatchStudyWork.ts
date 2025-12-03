"use client";

import Swal from "sweetalert2";
import { useAppDispatch } from "@/lib/hooks";
import { deleteBatchStudyWork } from "./batchStudyWorkThunk";

export const useDeleteBatchStudyWork = () => {
  const dispatch = useAppDispatch();

  /**
   * Delete handler with SweetAlert confirmation
   */
  const handleDelete = async (id: number, title: string): Promise<boolean> => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete "${title}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete",
    });

    if (!result.isConfirmed) return false;

    try {
      const res = await dispatch(deleteBatchStudyWork(id)).unwrap();

      Swal.fire("Deleted!", "Batch study work has been removed.", "success");
      return true;
    } catch (err: any) {
      Swal.fire(
        "Error",
        err?.error || "Failed to delete the batch study work.",
        "error"
      );
      return false;
    }
  };

  return { handleDelete };
};
