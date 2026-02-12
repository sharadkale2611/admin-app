import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "@/lib/store";
import {
  QuestionType,
  CreateQuestionTypeDto,
  UpdateQuestionTypeDto,
  PaginatedQuestionTypes,
  ApiResponse,
  ApiError,
} from "./questionTypeTypes";
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
   GET ALL QUESTION TYPES
================================ */

export const fetchQuestionTypes = createAsyncThunk<
  QuestionType[],
  void,
  { dispatch: AppDispatch; state: RootState; rejectValue: ApiError }
>(
  "questionTypes/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<QuestionType[]>(
        API_ENDPOINTS.QUESTION_TYPES.GET_LIST,
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
   GET QUESTION TYPES (PAGINATED)
================================ */

export const fetchQuestionTypesPaginated = createAsyncThunk<
  PaginatedQuestionTypes,
  {
    pageNumber?: number;
    pageSize?: number;
    search?: string;
    isActive?: boolean | null;
  },
  { rejectValue: ApiError }
>(
  "questionTypes/fetchPaginated",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get<PaginatedQuestionTypes>(
        API_ENDPOINTS.QUESTION_TYPES.GET_PAGINATED,
        {
          params,
          withCredentials: true,
        }
      );

      if (!response?.success || !response.data) {
        return rejectWithValue({
          error: response?.message || "Failed to load question types",
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
   GET QUESTION TYPE BY ID
================================ */

export const fetchQuestionTypeById = createAsyncThunk<
  QuestionType,
  number,
  { rejectValue: ApiError }
>(
  "questionTypes/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get<QuestionType>(
        `${API_ENDPOINTS.QUESTION_TYPES.GET_BY_ID}/${id}`,
        { withCredentials: true }
      );

      if (!response?.success || !response.data) {
        return rejectWithValue({
          error: "Question type not found",
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
   CREATE QUESTION TYPE
================================ */

export const createQuestionType = createAsyncThunk<
  { success: boolean; questionType: QuestionType | null; message: string },
  CreateQuestionTypeDto,
  { rejectValue: ApiError }
>(
  "questionTypes/create",
  async (dto, { rejectWithValue }) => {
    try {
      const response = await api.post<QuestionType>(
        API_ENDPOINTS.QUESTION_TYPES.POST_CREATE,
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
        message: response.message || "Question type created",
        questionType: response.data ?? null,
      };
    } catch (error: any) {
      return rejectWithValue(parseApiError(error));
    }
  }
);

/* ===============================
   UPDATE QUESTION TYPE
================================ */

export const updateQuestionType = createAsyncThunk<
  { success: boolean; questionType: QuestionType | null; message: string },
  UpdateQuestionTypeDto,
  { rejectValue: ApiError }
>(
  "questionTypes/update",
  async (dto, { rejectWithValue }) => {
    try {
      const response = await api.put<QuestionType>(
        `${API_ENDPOINTS.QUESTION_TYPES.PUT_UPDATE}/${dto.id}`,
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
        message: response.message || "Question type updated",
        questionType: response.data ?? null,
      };
    } catch (error: any) {
      return rejectWithValue(parseApiError(error));
    }
  }
);

/* ===============================
   DELETE QUESTION TYPE
================================ */

export const deleteQuestionType = createAsyncThunk<
  { success: boolean; id: number },
  number,
  { rejectValue: ApiError }
>(
  "questionTypes/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(
        `${API_ENDPOINTS.QUESTION_TYPES.DELETE}/${id}`,
        { withCredentials: true }
      );

      return { success: true, id };
    } catch (error: any) {
      return rejectWithValue(parseApiError(error));
    }
  }
);
