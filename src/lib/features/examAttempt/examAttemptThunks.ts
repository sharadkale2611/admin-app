import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "@/lib/store";
import {
  ExamAttempt,
  CreateExamAttemptDto,
  UpdateExamAttemptDto,
  ApiError,
} from "./examAttemptTypes";
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
   GET ALL ATTEMPTS
================================ */

export const fetchExamAttempts = createAsyncThunk<
  ExamAttempt[],
  void,
  { dispatch: AppDispatch; state: RootState; rejectValue: ApiError }
>(
  "examAttempts/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ExamAttempt[]>(
        API_ENDPOINTS.EXAM_ATTEMPTS.GET_LIST,
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
   GET ATTEMPT BY ID
================================ */

export const fetchExamAttemptById = createAsyncThunk<
  ExamAttempt,
  number,
  { rejectValue: ApiError }
>(
  "examAttempts/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get<ExamAttempt>(
        `${API_ENDPOINTS.EXAM_ATTEMPTS.GET_BY_ID}/${id}`,
        { withCredentials: true }
      );

      if (!response?.success || !response.data) {
        return rejectWithValue({
          error: "Exam attempt not found",
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
   CREATE ATTEMPT (START EXAM)
================================ */

export const createExamAttempt = createAsyncThunk<
  { success: boolean; attempt: ExamAttempt | null; message: string },
  CreateExamAttemptDto,
  { rejectValue: ApiError }
>(
  "examAttempts/create",
  async (dto, { rejectWithValue }) => {
    try {
      const response = await api.post<ExamAttempt>(
        API_ENDPOINTS.EXAM_ATTEMPTS.POST_CREATE,
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
        message: response.message || "Exam attempt started",
        attempt: response.data ?? null,
      };
    } catch (error: any) {
      return rejectWithValue(parseApiError(error));
    }
  }
);

/* ===============================
   UPDATE ATTEMPT (SUBMIT / EVALUATE)
================================ */

export const updateExamAttempt = createAsyncThunk<
  { success: boolean; message: string },
  { id: number; dto: UpdateExamAttemptDto },
  { rejectValue: ApiError }
>(
  "examAttempts/update",
  async ({ id, dto }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `${API_ENDPOINTS.EXAM_ATTEMPTS.PUT_UPDATE}/${id}`,
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
        message: response.message || "Exam attempt updated",
      };
    } catch (error: any) {
      return rejectWithValue(parseApiError(error));
    }
  }
);

/* ===============================
   DELETE ATTEMPT
================================ */

export const deleteExamAttempt = createAsyncThunk<
  { success: boolean; id: number },
  number,
  { rejectValue: ApiError }
>(
  "examAttempts/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `${API_ENDPOINTS.EXAM_ATTEMPTS.DELETE}/${id}`,
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
