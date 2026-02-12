//src/lib/features/questionType/questionTypeTypes.ts

/* =======================
   QuestionType Model
======================= */

export interface QuestionType {
  questionTypeId: number;
  firmId: number;
  code: string;
  name: string;
  supportsOptions: boolean;
  supportsAttachments: boolean;
  evaluationMode: "AUTO" | "MANUAL" | "HYBRID";
  isSystemDefined: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string | null;
  isDeleted: boolean;
}

/* =======================
   Redux State
======================= */

export interface QuestionTypeState {
  questionTypes: QuestionType[];
  currentQuestionType: QuestionType | null;
  loading: boolean;
  error: ApiError | null;
}

/* =======================
   DTOs
======================= */

export interface CreateQuestionTypeDto {
  code: string;
  name: string;
  supportsOptions?: boolean;
  supportsAttachments?: boolean;
  evaluationMode: "AUTO" | "MANUAL" | "HYBRID";
}

export interface UpdateQuestionTypeDto {
  id: number;
  name: string;
  supportsOptions?: boolean;
  supportsAttachments?: boolean;
  evaluationMode: "AUTO" | "MANUAL" | "HYBRID";
  isActive: boolean;
}

/* =======================
   Paginated Response
======================= */

export interface PaginatedQuestionTypes {
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  items: QuestionType[];
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
