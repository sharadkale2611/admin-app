import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "@/lib/store";

import {
  Exam,
  CreateExamDto,
  UpdateExamDto,
  PaginatedExam,
  FetchExamParams,
} from "./examTypes";

import API_ENDPOINTS from "@/lib/config/apiConfig";
import api from "@/lib/services/apiService";

/* ========================================================
    ✅ FETCH PAGINATED EXAMS
======================================================== */
export const fetchExams = createAsyncThunk<
  PaginatedExam,
  FetchExamParams,
  { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
  "exam/fetchExams",
  async ({ page, pageSize, searchTerm, isActive, firmId }, { rejectWithValue }) => {
    try {
      const queryParams: Record<string, string> = {
        pageNumber: String(page ?? 1),
        pageSize: String(pageSize ?? 10),
        search: searchTerm ?? "",
        isActive: String(isActive ?? true),
      };

      if (firmId !== null && firmId !== undefined)
        queryParams.firmId = String(firmId);

      const query = new URLSearchParams(queryParams).toString();

      const response = await api.get<PaginatedExam>(
        `${API_ENDPOINTS.EXAMS.GET_LIST_PAGINATED}?${query}`,
        { withCredentials: true }
      );

      if (!response?.data)
        return rejectWithValue("Invalid server response");

      return response.data;

    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch exams");
    }
  }
);

/* ========================================================
    ✅ FETCH ALL EXAMS (NON-PAGINATED) — For dropdowns
======================================================== */
export const fetchAllExams = createAsyncThunk<
  Exam[],
  void,
  { rejectValue: string }
>(
  "exam/fetchAllExams",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<Exam[]>(
        API_ENDPOINTS.EXAMS.GET_LIST,
        { withCredentials: true }
      );

      return response.data ?? [];

    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to load exam list");
    }
  }
);

/* ========================================================
    ✅ FETCH EXAM BY ID
======================================================== */
export const fetchExamById = createAsyncThunk<
  Exam,
  number,
  { rejectValue: string }
>(
  "exam/fetchExamById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get<Exam>(
        `${API_ENDPOINTS.EXAMS.GET_BY_ID}/${id}`,
        { withCredentials: true }
      );

      if (!response.data)
        return rejectWithValue("Exam not found");

      return response.data;

    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch exam");
    }
  }
);

/* ========================================================
    ✅ CREATE EXAM
======================================================== */
export const createExam = createAsyncThunk<
  Exam,
  CreateExamDto,
  { rejectValue: string }
>(
  "exam/createExam",
  async (dto, { rejectWithValue }) => {
    try {
      const response = await api.post(
        API_ENDPOINTS.EXAMS.POST_CREATE,
        dto,
        { withCredentials: true }
      );

      return response.data;

    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create exam");
    }
  }
);

/* ========================================================
    ✅ UPDATE EXAM
======================================================== */
export const updateExam = createAsyncThunk<
  any,
  UpdateExamDto,
  { rejectValue: string }
>(
  "exam/updateExam",
  async (dto, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `${API_ENDPOINTS.EXAMS.PUT_UPDATE}/${dto.id}`,
        dto,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
      );

      // backend returns 204 No Content → normalize response
      return response.data ?? { success: true, id: dto.id };

    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update exam");
    }
  }
);

/* ========================================================
    ✅ DELETE EXAM
======================================================== */
export const deleteExam = createAsyncThunk<
  { id: number },
  number,
  { rejectValue: string }
>(
  "exam/deleteExam",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(
        `${API_ENDPOINTS.EXAMS.DELETE}/${id}`,
        { withCredentials: true }
      );

      return { id };

    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete exam");
    }
  }
);
