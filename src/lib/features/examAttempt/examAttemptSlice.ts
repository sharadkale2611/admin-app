import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ExamAttempt,
  ExamAttemptState,
  ApiError,
} from "./examAttemptTypes";

import {
  fetchExamAttempts,
  fetchExamAttemptById,
  createExamAttempt,
  updateExamAttempt,
  deleteExamAttempt,
} from "./examAttemptThunks";

/* ===============================
   Initial State
================================ */

const initialState: ExamAttemptState = {
  attempts: [],
  currentAttempt: null,
  loading: false,
  error: null,
};

/* ===============================
   Slice
================================ */

const examAttemptSlice = createSlice({
  name: "examAttempts",
  initialState,

  reducers: {
    clearExamAttemptError(state) {
      state.error = null;
    },

    clearCurrentExamAttempt(state) {
      state.currentAttempt = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* ===============================
         FETCH ALL
      ================================ */

      .addCase(fetchExamAttempts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        fetchExamAttempts.fulfilled,
        (state, action: PayloadAction<ExamAttempt[]>) => {
          state.loading = false;
          state.attempts = action.payload;
        }
      )

      .addCase(fetchExamAttempts.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || {
            error: action.error.message || "Failed to fetch attempts",
            errors: null,
          };
      })

      /* ===============================
         FETCH BY ID
      ================================ */

      .addCase(fetchExamAttemptById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        fetchExamAttemptById.fulfilled,
        (state, action: PayloadAction<ExamAttempt>) => {
          state.loading = false;
          state.currentAttempt = action.payload;
        }
      )

      .addCase(fetchExamAttemptById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || {
            error: action.error.message || "Failed to fetch attempt",
            errors: null,
          };
      })

      /* ===============================
         CREATE
      ================================ */

      .addCase(createExamAttempt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createExamAttempt.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.attempt) {
          state.attempts.unshift(action.payload.attempt);
        }
      })

      .addCase(createExamAttempt.rejected, (state, action) => {
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

      .addCase(updateExamAttempt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateExamAttempt.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(updateExamAttempt.rejected, (state, action) => {
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

      .addCase(deleteExamAttempt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteExamAttempt.fulfilled, (state, action) => {
        state.loading = false;

        state.attempts = state.attempts.filter(
          (x) => x.examAttemptId !== action.payload.id
        );
      })

      .addCase(deleteExamAttempt.rejected, (state, action) => {
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
  clearExamAttemptError,
  clearCurrentExamAttempt,
} = examAttemptSlice.actions;

/* ===============================
   Export Reducer
================================ */

export default examAttemptSlice.reducer;
