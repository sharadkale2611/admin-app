export interface Module {
    moduleId: number;
    firmId?: number | null;
    moduleName: string;
    moduleDescription?: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt?: string | null;
    isDeleted?: boolean;
}

export interface ModuleDto {
    moduleName: string;
    moduleDescription?: string | null;
    isActive: boolean;
}

export interface ModuleResponseDto{
    moduleId: number;
    moduleName: string;
    moduleDescription?: string | null;
    isActive: boolean;
    firmId?: number | null;
    firmName?: string | null;
    firmCode?: string | null;
    createdAt: string;
    updatedAt?: string | null;
    isDeleted?: boolean;
}

export interface ModuleState {
    modules: ModuleResponseDto[];
    currentModule: ModuleResponseDto | null;
    totalCount: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
    loading: boolean;
    error: string | null;
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string | null;
    errors?: Record<string, string[]> | null;
}
