export interface Student {
    studentId: string;
    userId: string;
    studentCode: string;
    userName: string;
    email: string;
    mobileNumber: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    firmId?: string;
    firmCode?: string;
    firmName?: string;
}

export interface CreatedStudent {
    studentId: number;
    studentCode: string;
    userName: string;
}
export interface PaginatedStudent {
    items: Student[];
    totalCount: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
}

export interface StudentState {
    students: Student[];
    currentStudent: Student | null;
    totalCount: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
    loading: boolean;
    error: string | null;
    searchTerm: string;
    activeOnly: boolean;
    page: number;
}

export interface CreateStudentDto {
    studentCode: string;
    userName: string;
    password: string;
    email: string;
    mobileNumber: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
}

export interface UpdateStudentDto extends Partial<CreateStudentDto> {
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

export interface CreateStudentResponse {
    studentId: number;
    studentCode: string;
    userName: string;
    // inviteSent: boolean;
}

export type StudentByMobileResponse = {
    id: number;
    firstName: string;
    lastName: string;
    email?: string;
    profileImagePath?: string;

};


export interface FetchStudentParams {
    page?: number;
    searchTerm?: string;
    activeOnly?: boolean;
}

export interface ApiError {
    error: string | null;       // single error
    errors: Record<string, string[]> | null;

}