import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "@/lib/store";
import {
  QuestionAnswer,
  CreateQuestionAnswerDto,
  UpdateQuestionAnswerDto,
  ApiError,
} from "./questionAnswerTypes";
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
   GET ALL ANSWERS
================================ */

export const fetchQuestionAnswers = createAsyncThunk<
  QuestionAnswer[],
  { questionId?: number } | void,
  { dispatch: AppDispatch; state: RootState; rejectValue: ApiError }
>(
  "questionAnswers/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get<QuestionAnswer[]>(
        API_ENDPOINTS.QUESTION_ANSWERS.GET_LIST,
        {
          params,
          withCredentials: true,
        }
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
   GET ANSWER BY ID
================================ */

export const fetchQuestionAnswerById = createAsyncThunk<
  QuestionAnswer,
  number,
  { rejectValue: ApiError }
>(
  "questionAnswers/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get<QuestionAnswer>(
        `${API_ENDPOINTS.QUESTION_ANSWERS.GET_BY_ID}/${id}`,
        { withCredentials: true }
      );

      if (!response?.success || !response.data) {
        return rejectWithValue({
          error: "Question answer not found",
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
   CREATE ANSWER
================================ */

export const createQuestionAnswer = createAsyncThunk<
  { success: boolean; answer: QuestionAnswer | null; message: string },
  CreateQuestionAnswerDto,
  { rejectValue: ApiError }
>(
  "questionAnswers/create",
  async (dto, { rejectWithValue }) => {
    try {
      const response = await api.post<QuestionAnswer>(
        API_ENDPOINTS.QUESTION_ANSWERS.POST_CREATE,
        dto,
        {
          withCredentials: true,
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
        message: response.message || "Question answer created",
        answer: response.data ?? null,
      };
    } catch (error: any) {
      return rejectWithValue(parseApiError(error));
    }
  }
);

/* ===============================
   UPDATE ANSWER
================================ */

export const updateQuestionAnswer = createAsyncThunk<
  { success: boolean; message: string },
  { id: number; dto: UpdateQuestionAnswerDto },
  { rejectValue: ApiError }
>(
  "questionAnswers/update",
  async ({ id, dto }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `${API_ENDPOINTS.QUESTION_ANSWERS.PUT_UPDATE}/${id}`,
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
        message: response.message || "Question answer updated",
      };
    } catch (error: any) {
      return rejectWithValue(parseApiError(error));
    }
  }
);

/* ===============================
   DELETE ANSWER (Soft Delete)
================================ */

export const deleteQuestionAnswer = createAsyncThunk<
  { success: boolean; id: number },
  number,
  { rejectValue: ApiError }
>(
  "questionAnswers/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `${API_ENDPOINTS.QUESTION_ANSWERS.DELETE}/${id}`,
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
