import { Student } from "./studentTypes";

export interface StudentDetails extends Student {
  // Admission
  studentEnrollmentId?: number | null;
  enrollmentDate?: string | null;
  enrollmentType?: string | null;
  paymentStatus?: string | null;
  paidAmount?: number | null;
  finalAmount?: number | null;
  discountCode?: string | null;

  // Batch
  batchId?: number | null;
  batchCode?: string | null;
  batchName?: string | null;
  branchName?: string | null;
  batchStartDate?: string | null;
  batchEndDate?: string | null;
  startTime?: string | null;
  batchDurationInHr?: number | null;
}
