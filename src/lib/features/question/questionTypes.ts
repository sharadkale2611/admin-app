/* =======================
   Question Model
======================= */

export interface Question {
  questionId: number;

  firmId: number;
  questionTypeId: number;
  courseId?: number | null;
  moduleId?: number | null;

  title: string;
  description?: string | null;

  marks: number;
  difficultyLevel: "EASY" | "MEDIUM" | "HARD";
  negativeMarks: number;

  questionVersion: number;
  isActive: boolean;
  isDeleted: boolean;

  createdAt: string;
  updatedAt?: string | null;

  // Optional navigation properties (if included from API)
  firmName?: string | null;
  courseName?: string | null;
  moduleName?: string | null;
  questionTypeName?: string | null;
}

/* =======================
   Redux State
======================= */

export interface QuestionState {
  questions: Question[];
  currentQuestion: Question | null;
  loading: boolean;
  error: ApiError | null;
}

/* =======================
   DTOs
======================= */

export interface CreateQuestionDto {
  questionTypeId: number;

  courseId?: number;
  moduleId?: number;

  title: string;
  description?: string;

  marks: number;
  difficultyLevel: "EASY" | "MEDIUM" | "HARD";

  negativeMarks?: number;
}

export interface UpdateQuestionDto {
  title: string;
  description?: string;

  marks: number;
  difficultyLevel: "EASY" | "MEDIUM" | "HARD";

  negativeMarks?: number;
  isActive: boolean;
}

/* =======================
   Paginated Response (Optional - if needed later)
======================= */

export interface PaginatedQuestions {
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  items: Question[];
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
