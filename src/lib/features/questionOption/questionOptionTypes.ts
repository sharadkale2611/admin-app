/* =======================
   Question Option Model
======================= */

export interface QuestionOption {
  optionId: number;

  firmId: number;
  questionId: number;

  optionText: string;
  optionMediaPath?: string | null;

  isCorrect: boolean;
  optionOrder: number;

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

export interface QuestionOptionState {
  options: QuestionOption[];
  currentOption: QuestionOption | null;
  loading: boolean;
  error: ApiError | null;
}

/* =======================
   DTOs
======================= */

export interface CreateQuestionOptionDto {
  questionId: number;
  optionText: string;
  isCorrect: boolean;
  optionOrder: number;

  // For multipart/form-data
  optionMedia?: File;
}

export interface UpdateQuestionOptionDto {
  optionText: string;
  isCorrect: boolean;
  optionOrder: number;
  isActive: boolean;

  // For multipart/form-data
  optionMedia?: File;
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
