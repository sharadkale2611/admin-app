/* =======================
   Exam Attempt Model
======================= */

export interface ExamAttempt {
  examAttemptId: number;

  firmId: number;
  firmName?: string | null;

  examPaperId: number;
  examPaperName?: string | null;

  studentId: number;
  studentName?: string | null;

  attemptNo: number;

  startedAt: string;
  submittedAt?: string | null;

  status: string;

  totalScore?: number | null;
}

/* =======================
   Redux State
======================= */

export interface ExamAttemptState {
  attempts: ExamAttempt[];
  currentAttempt: ExamAttempt | null;
  loading: boolean;
  error: ApiError | null;
}

/* =======================
   DTOs
======================= */

export interface CreateExamAttemptDto {
  examPaperId: number;
  studentId: number;
}

export interface UpdateExamAttemptDto {
  status: string;
  totalScore?: number | null;
  submittedAt?: string | null;
}

/* =======================
   Common API Response
======================= */

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
