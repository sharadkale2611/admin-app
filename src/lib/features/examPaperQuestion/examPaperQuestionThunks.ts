import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/services/apiService";
import API_ENDPOINTS from "@/lib/config/apiConfig";

import {
  ExamPaperQuestion,
  CreateExamPaperQuestionDto,
  UpdateExamPaperQuestionDto,
  ApiError,
} from "./examPaperQuestionTypes";

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
   GET LIST
================================ */

export const fetchExamPaperQuestions = createAsyncThunk<
  ExamPaperQuestion[],
  void,
  { rejectValue: ApiError }
>("examPaperQuestions/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<ExamPaperQuestion[]>(
      API_ENDPOINTS.EXAMPAPERQUESTIONS.GET_LIST,
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
});

/* ===============================
   GET BY ID
================================ */

export const fetchExamPaperQuestionById = createAsyncThunk<
  ExamPaperQuestion,
  number,
  { rejectValue: ApiError }
>(
  "examPaperQuestions/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get<ExamPaperQuestion>(
        `${API_ENDPOINTS.EXAMPAPERQUESTIONS.GET_BY_ID}/${id}`,
        { withCredentials: true }
      );

      // ✅ IMPORTANT FIX
      if (!response?.data) {
        return rejectWithValue({
          error: "ExamPaperQuestion not found",
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
   CREATE
================================ */

export const createExamPaperQuestion = createAsyncThunk<
  { success: boolean; examPaperQuestion: ExamPaperQuestion | null },
  CreateExamPaperQuestionDto,
  { rejectValue: ApiError }
>("examPaperQuestions/create", async (dto, { rejectWithValue }) => {
  try {
    const response = await api.post<ExamPaperQuestion>(
      API_ENDPOINTS.EXAMPAPERQUESTIONS.POST_CREATE,
      dto,
      { withCredentials: true }
    );

    if (!response?.success) {
      return rejectWithValue({
        error: response?.message || "Create failed",
        errors: null,
      });
    }

    return {
      success: true,
      examPaperQuestion: response.data ?? null,
    };
  } catch (error: any) {
    return rejectWithValue(parseApiError(error));
  }
});

/* ===============================
   UPDATE
================================ */

export const updateExamPaperQuestion = createAsyncThunk<
  { success: boolean; message: string },
  { id: number; dto: UpdateExamPaperQuestionDto },
  { rejectValue: ApiError }
>("examPaperQuestions/update", async ({ id, dto }, { rejectWithValue }) => {
  try {
    const response = await api.put(
      `${API_ENDPOINTS.EXAMPAPERQUESTIONS.PUT_UPDATE}/${id}`,
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
      message: response.message || "Updated successfully",
    };
  } catch (error: any) {
    return rejectWithValue(parseApiError(error));
  }
});

/* ===============================
   DELETE
================================ */

export const deleteExamPaperQuestion = createAsyncThunk<
  { success: boolean; id: number },
  number,
  { rejectValue: ApiError }
>("examPaperQuestions/delete", async (id, { rejectWithValue }) => {
  try {
    const response = await api.delete(
      `${API_ENDPOINTS.EXAMPAPERQUESTIONS.DELETE}/${id}`,
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
});
