import { createSlice } from "@reduxjs/toolkit";
import {
  fetchExamPaperQuestions,
  fetchExamPaperQuestionById, // ✅ ADDED
  createExamPaperQuestion,
  deleteExamPaperQuestion,
} from "./examPaperQuestionThunks";

import {
  ExamPaperQuestionState,
  ApiError,
} from "./examPaperQuestionTypes";

const initialState: ExamPaperQuestionState = {
  examPaperQuestions: [],
  currentExamPaperQuestion: null,
  loading: false,
  error: null,
};

const examPaperQuestionSlice = createSlice({
  name: "examPaperQuestions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* ===============================
         FETCH LIST
      ================================ */
      .addCase(fetchExamPaperQuestions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExamPaperQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.examPaperQuestions = action.payload;
      })
      .addCase(fetchExamPaperQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as ApiError) ?? null;
      })

      /* ===============================
         FETCH BY ID  ✅ IMPORTANT FIX
      ================================ */
      .addCase(fetchExamPaperQuestionById.pending, (state) => {
        state.loading = true;
        state.currentExamPaperQuestion = null;
      })
      .addCase(fetchExamPaperQuestionById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentExamPaperQuestion = action.payload;
      })
      .addCase(fetchExamPaperQuestionById.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as ApiError) ?? null;
      })

      /* ===============================
         CREATE
      ================================ */
      .addCase(createExamPaperQuestion.fulfilled, (state, action) => {
        if (action.payload.examPaperQuestion) {
          state.examPaperQuestions.unshift(
            action.payload.examPaperQuestion
          );
        }
      })

      /* ===============================
         DELETE
      ================================ */
      .addCase(deleteExamPaperQuestion.fulfilled, (state, action) => {
        state.examPaperQuestions = state.examPaperQuestions.filter(
          (e) => e.examPaperQuestionId !== action.payload.id
        );
      });
  },
});

export default examPaperQuestionSlice.reducer;
