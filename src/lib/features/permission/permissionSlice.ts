// permissions/permissionsSlice.ts

import { createSlice } from "@reduxjs/toolkit";
import {
  fetchPermissions,
  fetchPermissionById,
  createPermission,
  updatePermission,
  deletePermission,
  fetchPermissionsPaginated,
} from "./permissionThunks";
import { ApiError, PermissionState } from "./permissionTypes";

const initialState: PermissionState = {
  permissions: [],
  currentPermission: null,
  loading: false,
  error: null,
};

const permissionsSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {
    clearCurrentPermission(state) {
      state.currentPermission = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ===============================
         GET ALL
      ================================ */
      .addCase(fetchPermissions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions = action.payload;
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as ApiError) ?? {
            error: "Failed to fetch permissions",
            errors: null,
          };
      })

      /* ===============================
         GET PAGINATED
      ================================ */
      .addCase(fetchPermissionsPaginated.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPermissionsPaginated.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions = action.payload.items;
      })
      .addCase(fetchPermissionsPaginated.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as ApiError) ?? {
            error: "Failed to fetch permissions",
            errors: null,
          };
      })

      /* ===============================
         CREATE
      ================================ */
      .addCase(createPermission.fulfilled, (state, action) => {
        if (action.payload.permission) {
          state.permissions.unshift(action.payload.permission);
        }
      })

      /* ===============================
         GET BY ID
      ================================ */
      .addCase(fetchPermissionById.fulfilled, (state, action) => {
        state.currentPermission = action.payload;
      })

      /* ===============================
         UPDATE
      ================================ */
      .addCase(updatePermission.fulfilled, (state, action) => {
        if (!action.payload.permission) return;

        state.permissions = state.permissions.map((p) =>
          p.permissionId === action.payload.permission!.permissionId
            ? action.payload.permission!
            : p
        );

        if (
          state.currentPermission?.permissionId ===
          action.payload.permission.permissionId
        ) {
          state.currentPermission = action.payload.permission;
        }
      })

      /* ===============================
         DELETE
      ================================ */
      .addCase(deletePermission.fulfilled, (state, action) => {
        state.permissions = state.permissions.filter(
          (p) => p.permissionId !== action.payload.id
        );
      });
  },
});

export const { clearCurrentPermission } = permissionsSlice.actions;
export default permissionsSlice.reducer;
