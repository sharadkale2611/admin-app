import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "@/lib/store";
import {
  QuestionAttachment,
  CreateQuestionAttachmentDto,
  UpdateQuestionAttachmentDto,
  ApiError,
} from "./questionAttachmentTypes";
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
   GET ALL ATTACHMENTS
================================ */

export const fetchQuestionAttachments = createAsyncThunk<
  QuestionAttachment[],
  { questionId?: number } | void,
  { dispatch: AppDispatch; state: RootState; rejectValue: ApiError }
>(
  "questionAttachments/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get<QuestionAttachment[]>(
        API_ENDPOINTS.QUESTION_ATTACHMENTS.GET_LIST,
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
   GET ATTACHMENT BY ID
================================ */

export const fetchQuestionAttachmentById = createAsyncThunk<
  QuestionAttachment,
  number,
  { rejectValue: ApiError }
>(
  "questionAttachments/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get<QuestionAttachment>(
        `${API_ENDPOINTS.QUESTION_ATTACHMENTS.GET_BY_ID}/${id}`,
        { withCredentials: true }
      );

      if (!response?.success || !response.data) {
        return rejectWithValue({
          error: "Attachment not found",
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
   CREATE ATTACHMENT (multipart/form-data)
================================ */

export const createQuestionAttachment = createAsyncThunk<
  { success: boolean; attachment: QuestionAttachment | null; message: string },
  CreateQuestionAttachmentDto,
  { rejectValue: ApiError }
>(
  "questionAttachments/create",
  async (dto, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("questionId", dto.questionId.toString());
      formData.append("file", dto.file);

      const response = await api.post<QuestionAttachment>(
        API_ENDPOINTS.QUESTION_ATTACHMENTS.POST_CREATE,
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
        message: response.message || "Attachment uploaded",
        attachment: response.data ?? null,
      };
    } catch (error: any) {
      return rejectWithValue(parseApiError(error));
    }
  }
);

/* ===============================
   UPDATE ATTACHMENT (multipart/form-data)
================================ */

export const updateQuestionAttachment = createAsyncThunk<
  { success: boolean; message: string },
  { id: number; dto: UpdateQuestionAttachmentDto },
  { rejectValue: ApiError }
>(
  "questionAttachments/update",
  async ({ id, dto }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("isActive", dto.isActive.toString());

      if (dto.file) {
        formData.append("file", dto.file);
      }

      const response = await api.put(
        `${API_ENDPOINTS.QUESTION_ATTACHMENTS.PUT_UPDATE}/${id}`,
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
        message: response.message || "Attachment updated",
      };
    } catch (error: any) {
      return rejectWithValue(parseApiError(error));
    }
  }
);

/* ===============================
   DELETE ATTACHMENT (Soft Delete)
================================ */

export const deleteQuestionAttachment = createAsyncThunk<
  { success: boolean; id: number },
  number,
  { rejectValue: ApiError }
>(
  "questionAttachments/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `${API_ENDPOINTS.QUESTION_ATTACHMENTS.DELETE}/${id}`,
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
