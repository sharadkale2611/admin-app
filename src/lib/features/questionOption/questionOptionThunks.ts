import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "@/lib/store";
import {
  QuestionOption,
  CreateQuestionOptionDto,
  UpdateQuestionOptionDto,
  ApiResponse,
  ApiError,
} from "./questionOptionTypes";
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
   GET ALL OPTIONS
================================ */

export const fetchQuestionOptions = createAsyncThunk<
  QuestionOption[],
  { questionId?: number } | void,
  { dispatch: AppDispatch; state: RootState; rejectValue: ApiError }
>(
  "questionOptions/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get<QuestionOption[]>(
        API_ENDPOINTS.QUESTION_OPTIONS.GET_LIST,
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
   GET OPTION BY ID
================================ */

export const fetchQuestionOptionById = createAsyncThunk<
  QuestionOption,
  number,
  { rejectValue: ApiError }
>(
  "questionOptions/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get<QuestionOption>(
        `${API_ENDPOINTS.QUESTION_OPTIONS.GET_BY_ID}/${id}`,
        { withCredentials: true }
      );

      if (!response?.success || !response.data) {
        return rejectWithValue({
          error: "Option not found",
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
   CREATE OPTION (multipart/form-data)
================================ */

export const createQuestionOption = createAsyncThunk<
  { success: boolean; option: QuestionOption | null; message: string },
  CreateQuestionOptionDto,
  { rejectValue: ApiError }
>(
  "questionOptions/create",
  async (dto, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("questionId", dto.questionId.toString());
      formData.append("optionText", dto.optionText);
      formData.append("isCorrect", dto.isCorrect.toString());
      formData.append("optionOrder", dto.optionOrder.toString());

      if (dto.optionMedia) {
        formData.append("optionMedia", dto.optionMedia);
      }

      const response = await api.post<QuestionOption>(
        API_ENDPOINTS.QUESTION_OPTIONS.POST_CREATE,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
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
        message: response.message || "Option created",
        option: response.data ?? null,
      };
    } catch (error: any) {
      return rejectWithValue(parseApiError(error));
    }
  }
);

/* ===============================
   UPDATE OPTION (multipart/form-data)
================================ */

export const updateQuestionOption = createAsyncThunk<
  { success: boolean; message: string },
  { id: number; dto: UpdateQuestionOptionDto },
  { rejectValue: ApiError }
>(
  "questionOptions/update",
  async ({ id, dto }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("optionText", dto.optionText);
      formData.append("isCorrect", dto.isCorrect.toString());
      formData.append("optionOrder", dto.optionOrder.toString());
      formData.append("isActive", dto.isActive.toString());

      if (dto.optionMedia) {
        formData.append("optionMedia", dto.optionMedia);
      }

      const response = await api.put(
        `${API_ENDPOINTS.QUESTION_OPTIONS.PUT_UPDATE}/${id}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (!response?.success) {
        return rejectWithValue({
          error: response?.message || "Update failed",
          errors: null,
        });
      }

      return {
        success: true,
        message: response.message || "Option updated",
      };
    } catch (error: any) {
      return rejectWithValue(parseApiError(error));
    }
  }
);

/* ===============================
   DELETE OPTION (Soft Delete)
================================ */

export const deleteQuestionOption = createAsyncThunk<
  { success: boolean; id: number },
  number,
  { rejectValue: ApiError }
>(
  "questionOptions/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `${API_ENDPOINTS.QUESTION_OPTIONS.DELETE}/${id}`,
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


/* ===============================
   GET OPTIONS BY QUESTION ID
================================ */

export const fetchQuestionOptionsByQuestionId = createAsyncThunk<
  QuestionOption[],
  number,
  { rejectValue: ApiError }
>(
  "questionOptions/fetchByQuestionId",
  async (questionId, { rejectWithValue }) => {
    try {
      const response = await api.get<QuestionOption[]>(
        `${API_ENDPOINTS.QUESTION_OPTIONS.GET_BY_QUESTION}/${questionId}`,
        {
          withCredentials: true,
        }
      );

      if (!response?.success || !response.data) {
        return rejectWithValue({
          error: response?.message || "No options found",
          errors: null,
        });
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(parseApiError(error));
    }
  }
);

