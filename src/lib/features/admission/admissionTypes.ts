// src/lib/features/admission/admissionTypes.ts

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data: T | null;
    error: string | null;
    errors?: Record<string, string[]> | null;
}

export enum EnrollmentType {
    Regular = 'Regular',
    Trial = 'Trial',
    Transfer = 'Transfer',
    Special = 'Special'
}


export enum PaymentStatus {
    Paid = 'Paid',
    Pending = 'Pending',
    PartiallyPaid = 'PartiallyPaid',
    Overdue = 'Overdue',
    Refunded = 'Refunded',
    Cancelled = 'Cancelled'
}

export enum AdmissionStatus {
    Active = 'Active',
    Inactive = 'Inactive'
}

export interface Admission {
    studentEnrollmentId: number;
    admissionId: number;
    studentId: number;
    studentName: string;
    courseId: number;
    courseName: string;
    enrollmentType: EnrollmentType;
    enrollmentDate: string; // ISO date string
    status: AdmissionStatus;
    paymentStatus: PaymentStatus;
    paidAmount: number;
    totalAmount: number;
    finalAmount: number;
    createdAt: string;
    updatedAt?: string;

    remarks?: string;
    courseFeeId?: number | null;
    discountCode?: string | null;     
    discountAmount?: number | null; 
    installments?: {
        installmentCount: number;
        amount: number;
        date: string;
    }[];
}

export interface UpdateAdmissionDto extends CreateAdmissionDto {
    studentEnrollmentId: number; 
    admissionId: number; // backend still needs this
}

export interface AdmissionFilters {
    searchTerm?: string;
    statusFilter?: AdmissionStatus | null;
    paymentStatusFilter?: PaymentStatus | null;
    courseFilter?: number | null; // courseId
}

export interface PaginatedAdmissions {
    totalCount: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
    items: Admission[];
}

export interface AdmissionState {
    admissions: Admission[];
    currentAdmission: Admission | null;
    totalCount: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
    loading: boolean;
    error: string | null;
    searchTerm: string;
    statusFilter: AdmissionStatus | null;
    enrollmentTypeFilter: EnrollmentType | null;
    paymentStatusFilter: string | null;
    courseFilter: string | null;       
    page: number;
}

export interface CreateAdmissionDto {
    studentId: number;
    courseId: number;
    enrollmentType: 'Regular' | 'Trial' | 'Transfer' | 'Special';
    enrollmentDate: string; // YYYY-MM-DD
    paymentStatus?: 'Paid' | 'Pending' | 'PartiallyPaid' | 'Overdue' | 'Refunded' | 'Cancelled';
    totalAmount: number;
    paidAmount?: number;
    discountCode?:string;
    discountAmount?:number;
    finalAmount: number;
    remarks?:string;
    lastTransactionId?:string;
    courseFeeId?: number | null;
    installmentCount?: number;
    installments?: { installmentCount: number; amount: number; date: string }[]; // formatted YYYY-MM-DD
}