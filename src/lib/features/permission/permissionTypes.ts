// permission/permissionTypes.ts

/* =======================
   Permission Model
======================= */

export interface Permission {
  permissionId: number;
  permissionKey: string;
  module: string;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
}

/* =======================
   Redux State
======================= */

export interface PermissionState {
  permissions: Permission[];
  currentPermission: Permission | null;
  loading: boolean;
  error: ApiError | null;
}

/* =======================
   DTOs
======================= */

export interface CreatePermissionDto {
  permissionKey: string;
  module: string;
  description?: string | null;
  isActive?: boolean;
}

export interface UpdatePermissionDto {
  id: number;
  permissionKey?: string;
  module?: string;
  description?: string | null;
  isActive?: boolean;
}

/* =======================
   Paginated Response
======================= */

export interface PaginatedPermissions {
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  items: Permission[];
}

/* =======================
   Common API Response
======================= */

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string | null;
  errors?: any | null;
}

export interface ApiError {
  error: string | null;
  errors: Record<string, string[]> | null;
}
