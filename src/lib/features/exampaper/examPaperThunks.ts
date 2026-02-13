import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/services/apiService";
import API_ENDPOINTS from "@/lib/config/apiConfig";

import {
  ExamPaper,
  CreateExamPaperDto,
  UpdateExamPaperDto,
  ApiError,
} from "./examPaperTypes";

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

export const fetchExamPapers = createAsyncThunk<
  ExamPaper[],
  void,
  { rejectValue: ApiError }
>("examPapers/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<ExamPaper[]>(
      API_ENDPOINTS.EXAMPAPERS.GET_LIST,
      { withCredentials: true }
    );

    if (!response?.success || !response.data) {
      return rejectWithValue({
        error: response?.message || "No data",
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

export const fetchExamPaperById = createAsyncThunk<
  ExamPaper,
  number,
  { rejectValue: ApiError }
>("examPapers/fetchById", async (id, { rejectWithValue }) => {
  try {
    const response = await api.get<ExamPaper>(
      `${API_ENDPOINTS.EXAMPAPERS.GET_BY_ID}/${id}`,
      { withCredentials: true }
    );

    if (!response?.success || !response.data) {
      return rejectWithValue({
        error: "Exam paper not found",
        errors: null,
      });
    }

    return response.data;
  } catch (error: any) {
    return rejectWithValue(parseApiError(error));
  }
});

/* ===============================
   CREATE
================================ */

export const createExamPaper = createAsyncThunk<
  { success: boolean; examPaper: ExamPaper | null },
  CreateExamPaperDto,
  { rejectValue: ApiError }
>("examPapers/create", async (dto, { rejectWithValue }) => {
  try {
    const response = await api.post<ExamPaper>(
      API_ENDPOINTS.EXAMPAPERS.POST_CREATE,
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
      examPaper: response.data ?? null,
    };
  } catch (error: any) {
    return rejectWithValue(parseApiError(error));
  }
});

/* ===============================
   UPDATE
================================ */

export const updateExamPaper = createAsyncThunk<
  { success: boolean },
  { id: number; dto: UpdateExamPaperDto },
  { rejectValue: ApiError }
>("examPapers/update", async ({ id, dto }, { rejectWithValue }) => {
  try {
    const response = await api.put(
      `${API_ENDPOINTS.EXAMPAPERS.PUT_UPDATE}/${id}`,
      dto,
      { withCredentials: true }
    );

    if (!response?.success) {
      return rejectWithValue({
        error: response?.message || "Update failed",
        errors: null,
      });
    }

    return { success: true };
  } catch (error: any) {
    return rejectWithValue(parseApiError(error));
  }
});

/* ===============================
   DELETE
================================ */

export const deleteExamPaper = createAsyncThunk<
  { success: boolean; id: number },
  number,
  { rejectValue: ApiError }
>("examPapers/delete", async (id, { rejectWithValue }) => {
  try {
    const response = await api.delete(
      `${API_ENDPOINTS.EXAMPAPERS.DELETE}/${id}`,
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
