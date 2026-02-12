import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect, useCallback } from "react";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";

import {
  fetchPermissions,
  fetchPermissionById,
  createPermission,
  updatePermission,
  deletePermission,
  fetchPermissionsPaginated,
} from "./permissionThunks";

import {
  CreatePermissionDto,
  UpdatePermissionDto,
} from "./permissionTypes";

export const usePermissionsViewModel = () => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> =
    useAppDispatch();

  const {
    permissions,
    currentPermission,
    loading,
    error,
  } = useAppSelector((state: RootState) => state.permissions);

  const safePermissions = permissions || [];

  /* ===============================
     Fetch Permissions
  ================================ */

  const fetchPermissionData = useCallback(() => {
    dispatch(fetchPermissions());
  }, [dispatch]);

  /* ===============================
     Initial Load
  ================================ */

  useEffect(() => {
    fetchPermissionData();
  }, [fetchPermissionData]);

  /* ===============================
     Action Handlers
  ================================ */

  const handleGetById = useCallback(
    (id: number) => {
      dispatch(fetchPermissionById(id));
    },
    [dispatch]
  );

  const handleCreate = useCallback(
    (dto: CreatePermissionDto) => {
      return dispatch(createPermission(dto));
    },
    [dispatch]
  );

  const handleUpdate = useCallback(
    (dto: UpdatePermissionDto) => {
      return dispatch(updatePermission(dto));
    },
    [dispatch]
  );

  const handleDelete = useCallback(
    (id: number) => {
      return dispatch(deletePermission(id));
    },
    [dispatch]
  );

  /* ===============================
     Paginated Fetch (Optional)
  ================================ */

  const fetchPaginated = useCallback(
    (params: {
      pageNumber?: number;
      pageSize?: number;
      search?: string;
      isActive?: boolean | null;
      module?: string | null;
    }) => {
      return dispatch(fetchPermissionsPaginated(params));
    },
    [dispatch]
  );

  return {
    /* ===== State ===== */
    permissions: safePermissions,
    currentPermission,
    isLoading: loading,
    error,

    /* ===== Actions ===== */
    getById: handleGetById,
    create: handleCreate,
    update: handleUpdate,
    remove: handleDelete,
    refetch: fetchPermissionData,
    fetchPaginated,
  };
};
