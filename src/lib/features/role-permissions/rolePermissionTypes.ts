// src/lib/features/role-permissions/rolePermissionTypes.ts

export interface RolePermissionView {
    permissionId: number;
    permissionKey: string;
    module: string;
    isAllowed: boolean;

    // 🔥 NEW
    isUserOverride?: boolean;
    userAllowed?: boolean;
}

export interface RolePermissionState {
    items: RolePermissionView[];
    original: RolePermissionView[];
    loading: boolean;
    saving: boolean;
    error: ApiError | null;
}

export interface ApiError {
    error: string | null;
    errors: Record<string, string[]> | null;
}
