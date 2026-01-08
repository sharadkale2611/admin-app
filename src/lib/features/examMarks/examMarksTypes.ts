export interface ExamMark {
  examMarkId: number;
  firmId: number;
  firmName?: string;
  examId: number;
  examName?: string;
  studentId: number;
  studentName?: string;
  grade?: string | null;
  markObtained: number;
  status: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt?: string | null;
}

export interface PaginatedExamMarks {
  items: ExamMark[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}

export interface ExamMarksState {
  items: ExamMark[];
  currentExamMark: ExamMark | null;
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;

  // filters
  examId: number | null;
  studentId: number | null;
  status: boolean | null; // null = all, true = active, false = inactive
}

export interface CreateExamMarkDto {
  firmId?: number; // set on backend from token, but keep for typing
  examId: number;
  studentId: number;
  markObtained: number;
  status: boolean;
}

export interface UpdateExamMarkDto {
  id: number;
  markObtained: number;
  status: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string | null;
  errors?: any | null;
}

export interface FetchExamMarksParams {
  page?: number;
  pageSize?: number;
  examId?: number | null;
  studentId?: number | null;
  status?: boolean | null;
}
