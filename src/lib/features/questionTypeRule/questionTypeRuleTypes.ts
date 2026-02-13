/* =======================
   QuestionTypeRule Model
======================= */

export interface QuestionTypeRule {
  ruleId: number;
  questionTypeId: number;

  maxOptions?: number | null;
  minOptions?: number | null;
  maxSelections?: number | null;
  maxTextLength?: number | null;

  isRegexAnswerAllowed: boolean;
  createdAt: string;

  // Optional navigation property (if included from API)
  questionType?: any;
}

/* =======================
   Redux State
======================= */

export interface QuestionTypeRuleState {
  rules: QuestionTypeRule[];
  currentRule: QuestionTypeRule | null;
  loading: boolean;
  error: ApiError | null;
}

/* =======================
   DTOs
======================= */

export interface CreateQuestionTypeRuleDto {
  questionTypeId: number;

  maxOptions?: number;
  minOptions?: number;
  maxSelections?: number;
  maxTextLength?: number;

  isRegexAnswerAllowed?: boolean;
}

export interface UpdateQuestionTypeRuleDto {
  id: number;

  maxOptions?: number;
  minOptions?: number;
  maxSelections?: number;
  maxTextLength?: number;

  isRegexAnswerAllowed?: boolean;
}

/* =======================
   Paginated Response (Optional - if needed later)
======================= */

export interface PaginatedQuestionTypeRules {
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  items: QuestionTypeRule[];
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
