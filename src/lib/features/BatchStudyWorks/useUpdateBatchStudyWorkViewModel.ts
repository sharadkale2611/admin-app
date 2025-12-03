"use client";

import { useAppDispatch } from "@/lib/hooks";
import { updateBatchStudyWork } from "./batchStudyWorkThunk";
import Swal from "sweetalert2";

export const useUpdateBatchStudyWork = () => {
  const dispatch = useAppDispatch();

  const handleUpdateBatchStudyWork = async (id: number, dto: any) => {
    // 👉 FIX: MERGE id + dto
    const result = await dispatch(updateBatchStudyWork({ id, ...dto }));

    if (updateBatchStudyWork.fulfilled.match(result)) {
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Batch Study Work updated successfully!",
        timer: 800,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return true;
    }

    const payload: any = result.payload;
    Swal.fire({
      icon: "error",
      title: "Error",
      text: payload?.error || "Failed to update Batch Study Work",
    });

    return false;
  };

  return { handleUpdateBatchStudyWork };
};
