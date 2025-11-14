"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { updateFirm } from "./firmThunks";

export const useUpdateFirm = () => {
  const dispatch = useAppDispatch();

  const { loading, error } = useAppSelector((state) => state.firms);

  const handleUpdate = async (dto: {
    firmId: number;
    firmName: string;
    firmCode: string;
    isActive: boolean;
  }) => {
    const result = await dispatch(updateFirm(dto));

    if (updateFirm.fulfilled.match(result)) {
      return true; // success
    }

    return false; // failed
  };

  return {
    handleUpdate,
    isLoading: loading,
    error,
  };
};
