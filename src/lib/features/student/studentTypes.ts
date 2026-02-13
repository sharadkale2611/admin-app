export interface Student {
    studentId: number;
    userId: number;

    firmId?: number;
    firmCode?: string;
    firmName?: string;

    studentCode: string;
    aadharNumber: string;

    firstName: string;
    motherName?: string;
    fatherName?: string;
    lastName: string;

    profileImagePath?: string;

    dateOfBirth?: string;
    age?: number;

    gender?: string;

    email?: string;
    mobileNumber1?: string;
    mobileNumber2?: string;
    whatsappNumber?: string;

    resevationCategory?: string;
    fathersOccupation?: string;

    isActive: boolean;
    isDeleted: boolean;

    createdAt: string;
    updatedAt?: string;

    userName: string;
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
}


export interface CreateStudentDto {
    firmId?: number;

    firstName: string;
    motherName?: string;
    fatherName?: string;
    lastName: string;

    dateOfBirth?: string;
    gender?: 'M' | 'F' | 'O' | 'Male' | 'Female' | 'Other';

    email?: string;
    mobileNumber1?: string;
    mobileNumber2?: string;
    whatsappNumber?: string;

    resevationCategory?: string;
    fathersOccupation?: string;

    isActive?: boolean;

    profileImage?: File; // multipart/form-data
}


export interface UpdateStudentDto {
    firstName?: string;
    motherName?: string;
    fatherName?: string;
    lastName?: string;

    dateOfBirth?: string;
    gender?: 'M' | 'F' | 'O' | 'Male' | 'Female' | 'Other';

    email?: string;
    mobileNumber1?: string;
    mobileNumber2?: string;
    whatsappNumber?: string;

    resevationCategory?: string;
    fathersOccupation?: string;

    isActive?: boolean;
}


export interface CreateStudentResponse {
    studentId: number;
    studentCode: string;
    userName: string;
    firmId?: number;
    // inviteSent: boolean;
}


export interface StudentByAadharResponse {
    studentId: number;
    studentCode: string;
    aadharNumber: string;

    firstName: string;
    lastName: string;

    email?: string;
    mobileNumber1?: string;
    mobileNumber2?: string;

    gender?: string;
    fatherName?: string;
    motherName?: string;

    resevationCategory?: string;
    profileImagePath?: string;
    dateOfBirth?: string;
    fathersOccupation?: string;

    academicDetail?: any;
    addresses: any[];
}

export interface StudentBatchAssignment {
    studentBatchAssignmentId: number | null;
    firmId: number | null;

    studentEnrollmentId: number;

    studentName: string;
    profileImagePath?: string;

    batchId: number;
    batchCode: string;

    assignmentDate?: string;
    assignmentType?: string;
    remark?: string | null;

    isActive: boolean;
    isDeleted: boolean;

    createdAt?: string;
    updatedAt?: string | null;
}


export interface FetchStudentParams {
    page?: number;
    searchTerm?: string;
    activeOnly?: boolean;
}


export interface ModuleWiseAttendanceItem {
    moduleId: number;
    moduleName: string | null;
    courseName: string | null;
    batchName: string;
    staffName: string;
    totalMarkedSessions: number;
    presentSessions: number;
    absentSessions: number;
    leaveSessions: number;
    lateSessions: number;
    percentage: number;
}

export interface ModuleWiseAttendanceResponse {
    from: string;
    to: string;
    items: ModuleWiseAttendanceItem[];
}


export interface ExamPerformanceItem {
    examMarkId: number;

    studentId: number;
    studentName: string;

    examId: number;
    examName: string;
    courseName: string;
    moduleName: string;

    examTotalMarks: number;
    examPassingMarks: number;

    markObtained: number;
    grade: string;

    result: string;
    status: string;

    createdAt: string;
}

export interface ExamPerformanceResponse {
    studentId: number;
    items: ExamPerformanceItem[];
}


export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string | null;
    errors?: Record<string, string[]> | null;
}


export interface ApiError {
    error: string | null;       // single error
    errors: Record<string, string[]> | null;

}