export interface CourseFee {
    courseFeeId: number;
    courseId: number;
    courseName: string | null;
    totalInstallments: number;
    feeAmount: number;
    gstPercentage: number;
    totalFee: number;
    createdAt: string;
    updatedAt?: string | null;
    branchId?: number | null;
    branchName?: string | null;
    branchCode?: string | null;
}
``
export interface CourseFeeDto {
    courseFeeId?: number;
    courseId: number;
    branchId?: number;
    totalInstallments: number;
    feeAmount: number;
    gstPercentage: number;
}
