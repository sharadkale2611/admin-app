// src/lib/features/batch/batchTypes.ts

export interface Batch {
  batchId: number;
  batchCode: string;

  branchId: number | null;
  branchName: string | null;
  branchCode: string | null;

  moduleId: number | null;
  moduleName: string | null;

  trainerId: number | null;
  trainerName: string | null;

  classRoomId: number | null;
  classRoomName: string | null;

  startDate: string | null;
  actualStartDate: string | null;
  endDate: string | null;
  actualEndDate: string | null;

  startTime: string | null;          // "HH:mm:ss"
  batchDurationInHr: number | null;

  totalEnrolls: number | null;

  studentEnrollmentId: number;

  isActive: boolean;
  isDeleted: boolean;
  isAssigned: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface PaginatedBatch {
  items: Batch[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}

export interface BatchState {
  batches: Batch[];
  currentBatch: Batch | null;
  totalCount: number;
  pageSize: number;
  // currentPage: number;
  totalPages: number;
  loading: boolean;
  error: ApiError | null;
  searchTerm: string;
  activeOnly: boolean;
  page: number;
}

export interface FetchBatchParams {
  page?: number;
  searchTerm?: string;
  activeOnly?: boolean; // true = only active, false = all
}

export interface CreateBatchDto {
  BatchCode: string;
  BranchId: number;
  moduleId: number;
  TrainerId: number;
  ClassRoomId: number;

  StartDate: string;         // yyyy-mm-dd
  ActualStartDate: string | null;
  EndDate: string;
  ActualEndDate: string | null;

  StartTime: string;         // HH:mm
  BatchDurationInHr: number;
  IsActive: boolean;
}

export interface CreateBatchResponse {
  success: boolean;
  message: string;
  data: any;
  error: string | null;
  errors: Record<string, string[]> | null;
}

export interface UpdateBatchDto {
  batchCode: string;
  branchId: number;
  moduleId: number;
  trainerId: number;
  classRoomId: number;

  startDate: string | null;
  actualStartDate: string | null;
  endDate: string | null;
  actualEndDate: string | null;

  startTime: string;
  batchDurationInHr: number;
  isActive: boolean;
}

export interface StudentBatchState {
  studentBatches: Batch[];
  loading: boolean;
  error: ApiError | null;
}

export interface StudentBatchState {
  studentBatches: Batch[];
}

export interface CourseBatchState {
  courseBatches: Batch[];
}


// Generic API response wrapper from your backend
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: any | null;
  error?: string | null;
  errors?: any | null;
}

// Same pattern as Student module
export interface ApiError {
  error: string | null;
  errors: string[] | null;
}
