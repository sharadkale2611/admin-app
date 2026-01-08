import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "@/lib/store";
import {
  ExamMark,
  PaginatedExamMarks,
  CreateExamMarkDto,
  UpdateExamMarkDto,
  FetchExamMarksParams,
  ApiResponse,
} from "./examMarksTypes";
import API_ENDPOINTS from "@/lib/config/apiConfig";
import api from "@/lib/services/apiService";

export const fetchExamMarksPaginated = createAsyncThunk<
  PaginatedExamMarks,
  FetchExamMarksParams,
  { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
  "examMarks/fetchPaginated",
  async (
    { page = 1, pageSize = 10, examId = null, studentId = null, status = null },
    { rejectWithValue }
  ) => {
    try {
      const queryParams: Record<string, string> = {
        pageNumber: String(page),
        pageSize: String(pageSize),
      };

      if (examId !== null) queryParams.examId = String(examId);
      if (studentId !== null) queryParams.studentId = String(studentId);
      if (status !== null) queryParams.status = String(status);

      const query = new URLSearchParams(queryParams).toString();

      const response = await api.get<PaginatedExamMarks>(
        `${API_ENDPOINTS.EXAM_MARKS.GET_LIST_PAGINATED}?${query}`,
        { withCredentials: true }
      );

      if (!response?.data) {
        return rejectWithValue("Invalid server response");
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch exam marks");
    }
  }
);

export const fetchExamMarkById = createAsyncThunk<
  ExamMark,
  number,
  { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
  "examMarks/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get<ExamMark>(
        `${API_ENDPOINTS.EXAM_MARKS.GET_BY_ID}/${id}`,
        { withCredentials: true }
      );

      if (!response.data) {
        return rejectWithValue("Exam mark not found");
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch exam mark");
    }
  }
);

export const createExamMark = createAsyncThunk<
  {
    success: boolean;
    message: string;
    error: string | null;
    errors: Record<string, string[]> | null;
    examMark: ExamMark | null;
  },
  CreateExamMarkDto,
  { rejectValue: string }
>(
  "examMarks/create",
  async (payload, { rejectWithValue }) => {
    try {
      // api.post returns TransformedResponse: { success, message, data, error, errors, status, ... }
      const response = await api.post<ExamMark>(
        API_ENDPOINTS.EXAM_MARKS.POST_CREATE,
        payload,
        { withCredentials: true }
      );

      // Backend duplicate case: { success: false, message: "Marks already recorded for this student", error: "Duplicate" }
      if (response.success === false) {
        return rejectWithValue(
          response.message || response.error || "Failed to create exam mark"
        );
      }

      return {
        success: true,
        message: response.message || "Exam mark created successfully",
        error: null,
        errors: null,
        examMark: response.data ?? null,
      };
    } catch (error: any) {
      // Error object is shaped by apiService interceptor
      if (error?.errors) {
        const all = Object.values(error.errors as Record<string, string[]>).flat();
        return rejectWithValue(all.join(", "));
      }

      if (error?.message) {
        return rejectWithValue(error.message);
      }

      return rejectWithValue("Server error");
    }
  }
);

export const updateExamMark = createAsyncThunk<
  {
    success: boolean;
    message: string;
    error: string | null;
    errors: Record<string, string[]> | null;
    examMark: ExamMark | null;
  },
  UpdateExamMarkDto,
  { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
  "examMarks/update",
  async (payload, { rejectWithValue, getState }) => {
    try {
      const response = await api.put<ApiResponse<ExamMark | null>>(
        `${API_ENDPOINTS.EXAM_MARKS.PUT_UPDATE}/${payload.id}`,
        {
          examId: payload.examId,
          studentId: payload.studentId,
          markObtained: payload.markObtained,
          status: payload.status,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data?.success === false) {
        return rejectWithValue(
          response.data?.message || response.data?.error || "Failed to update exam mark"
        );
      }

      // Try to merge with existing state if backend does not return full entity
      const state = getState() as RootState;
      const existing =
        state.examMarks.currentExamMark ||
        state.examMarks.items.find((x) => x.examMarkId === payload.id) ||
        ({} as ExamMark);

      const merged: ExamMark = {
        ...existing,
        examId: payload.examId ?? existing.examId,
        studentId: payload.studentId ?? existing.studentId,
        markObtained: payload.markObtained,
        status: payload.status,
      };

      return {
        success: true,
        message: response.data?.message || "Exam mark updated successfully",
        error: null,
        errors: null,
        examMark: merged,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Failed to update exam mark"
      );
    }
  }
);

export const deleteExamMark = createAsyncThunk<
  { success: boolean; message: string; id: number },
  number,
  { rejectValue: string }
>(
  "examMarks/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`${API_ENDPOINTS.EXAM_MARKS.DELETE}/${id}` as string, {
        withCredentials: true,
      });

      return {
        success: true,
        message: "Exam mark deleted successfully",
        id,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error ||
          error.response?.data?.message ||
          (error.message?.includes("401") ? "SESSION_EXPIRED" : error.message)
      );
    }
  }
);
