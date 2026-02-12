import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "@/lib/store";
import {
  Permission,
  CreatePermissionDto,
  UpdatePermissionDto,
  PaginatedPermissions,
  ApiResponse,
  ApiError,
} from "./permissionTypes";
import API_ENDPOINTS from "@/lib/config/apiConfig";
import api from "@/lib/services/apiService";

/* ===============================
   Error Parser
================================ */

function parseApiError(error: any): ApiError {
  if (error?.response?.data) {
    const data = error.response.data;

    if (data.errors && typeof data.errors === "object") {
      const flattened = Object.entries(data.errors).flatMap(([field, msgs]) =>
        (msgs as string[]).map((msg) => `${field}: ${msg}`)
      );
      return { error: null, errors: null };
    }

    if (data.error) {
      return { error: data.error, errors: null };
    }
  }

  return { error: "An unknown error occurred", errors: null };
}

/* ===============================
   GET ALL PERMISSIONS
================================ */

export const fetchPermissions = createAsyncThunk<
  Permission[],
  void,
  { dispatch: AppDispatch; state: RootState; rejectValue: ApiError }
>(
  "permissions/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<Permission[]>(
        API_ENDPOINTS.PERMISSIONS.GET_LIST,
        { withCredentials: true }
      );

      if (!response?.success || !response.data) {
        return rejectWithValue({
          error: response?.message || "No data returned",
          errors: null,
        });
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(parseApiError(error));
    }
  }
);

/* ===============================
   GET PERMISSIONS (PAGINATED)
================================ */

export const fetchPermissionsPaginated = createAsyncThunk<
  PaginatedPermissions,
  {
    pageNumber?: number;
    pageSize?: number;
    search?: string;
    isActive?: boolean | null;
    module?: string | null;
  },
  { rejectValue: ApiError }
>(
  "permissions/fetchPaginated",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get<PaginatedPermissions>(
        API_ENDPOINTS.PERMISSIONS.GET_PAGINATED,
        {
          params,
          withCredentials: true,
        }
      );

      if (!response?.success || !response.data) {
        return rejectWithValue({
          error: response?.message || "Failed to load permissions",
          errors: null,
        });
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(parseApiError(error));
    }
  }
);

/* ===============================
   GET PERMISSION BY ID
================================ */

export const fetchPermissionById = createAsyncThunk<
  Permission,
  number,
  { rejectValue: ApiError }
>(
  "permissions/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get<Permission>(
        `${API_ENDPOINTS.PERMISSIONS.GET_BY_ID}/${id}`,
        { withCredentials: true }
      );

      if (!response?.success || !response.data) {
        return rejectWithValue({
          error: "Permission not found",
          errors: null,
        });
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(parseApiError(error));
    }
  }
);

/* ===============================
   CREATE PERMISSION
================================ */

export const createPermission = createAsyncThunk<
  { success: boolean; permission: Permission | null; message: string },
  CreatePermissionDto,
  { rejectValue: ApiError }
>(
  "permissions/create",
  async (dto, { rejectWithValue }) => {
    try {
      const response = await api.post<Permission >(
        API_ENDPOINTS.PERMISSIONS.POST_CREATE,
        dto,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response?.success) {
        return rejectWithValue({
          error: response?.message || "Create failed",
          errors: null,
        });
      }

      return {
        success: true,
        message: response.message || "Permission created",
        permission: response.data  ?? null,
      };
    } catch (error: any) {
      return rejectWithValue(parseApiError(error));
    }
  }
);

/* ===============================
   UPDATE PERMISSION
================================ */

export const updatePermission = createAsyncThunk<
  { success: boolean; permission: Permission | null; message: string },
  UpdatePermissionDto,
  { rejectValue: ApiError }
>(
  "permissions/update",
  async (dto, { rejectWithValue }) => {
    try {
      const response = await api.put<Permission>(
        `${API_ENDPOINTS.PERMISSIONS.PUT_UPDATE}/${dto.id}`,
        dto,
        { withCredentials: true }
      );

      if (!response?.success) {
        return rejectWithValue({
          error: response?.message || "Update failed",
          errors: null,
        });
      }

      return {
        success: true,
        message: response.message || "Permission updated",
        permission: response.data ?? null,
      };
    } catch (error: any) {
      return rejectWithValue(parseApiError(error));
    }
  }
);

/* ===============================
   DELETE PERMISSION
================================ */

export const deletePermission = createAsyncThunk<
  { success: boolean; id: number },
  number,
  { rejectValue: ApiError }
>(
  "permissions/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(
        `${API_ENDPOINTS.PERMISSIONS.DELETE}/${id}`,
        { withCredentials: true }
      );

      return { success: true, id };
    } catch (error: any) {
      return rejectWithValue(parseApiError(error));
    }
  }
);
