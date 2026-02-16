import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ExamAttemptQuestion,
  ExamAttemptQuestionState,
  ApiError,
} from "./examAttemptQuestionTypes";

import {
  fetchExamAttemptQuestions,
  fetchExamAttemptQuestionById,
  createExamAttemptQuestion,
  updateExamAttemptQuestion,
  deleteExamAttemptQuestion,
  fetchQuestionsByAttemptId,
} from "./examAttemptQuestionThunks";

/* ===============================
   Initial State
================================ */

const initialState: ExamAttemptQuestionState = {
  attemptQuestions: [],
  currentAttemptQuestion: null,
  loading: false,
  error: null,
};

/* ===============================
   Slice
================================ */

const examAttemptQuestionSlice = createSlice({
  name: "examAttemptQuestions",
  initialState,

  reducers: {
    clearExamAttemptQuestionError(state) {
      state.error = null;
    },

    clearCurrentExamAttemptQuestion(state) {
      state.currentAttemptQuestion = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* ===============================
         FETCH ALL
      ================================ */

      .addCase(fetchExamAttemptQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        fetchExamAttemptQuestions.fulfilled,
        (state, action: PayloadAction<ExamAttemptQuestion[]>) => {
          state.loading = false;
          state.attemptQuestions = action.payload;
        }
      )

      .addCase(fetchExamAttemptQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || {
            error:
              action.error.message ||
              "Failed to fetch attempt questions",
            errors: null,
          };
      })

      /* ===============================
         FETCH BY ID
      ================================ */

      .addCase(fetchExamAttemptQuestionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        fetchExamAttemptQuestionById.fulfilled,
        (state, action: PayloadAction<ExamAttemptQuestion>) => {
          state.loading = false;
          state.currentAttemptQuestion = action.payload;
        }
      )

      .addCase(fetchExamAttemptQuestionById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || {
            error:
              action.error.message ||
              "Failed to fetch attempt question",
            errors: null,
          };
      })

      /* ===============================
         FETCH BY ATTEMPT ID
      ================================ */

      .addCase(fetchQuestionsByAttemptId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        fetchQuestionsByAttemptId.fulfilled,
        (state, action: PayloadAction<ExamAttemptQuestion[]>) => {
          state.loading = false;
          state.attemptQuestions = action.payload;
        }
      )

      .addCase(fetchQuestionsByAttemptId.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || {
            error:
              action.error.message ||
              "Failed to fetch attempt questions",
            errors: null,
          };
      })

      /* ===============================
         CREATE
      ================================ */

      .addCase(createExamAttemptQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createExamAttemptQuestion.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.attemptQuestion) {
          state.attemptQuestions.unshift(
            action.payload.attemptQuestion
          );
        }
      })

      .addCase(createExamAttemptQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || {
            error: action.error.message || "Create failed",
            errors: null,
          };
      })

      /* ===============================
         UPDATE
      ================================ */

      .addCase(updateExamAttemptQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateExamAttemptQuestion.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(updateExamAttemptQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || {
            error: action.error.message || "Update failed",
            errors: null,
          };
      })

      /* ===============================
         DELETE
      ================================ */

      .addCase(deleteExamAttemptQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteExamAttemptQuestion.fulfilled, (state, action) => {
        state.loading = false;

        state.attemptQuestions = state.attemptQuestions.filter(
          (x) =>
            x.attemptQuestionId !== action.payload.id
        );
      })

      .addCase(deleteExamAttemptQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || {
            error: action.error.message || "Delete failed",
            errors: null,
          };
      });
  },
});

/* ===============================
   Export Actions
================================ */

export const {
  clearExamAttemptQuestionError,
  clearCurrentExamAttemptQuestion,
} = examAttemptQuestionSlice.actions;

/* ===============================
   Export Reducer
================================ */

export default examAttemptQuestionSlice.reducer;
