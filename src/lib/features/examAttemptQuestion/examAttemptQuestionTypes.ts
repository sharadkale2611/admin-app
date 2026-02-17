/* =======================
   Exam Attempt Question Model
======================= */

export interface ExamAttemptQuestion {
  attemptQuestionId: number;

  firmId: number;
  firmName?: string | null;

  examAttemptId: number;

  questionId: number;
  questionTitle?: string | null;

  questionTypeId: number;
  questionTypeName?: string | null;

  marksAssigned?: number | null;

  maxMarks: number;

  isEvaluated: boolean;
}

/* =======================
   Redux State
======================= */

export interface ExamAttemptQuestionState {
  attemptQuestions: ExamAttemptQuestion[];
  currentAttemptQuestion: ExamAttemptQuestion | null;
  loading: boolean;
  error: ApiError | null;
}

/* =======================
   DTOs
======================= */

export interface CreateExamAttemptQuestionDto {
  examAttemptId: number;
  questionId: number;
  questionTypeId: number;
  maxMarks: number;
}

export interface UpdateExamAttemptQuestionDto {
  marksAssigned?: number | null;
  isEvaluated: boolean;
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
