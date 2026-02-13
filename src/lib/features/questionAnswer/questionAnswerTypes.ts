/* =======================
   Question Answer Model
======================= */

export interface QuestionAnswer {
  questionAnswerId: number;

  firmId: number;
  questionId: number;

  answerText?: string | null;
  answerRegex?: string | null;

  maxScore: number;

  isActive: boolean;
  isDeleted: boolean;

  createdAt: string;
  updatedAt?: string | null;

  // Optional navigation properties (if included from API)
  firmName?: string | null;
  questionTitle?: string | null;
}

/* =======================
   Redux State
======================= */

export interface QuestionAnswerState {
  answers: QuestionAnswer[];
  currentAnswer: QuestionAnswer | null;
  loading: boolean;
  error: ApiError | null;
}

/* =======================
   DTOs
======================= */

export interface CreateQuestionAnswerDto {
  questionId: number;
  answerText?: string | null;
  answerRegex?: string | null;
  maxScore: number;
}

export interface UpdateQuestionAnswerDto {
  answerText?: string | null;
  answerRegex?: string | null;
  maxScore: number;
  isActive: boolean;
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
