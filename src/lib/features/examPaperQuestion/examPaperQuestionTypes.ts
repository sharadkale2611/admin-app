export interface ExamPaperQuestion {
  examPaperQuestionId: number;
  firmId: number;

  examPaperId: number;
  examPaperName?: string;

  questionId: number;
  questionTitle?: string;

  marksOverride?: number | null;
  questionOrder?: number | null;

  createdAt: string;
  updatedAt?: string | null;
  isDeleted: boolean;
}

export interface ExamPaperQuestionState {
  examPaperQuestions: ExamPaperQuestion[];
  currentExamPaperQuestion: ExamPaperQuestion | null;
  loading: boolean;
  error: ApiError | null;
}

export interface CreateExamPaperQuestionDto {
  examPaperId: number;
  questionId: number;
  marksOverride?: number;
  questionOrder?: number;
}

export interface UpdateExamPaperQuestionDto {
  marksOverride?: number;
  questionOrder?: number;
}

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
