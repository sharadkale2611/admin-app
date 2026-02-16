/* =======================
   Student Answer Model
======================= */

export interface StudentAnswer {
  studentAnswerId: number;

  firmId: number;
  firmName?: string | null;

  attemptQuestionId: number;

  answerText?: string | null;

  selectedOptionIds?: string | null;

  uploadedFilePath?: string | null;

  isCorrect?: boolean | null;

  score?: number | null;

  evaluatedBy?: string | null;

  evaluatedAt?: string | null;
}

/* =======================
   Redux State
======================= */

export interface StudentAnswerState {
  studentAnswers: StudentAnswer[];
  currentStudentAnswer: StudentAnswer | null;
  loading: boolean;
  error: ApiError | null;
}

/* =======================
   DTOs
======================= */

export interface CreateStudentAnswerDto {
  attemptQuestionId: number;

  answerText?: string | null;

  selectedOptionIds?: string | null;

  file?: File | null;
}

export interface UpdateStudentAnswerDto {
  file?: File | null;

  score?: number | null;

  isCorrect?: boolean | null;

  evaluatedBy?: string | null;
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
