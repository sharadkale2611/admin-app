/* =======================
   ExamPaper Model
======================= */

export interface ExamPaper {
  examPaperId: number;
  firmId: number;

  name: string;
  totalMarks: number;
  durationMinutes: number;

  shuffleQuestions: boolean;
  shuffleOptions: boolean;

  createdAt: string;
  updatedAt?: string | null;

  isDeleted: boolean;
}

/* =======================
   Redux State
======================= */

export interface ExamPaperState {
  examPapers: ExamPaper[];
  currentExamPaper: ExamPaper | null;
  loading: boolean;
  error: ApiError | null;
}

/* =======================
   DTOs
======================= */

export interface CreateExamPaperDto {
  name: string;
  totalMarks: number;
  durationMinutes: number;
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
}

export interface UpdateExamPaperDto {
  name: string;
  totalMarks: number;
  durationMinutes: number;
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
}

/* =======================
   API Types
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
