// src/lib/features/studentPayment/studentPaymentType.ts
export interface StudentPaymentLog {
    studentPaymentLogId?: number;
    paidAmount: number;
    paymentMode?: string | null;
    paymentGateway?: string | null;
    transactionId?: string | null;
    paidDate?: string | null;
    paymentStatus?: string | null;
    createdAt?: string;
}


export interface StudentPayment {
    studentPaymentId: number;

    studentName: string;
    courseName: string;
    courseId?: number;
    studentEnrollmentId: number;

    installmentCount: number;

    // 🔴 FIXED
    amount: number;                 // was installmentAmount
    date?: string | null;           // was installmentDate

    amountPaid?: number | null;
    paidDate?: string | null;
    paymentMode?: string | null;
    transactionId?: string | null;

    status: boolean;

    paymentLogs: StudentPaymentLog[];

    createdAt: string;
    updatedAt?: string | null;
    updatedBy?: number | null;
    isDeleted: boolean;
}

export interface UpdateStudentPaymentRequest {
    studentPaymentId: number;
    paidAmount: number;
    paymentMode?: string | null;
    transactionId?: string | null;
    paymentStatus?: string | null;
    paidDate?: string | null;
}


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