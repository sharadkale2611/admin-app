import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { fetchPermissionById } from "./permissionThunks";

export const usePermissionDetailsViewModel = (permissionId: string) => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> =
    useAppDispatch();

  const { currentPermission, loading, error } = useAppSelector(
    (state: RootState) => state.permissions
  );

  useEffect(() => {
    if (permissionId && !currentPermission) {
      dispatch(fetchPermissionById(Number(permissionId)));
    }
  }, [dispatch, permissionId, currentPermission]);

  return {
    permission: currentPermission,
    isLoading: loading,
    error,
  };
};
