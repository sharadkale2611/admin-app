// -----------------------------
// StudentBatchAssignment Types
// -----------------------------

export interface StudentBatchAssignment {
    studentBatchAssignmentId: number;
    studentEnrollmentId: number;
    studentName?: string | null;
    profileImagePath?: string | null;

    batchId: number;
    batchCode?: string | null;

    assignmentDate: string;
    assignmentType: string; // fresh / merged
    remark?: string | null;

    isActive: boolean;
    isDeleted: boolean;

    createdAt: string;
    updatedAt?: string | null;
}

export interface PaginatedStudentBatchAssignment {
    items: StudentBatchAssignment[];
    totalCount: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
}

// CREATE DTO
export interface CreateStudentBatchAssignmentDto {
    studentEnrollmentId: number;
    batchId: number;
    assignmentDate: string;  // ISO string
    assignmentType: string;  // fresh / merged
    remark?: string | null;
    isActive: boolean;
}

export interface CreateBulkStudentBatchAssignmentDto {
    studentEnrollmentIds: number[];
    batchId: number;
    assignmentDate: string;
    assignmentType: string;
    remark?: string | null;
    isActive: boolean;
}

// UPDATE DTO
export interface UpdateStudentBatchAssignmentDto {
    id: number;
    studentEnrollmentId?: number;
    batchId?: number;
    assignmentDate?: string;
    assignmentType?: string;
    remark?: string | null;
    isActive?: boolean;
}

// API Response Wrapper
export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string | null;
    errors?: any | null;
}

// Query params (pagination)
export interface FetchSBAPaginationParams {
    page?: number;
    searchTerm?: string;
    activeOnly?: boolean;
}

// Error Standard Type (same as student module)
export interface ApiError {
    error: string | null;
    errors: string[] | null;
}
