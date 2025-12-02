// ----------------------------------------------
// Types for BatchStudyWorks Feature
// ----------------------------------------------

/**
 * Batch Study Work Entity (matches backend response)
 */
export interface BatchStudyWork {
  batchStudyWorkId: number;
  workType: "classwork" | "homework" | string;
  assignedBy: number | null;
  assignedByName?: string | null;

  batchId: number | null;
  batchCode?: string | null;

  workTitle: string;
  workDescription?: string | null;

  expectedCompletionDate?: string | null;

  isActive: boolean;
  isDeleted: boolean;

  createdAt: string;
  updatedAt?: string | null;
}

/**
 * DTO for Creating a Batch Study Work
 */
export interface CreateBatchStudyWorkDto {
  workType: string;
  assignedBy?: number | null;
  batchId?: number | null;
  workTitle: string;
  workDescription?: string | null;
  expectedCompletionDate?: string | null;
  isActive?: boolean;
}

/**
 * DTO for Updating a Batch Study Work
 */
export interface UpdateBatchStudyWorkDto {
  batchStudyWorkId: number;

  workType?: string;
  assignedBy?: number | null;
  batchId?: number | null;
  workTitle?: string;
  workDescription?: string | null;
  expectedCompletionDate?: string | null;
  isActive?: boolean;
}

/**
 * Paginated response structure (matches backend)
 */
export interface PaginatedBatchStudyWorks {
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  items: BatchStudyWork[];
}

/**
 * Generic API Response Wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  error?: string | null;
  errors?: string[] | null;
  data: T | null;
}
