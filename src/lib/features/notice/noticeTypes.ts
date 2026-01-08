// notices/noticeTypes.ts

export interface Notice {
  noticeId: number;
  title: string;
  description: string;
  createdBy: string;
  updatedBy: string;
  createdFor: "BATCH" | "STUDENT";

  batchId?: number | null;
  batchName?: string | null;

  studentId?: number | null;
  studentName?: string | null;

  createdAt: string;
  updatedAt?: string;
}

export interface NoticeState {
  notices: Notice[];
  currentNotice: Notice | null;
  loading: boolean;
  error: ApiError | null;
}

/* ===== DTOs ===== */

export interface CreateNoticeDto {
  title: string;
  description: string;
  createdBy: string;
  createdFor: "BATCH" | "STUDENT";
  batchId?: number | null;
  studentId?: number | null;
}

export interface UpdateNoticeDto {
  id: number;
  title: string;
  description: string;
  updatedBy: string;
  createdFor: "BATCH" | "STUDENT";
  batchId?: number | null;
  studentId?: number | null;
}

/* ===== Common API Response ===== */

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
