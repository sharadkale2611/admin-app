/* =======================
   Question Option Model
======================= */

export interface QuestionOption {
  optionId: number;
  optionText: string;
  isCorrect: boolean;
  optionOrder?: number;
  optionMediaPath?: string | null;
}

/* =======================
   Question Attachment Model
======================= */

export interface QuestionAttachment {
  questionAttachmentId: number;
  uploadMediaPath: string;
}

/* =======================
   Question Answer Model
======================= */

export interface QuestionAnswer {
  questionAnswerId: number;
  answerText?: string | null;
  answerRegex?: string | null;
  maxScore?: number;
}

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

  questionVersion?: number;
  isActive: boolean;
  isDeleted?: boolean;

  createdAt: string;
  updatedAt?: string | null;

  firmName?: string | null;
  courseName?: string | null;
  moduleName?: string | null;
  questionTypeName?: string | null;

  /* ⭐ NEW FIELDS FROM API */
  options?: QuestionOption[];
  attachments?: QuestionAttachment[];
  answers?: QuestionAnswer[];
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
 courseId?: number | null;
  moduleId?: number | null;
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
