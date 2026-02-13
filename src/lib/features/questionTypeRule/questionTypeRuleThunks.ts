import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "@/lib/store";
import {
  QuestionTypeRule,
  CreateQuestionTypeRuleDto,
  UpdateQuestionTypeRuleDto,
  PaginatedQuestionTypeRules,
  ApiResponse,
  ApiError,
} from "./questionTypeRuleTypes";
import API_ENDPOINTS from "@/lib/config/apiConfig";
import api from "@/lib/services/apiService";

/* ===============================
   Error Parser
================================ */

function parseApiError(error: any): ApiError {
  if (error?.response?.data) {
    const data = error.response.data;

    if (data.errors && typeof data.errors === "object") {
      return { error: null, errors: data.errors };
    }

    if (data.error) {
      return { error: data.error, errors: null };
    }
  }

  return { error: "An unknown error occurred", errors: null };
}

/* ===============================
   GET ALL RULES
================================ */

export const fetchQuestionTypeRules = createAsyncThunk<
  QuestionTypeRule[],
  void,
  { dispatch: AppDispatch; state: RootState; rejectValue: ApiError }
>(
  "questionTypeRules/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<QuestionTypeRule[]>(
        API_ENDPOINTS.QUESTION_TYPE_RULES.GET_LIST,
        { withCredentials: true }
      );

      if (!response?.success || !response.data) {
        return rejectWithValue({
          error: response?.message || "No data returned",
          errors: null,
        });
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(parseApiError(error));
    }
  }
);

/* ===============================
   GET RULES (PAGINATED)
================================ */

export const fetchQuestionTypeRulesPaginated = createAsyncThunk<
  PaginatedQuestionTypeRules,
  {
    pageNumber?: number;
    pageSize?: number;
    search?: string;
  },
  { rejectValue: ApiError }
>(
  "questionTypeRules/fetchPaginated",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get<PaginatedQuestionTypeRules>(
        API_ENDPOINTS.QUESTION_TYPE_RULES.GET_PAGINATED,
        {
          params,
          withCredentials: true,
        }
      );

      if (!response?.success || !response.data) {
        return rejectWithValue({
          error: response?.message || "Failed to load rules",
          errors: null,
        });
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(parseApiError(error));
    }
  }
);

/* ===============================
   GET RULE BY ID
================================ */

export const fetchQuestionTypeRuleById = createAsyncThunk<
  QuestionTypeRule,
  number,
  { rejectValue: ApiError }
>(
  "questionTypeRules/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get<QuestionTypeRule>(
        `${API_ENDPOINTS.QUESTION_TYPE_RULES.GET_BY_ID}/${id}`,
        { withCredentials: true }
      );

      if (!response?.success || !response.data) {
        return rejectWithValue({
          error: "Rule not found",
          errors: null,
        });
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(parseApiError(error));
    }
  }
);

/* ===============================
   CREATE RULE
================================ */

export const createQuestionTypeRule = createAsyncThunk<
  { success: boolean; rule: QuestionTypeRule | null; message: string },
  CreateQuestionTypeRuleDto,
  { rejectValue: ApiError }
>(
  "questionTypeRules/create",
  async (dto, { rejectWithValue }) => {
    try {
      const response = await api.post<QuestionTypeRule>(
        API_ENDPOINTS.QUESTION_TYPE_RULES.POST_CREATE,
        dto,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response?.success) {
        return rejectWithValue({
          error: response?.message || "Create failed",
          errors: null,
        });
      }

      return {
        success: true,
        message: response.message || "Rule created",
        rule: response.data ?? null,
      };
    } catch (error: any) {
      return rejectWithValue(parseApiError(error));
    }
  }
);

/* ===============================
   UPDATE RULE
================================ */

export const updateQuestionTypeRule = createAsyncThunk<
  { success: boolean; rule: QuestionTypeRule | null; message: string },
  UpdateQuestionTypeRuleDto,
  { rejectValue: ApiError }
>(
  "questionTypeRules/update",
  async (dto, { rejectWithValue }) => {
    try {
      const response = await api.put<QuestionTypeRule>(
        `${API_ENDPOINTS.QUESTION_TYPE_RULES.PUT_UPDATE}/${dto.id}`,
        dto,
        { withCredentials: true }
      );

      if (!response?.success) {
        return rejectWithValue({
          error: response?.message || "Update failed",
          errors: null,
        });
      }

      return {
        success: true,
        message: response.message || "Rule updated",
        rule: response.data ?? null,
      };
    } catch (error: any) {
      return rejectWithValue(parseApiError(error));
    }
  }
);

/* ===============================
   DELETE RULE
================================ */

export const deleteQuestionTypeRule = createAsyncThunk<
  { success: boolean; id: number },
  number,
  { rejectValue: ApiError }
>(
  "questionTypeRules/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(
        `${API_ENDPOINTS.QUESTION_TYPE_RULES.DELETE}/${id}`,
        { withCredentials: true }
      );

      return { success: true, id };
    } catch (error: any) {
      return rejectWithValue(parseApiError(error));
    }
  }
);
