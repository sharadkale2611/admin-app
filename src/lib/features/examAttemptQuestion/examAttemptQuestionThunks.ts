import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "@/lib/store";
import {
  ExamAttemptQuestion,
  CreateExamAttemptQuestionDto,
  UpdateExamAttemptQuestionDto,
  ApiError,
} from "./examAttemptQuestionTypes";
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
   GET ALL ATTEMPT QUESTIONS
================================ */

export const fetchExamAttemptQuestions = createAsyncThunk<
  ExamAttemptQuestion[],
  void,
  { dispatch: AppDispatch; state: RootState; rejectValue: ApiError }
>(
  "examAttemptQuestions/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ExamAttemptQuestion[]>(
        API_ENDPOINTS.EXAM_ATTEMPT_QUESTIONS.GET_LIST,
        {
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
   GET ATTEMPT QUESTION BY ID
================================ */

export const fetchExamAttemptQuestionById = createAsyncThunk<
  ExamAttemptQuestion,
  number,
  { rejectValue: ApiError }
>(
  "examAttemptQuestions/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get<ExamAttemptQuestion>(
        `${API_ENDPOINTS.EXAM_ATTEMPT_QUESTIONS.GET_BY_ID}/${id}`,
        { withCredentials: true }
      );

      if (!response?.success || !response.data) {
        return rejectWithValue({
          error: "Attempt question not found",
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
   GET QUESTIONS BY ATTEMPT ID
================================ */

export const fetchQuestionsByAttemptId = createAsyncThunk<
  ExamAttemptQuestion[],
  number,
  { rejectValue: ApiError }
>(
  "examAttemptQuestions/fetchByAttemptId",
  async (attemptId, { rejectWithValue }) => {
    try {
      const response = await api.get<ExamAttemptQuestion[]>(
        `${API_ENDPOINTS.EXAM_ATTEMPT_QUESTIONS.GET_BY_ATTEMPT}/${attemptId}`,
        { withCredentials: true }
      );

      if (!response?.success || !response.data) {
        return rejectWithValue({
          error: "No questions found",
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
   CREATE ATTEMPT QUESTION
================================ */

export const createExamAttemptQuestion = createAsyncThunk<
  {
    success: boolean;
    attemptQuestion: ExamAttemptQuestion | null;
    message: string;
  },
  CreateExamAttemptQuestionDto,
  { rejectValue: ApiError }
>(
  "examAttemptQuestions/create",
  async (dto, { rejectWithValue }) => {
    try {
      const response = await api.post<ExamAttemptQuestion>(
        API_ENDPOINTS.EXAM_ATTEMPT_QUESTIONS.POST_CREATE,
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
        message: response.message || "Attempt question created",
        attemptQuestion: response.data ?? null,
      };
    } catch (error: any) {
      return rejectWithValue(parseApiError(error));
    }
  }
);

/* ===============================
   UPDATE ATTEMPT QUESTION
================================ */

export const updateExamAttemptQuestion = createAsyncThunk<
  { success: boolean; message: string },
  { id: number; dto: UpdateExamAttemptQuestionDto },
  { rejectValue: ApiError }
>(
  "examAttemptQuestions/update",
  async ({ id, dto }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `${API_ENDPOINTS.EXAM_ATTEMPT_QUESTIONS.PUT_UPDATE}/${id}`,
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
        message: response.message || "Attempt question updated",
      };
    } catch (error: any) {
      return rejectWithValue(parseApiError(error));
    }
  }
);

/* ===============================
   DELETE ATTEMPT QUESTION
================================ */

export const deleteExamAttemptQuestion = createAsyncThunk<
  { success: boolean; id: number },
  number,
  { rejectValue: ApiError }
>(
  "examAttemptQuestions/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `${API_ENDPOINTS.EXAM_ATTEMPT_QUESTIONS.DELETE}/${id}`,
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
