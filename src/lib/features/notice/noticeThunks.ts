import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "@/lib/store";
import {
  Notice,
  CreateNoticeDto,
  UpdateNoticeDto,
  ApiResponse,
  ApiError
} from "./noticeTypes";
import API_ENDPOINTS from "@/lib/config/apiConfig";
import api from "@/lib/services/apiService";

/* ===============================
   Error Parser
================================ */

function parseApiError(error: any): ApiError {
  if (error?.response?.data) {
    const data = error.response.data;

    if (data.errors && typeof data.errors === "object") {
      const flattened = Object.entries(data.errors).flatMap(([field, msgs]) =>
        (msgs as string[]).map((msg) => `${field}: ${msg}`)
      );
      return { error: null, errors: null };
    }

    if (data.error) {
      return { error: data.error, errors: null };
    }
  }

  return { error: "An unknown error occurred", errors: null };
}

/* ===============================
   GET ALL NOTICES
================================ */

export const fetchNotices = createAsyncThunk<
    Notice[], // Response type: list of students
    void,      // No parameters
    { dispatch: AppDispatch; state: RootState; rejectValue: ApiError }
>(
    "notices/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<Notice[]>(
                API_ENDPOINTS.NOTICES.GET_LIST,
                { withCredentials: true }
            );

            console.log("Fetch Notices Response:", response.data);

            if (!response.data) {
                return rejectWithValue({
                    error: "No data returned from server",
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
   CREATE NOTICE
================================ */

export const createNotice = createAsyncThunk<
  { success: boolean; notice: Notice | null; message: string },
  CreateNoticeDto,
  { rejectValue: ApiError }
>("notices/create", async (dto, { rejectWithValue }) => {
  try {
    const response = await api.post<Notice>(
      API_ENDPOINTS.NOTICES.POST_CREATE,
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
      message: response.message || "Notice created",
      notice: response.data ?? null,
    };
  } catch (error: any) {
    return rejectWithValue(parseApiError(error));
  }
});



/* ===============================
   GET NOTICE BY ID
================================ */

export const fetchNoticeById = createAsyncThunk<
  Notice,
  number,
  { rejectValue: ApiError }
>("notices/fetchById", async (id, { rejectWithValue }) => {
  try {
    const response = await api.get<Notice>(
      `${API_ENDPOINTS.NOTICES.GET_BY_ID}/${id}`,
      { withCredentials: true }
    );

    if (!response?.data) {
      return rejectWithValue({ error: "Notice not found", errors: null });
    }

    return response.data;
  } catch (error: any) {
    return rejectWithValue(parseApiError(error));
  }
});


/* ===============================
   UPDATE NOTICE
================================ */

export const updateNotice = createAsyncThunk<
  { success: boolean; notice: Notice; message: string },
  UpdateNoticeDto,
  { rejectValue: ApiError }
>("notices/update", async (dto, { rejectWithValue }) => {
  try {
    const response = await api.put<Notice>(
      `${API_ENDPOINTS.NOTICES.PUT_UPDATE}/${dto.id}`,
      dto,
      { withCredentials: true }
    );

    if (!response?.success || !response.data) {
      return rejectWithValue({
        error: response?.message || "Update failed",
        errors: null,
      });
    }

    return {
      success: true,
      message: response.message || "Notice updated",
      notice: response.data,
    };
  } catch (error: any) {
    return rejectWithValue(parseApiError(error));
  }
});




/* ===============================
   DELETE NOTICE
================================ */

export const deleteNotice = createAsyncThunk<
    { success: boolean; id: number },
    number,
    { rejectValue: ApiError }
>("notices/delete", async (id, { rejectWithValue }) => {
    try {
        await api.delete(`${API_ENDPOINTS.NOTICES.DELETE}/${id}`, {
            withCredentials: true,
        });

        return { success: true, id };
    } catch (error: any) {
        return rejectWithValue(parseApiError(error));
    }
});