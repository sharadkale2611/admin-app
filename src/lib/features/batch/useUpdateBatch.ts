"use client";

import { useAppDispatch } from "@/lib/hooks";
import { updateBatch } from "./batchThunks";
import Swal from "sweetalert2";

export const useUpdateBatch = () => {
  const dispatch = useAppDispatch();

  const handleUpdateBatch = async (id: number, dto: any) => {
    const result = await dispatch(updateBatch({ id, dto }));

    if (updateBatch.fulfilled.match(result)) {
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Batch updated successfully!",
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
      text: payload?.error || "Failed to update batch",
    });

    return false;
  };

  return { handleUpdateBatch };
};
