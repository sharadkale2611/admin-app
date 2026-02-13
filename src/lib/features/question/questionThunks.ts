import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "@/lib/store";
import {
  Question,
  CreateQuestionDto,
  UpdateQuestionDto,
  PaginatedQuestions,
  ApiResponse,
  ApiError,
} from "./questionTypes";
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
   GET ALL QUESTIONS
================================ */

export const fetchQuestions = createAsyncThunk<
  Question[],
  void,
  { dispatch: AppDispatch; state: RootState; rejectValue: ApiError }
>(
  "questions/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<Question[]>(
        API_ENDPOINTS.QUESTIONS.GET_LIST,
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
   GET QUESTIONS (PAGINATED)
================================ */

export const fetchQuestionsPaginated = createAsyncThunk<
  PaginatedQuestions,
  {
    pageNumber?: number;
    pageSize?: number;
    search?: string;
  },
  { rejectValue: ApiError }
>(
  "questions/fetchPaginated",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get<PaginatedQuestions>(
        API_ENDPOINTS.QUESTIONS.GET_PAGINATED,
        {
          params,
          withCredentials: true,
        }
      );

      if (!response?.success || !response.data) {
        return rejectWithValue({
          error: response?.message || "Failed to load questions",
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
   GET QUESTION BY ID
================================ */

export const fetchQuestionById = createAsyncThunk<
  Question,
  number,
  { rejectValue: ApiError }
>(
  "questions/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get<Question>(
        `${API_ENDPOINTS.QUESTIONS.GET_BY_ID}/${id}`,
        { withCredentials: true }
      );

      if (!response?.success || !response.data) {
        return rejectWithValue({
          error: "Question not found",
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
   CREATE QUESTION
================================ */

export const createQuestion = createAsyncThunk<
  { success: boolean; question: Question | null; message: string },
  CreateQuestionDto,
  { rejectValue: ApiError }
>(
  "questions/create",
  async (dto, { rejectWithValue }) => {
    try {
      const response = await api.post<Question>(
        API_ENDPOINTS.QUESTIONS.POST_CREATE,
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
        message: response.message || "Question created",
        question: response.data ?? null,
      };
    } catch (error: any) {
      return rejectWithValue(parseApiError(error));
    }
  }
);

/* ===============================
   UPDATE QUESTION
================================ */

export const updateQuestion = createAsyncThunk<
  { success: boolean; message: string },
  { id: number; dto: UpdateQuestionDto },
  { rejectValue: ApiError }
>(
  "questions/update",
  async ({ id, dto }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `${API_ENDPOINTS.QUESTIONS.PUT_UPDATE}/${id}`,
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
        message: response.message || "Question updated",
      };
    } catch (error: any) {
      return rejectWithValue(parseApiError(error));
    }
  }
);

/* ===============================
   DELETE QUESTION (Soft Delete)
================================ */

export const deleteQuestion = createAsyncThunk<
  { success: boolean; id: number },
  number,
  { rejectValue: ApiError }
>(
  "questions/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `${API_ENDPOINTS.QUESTIONS.DELETE}/${id}`,
        { withCredentials: true }
      );

      if (!response?.success) {
        return rejectWithValue({
          error: response?.message || "Delete failed",
          errors: null,
        });
      }

      return { success: true, id };
    } catch (error: any) {
      return rejectWithValue(parseApiError(error));
    }
  }
);
