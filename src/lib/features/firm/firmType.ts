// lib/features/firm/firmTypes.ts
export interface Firm {
    firmId: number;
    firmName: string;
    firmCode: string;
    isActive: boolean;
}

export interface PaginatedFirms {
    items: Firm[];
    totalCount: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
}

export interface FirmsState {
    firms: Firm[];
    totalCount: number;
    currentFirm: Firm | null;     
    pageSize: number;
    currentPage: number;
    totalPages: number;
    loading: boolean;
    error: string | null;
    searchTerm: string;
    activeOnly: boolean;
    page: number;
}

export interface CreateFirmDto {
    firmName: string;
    firmCode: string;
    isActive: boolean;
}

export interface UpdateFirmDto {
    firmId: number;      // required to identify the firm to update
    firmName: string;
    firmCode: string;
    isActive: boolean;
}


// export interface ApiResponse<T> {
//     success: boolean;
//     message?: string;
//     data?: T;
//     error?: string | null;
//     errors?: any | null;
// }

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
    error: string | null;
    errors: Record<string, string[]> | null;
}
