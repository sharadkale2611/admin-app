"use client";

import { useAppDispatch } from "@/lib/hooks";
import { createBatch } from "./batchThunks";
import type { CreateBatchDto } from "./batchTypes";
import Swal from "sweetalert2";

export const useCreateBatch = () => {
  const dispatch = useAppDispatch();

  const handleCreateBatch = async (dto: CreateBatchDto) => {
    const result = await dispatch(createBatch(dto));

    if (createBatch.fulfilled.match(result)) {
      await Swal.fire({
        icon: "success",
        title: "Batch Created",
        text: "Batch created successfully!",
      });
      return true;
    }

    const payload: any = result.payload;

    await Swal.fire({
      icon: "error",
      title: "Failed!",
      text: payload?.error || "Failed to create batch",
    });

    return false;
  };

  return { handleCreateBatch };
};
