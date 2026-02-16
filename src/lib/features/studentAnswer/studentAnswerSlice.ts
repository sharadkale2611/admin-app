import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  StudentAnswer,
  StudentAnswerState,
  ApiError,
} from "./studentAnswerTypes";

import {
  fetchStudentAnswers,
  fetchStudentAnswerById,
  createStudentAnswer,
  updateStudentAnswer,
  deleteStudentAnswer,
} from "./studentAnswerThunks";

/* ===============================
   Initial State
================================ */

const initialState: StudentAnswerState = {
  studentAnswers: [],
  currentStudentAnswer: null,
  loading: false,
  error: null,
};

/* ===============================
   Slice
================================ */

const studentAnswerSlice = createSlice({
  name: "studentAnswers",
  initialState,

  reducers: {
    clearStudentAnswerError(state) {
      state.error = null;
    },

    clearCurrentStudentAnswer(state) {
      state.currentStudentAnswer = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* ===============================
         FETCH ALL
      ================================ */

      .addCase(fetchStudentAnswers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        fetchStudentAnswers.fulfilled,
        (state, action: PayloadAction<StudentAnswer[]>) => {
          state.loading = false;
          state.studentAnswers = action.payload;
        }
      )

      .addCase(fetchStudentAnswers.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || {
            error:
              action.error.message ||
              "Failed to fetch student answers",
            errors: null,
          };
      })

      /* ===============================
         FETCH BY ID
      ================================ */

      .addCase(fetchStudentAnswerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        fetchStudentAnswerById.fulfilled,
        (state, action: PayloadAction<StudentAnswer>) => {
          state.loading = false;
          state.currentStudentAnswer = action.payload;
        }
      )

      .addCase(fetchStudentAnswerById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || {
            error:
              action.error.message ||
              "Failed to fetch student answer",
            errors: null,
          };
      })

      /* ===============================
         CREATE
      ================================ */

      .addCase(createStudentAnswer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createStudentAnswer.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.studentAnswer) {
          state.studentAnswers.unshift(
            action.payload.studentAnswer
          );
        }
      })

      .addCase(createStudentAnswer.rejected, (state, action) => {
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

      .addCase(updateStudentAnswer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateStudentAnswer.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(updateStudentAnswer.rejected, (state, action) => {
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

      .addCase(deleteStudentAnswer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteStudentAnswer.fulfilled, (state, action) => {
        state.loading = false;

        state.studentAnswers = state.studentAnswers.filter(
          (x) =>
            x.studentAnswerId !== action.payload.id
        );
      })

      .addCase(deleteStudentAnswer.rejected, (state, action) => {
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
  clearStudentAnswerError,
  clearCurrentStudentAnswer,
} = studentAnswerSlice.actions;

/* ===============================
   Export Reducer
================================ */

export default studentAnswerSlice.reducer;
