import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "@/lib/store";
import {
  StudentAnswer,
  CreateStudentAnswerDto,
  UpdateStudentAnswerDto,
  ApiError,
} from "./studentAnswerTypes";
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
   GET ALL STUDENT ANSWERS
================================ */

export const fetchStudentAnswers = createAsyncThunk<
  StudentAnswer[],
  void,
  { dispatch: AppDispatch; state: RootState; rejectValue: ApiError }
>(
  "studentAnswers/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<StudentAnswer[]>(
        API_ENDPOINTS.STUDENT_ANSWERS.GET_LIST,
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
   GET STUDENT ANSWER BY ID
================================ */

export const fetchStudentAnswerById = createAsyncThunk<
  StudentAnswer,
  number,
  { rejectValue: ApiError }
>(
  "studentAnswers/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get<StudentAnswer>(
        `${API_ENDPOINTS.STUDENT_ANSWERS.GET_BY_ID}/${id}`,
        { withCredentials: true }
      );

      if (!response?.success || !response.data) {
        return rejectWithValue({
          error: "Student answer not found",
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
   CREATE STUDENT ANSWER
================================ */

export const createStudentAnswer = createAsyncThunk<
  {
    success: boolean;
    studentAnswer: StudentAnswer | null;
    message: string;
  },
  CreateStudentAnswerDto,
  { rejectValue: ApiError }
>(
  "studentAnswers/create",
  async (dto, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      formData.append(
        "attemptQuestionId",
        dto.attemptQuestionId.toString()
      );

      if (dto.answerText)
        formData.append("answerText", dto.answerText);

      if (dto.selectedOptionIds)
        formData.append(
          "selectedOptionIds",
          dto.selectedOptionIds
        );

      if (dto.file)
        formData.append("file", dto.file);

      const response = await api.post<StudentAnswer>(
        API_ENDPOINTS.STUDENT_ANSWERS.POST_CREATE,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
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
        message: response.message || "Student answer created",
        studentAnswer: response.data ?? null,
      };
    } catch (error: any) {
      return rejectWithValue(parseApiError(error));
    }
  }
);

/* ===============================
   UPDATE STUDENT ANSWER
================================ */

export const updateStudentAnswer = createAsyncThunk<
  { success: boolean; message: string },
  { id: number; dto: UpdateStudentAnswerDto },
  { rejectValue: ApiError }
>(
  "studentAnswers/update",
  async ({ id, dto }, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      if (dto.file)
        formData.append("file", dto.file);

      if (dto.score !== undefined && dto.score !== null)
        formData.append("score", dto.score.toString());

      if (dto.isCorrect !== undefined && dto.isCorrect !== null)
        formData.append(
          "isCorrect",
          dto.isCorrect.toString()
        );

      if (dto.evaluatedBy)
        formData.append(
          "evaluatedBy",
          dto.evaluatedBy
        );

      const response = await api.put(
        `${API_ENDPOINTS.STUDENT_ANSWERS.PUT_UPDATE}/${id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
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
        message: response.message || "Student answer updated",
      };
    } catch (error: any) {
      return rejectWithValue(parseApiError(error));
    }
  }
);

/* ===============================
   DELETE STUDENT ANSWER
================================ */

export const deleteStudentAnswer = createAsyncThunk<
  { success: boolean; id: number },
  number,
  { rejectValue: ApiError }
>(
  "studentAnswers/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `${API_ENDPOINTS.STUDENT_ANSWERS.DELETE}/${id}`,
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
