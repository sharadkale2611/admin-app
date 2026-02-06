// roles/roleTypes.ts

export interface Role {
    roleId: number;       // short in backend, number in TS
    roleName: string;
    isActive: boolean;
}

export interface RoleState {
    roles: Role[];
    currentRole: Role | null;
    loading: boolean;
    error: ApiError | null;
}

/* ===== Common API Response ===== */

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
