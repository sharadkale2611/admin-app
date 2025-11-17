// lib/features/staff/staffTypes.ts
export interface Staff {
    staffId: string;
    userId: string;
    userName: string;
    email: string;
    mobileNumber: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    position: string;
    department: string;
    hireDate: string;
    salary: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}


export interface PaginatedStaff {
    items: Staff[];
    totalCount: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
}



export interface StaffState {
    staff: Staff[];
    currentStaff: Staff | null;
    totalCount: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
    loading: boolean;
    error: string | null;

    searchTerm: string;
    isActive: boolean;
    page: number;

    selectedDepartment: string;
    selectedPosition: string;

    firmId: number | null; // ⭐ ADDED
}

export interface CreateStaffDto {
    userName: string;
    password: string;
    email: string;
    mobileNumber: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    position: string;
    department: string;
    hireDate: string;
    salary: number;
}

export interface UpdateStaffDto extends Partial<CreateStaffDto> {
    id: string;
    isActive?: boolean;
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string | null;
    errors?: any | null;
}
export interface FetchStaffParams {
    page?: number;
    searchTerm?: string;
    isActive?: boolean;
    department?: string;
    position?: string;
    pageSize?: number;
    firmId?: number | null;
}