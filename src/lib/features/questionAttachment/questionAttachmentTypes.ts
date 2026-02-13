/* =======================
   Question Attachment Model
======================= */

export interface QuestionAttachment {
  questionAttachmentId: number;

  firmId: number;
  questionId: number;

  uploadMediaPath: string;

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

export interface QuestionAttachmentState {
  attachments: QuestionAttachment[];
  currentAttachment: QuestionAttachment | null;
  loading: boolean;
  error: ApiError | null;
}

/* =======================
   DTOs
======================= */

export interface CreateQuestionAttachmentDto {
  questionId: number;

  // For multipart/form-data
  file: File;
}

export interface UpdateQuestionAttachmentDto {
  isActive: boolean;

  // Optional file update (multipart/form-data)
  file?: File;
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
