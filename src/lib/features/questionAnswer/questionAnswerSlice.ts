import { createSlice } from "@reduxjs/toolkit";
import {
  fetchQuestionAnswers,
  fetchQuestionAnswerById,
  createQuestionAnswer,
  updateQuestionAnswer,
  deleteQuestionAnswer,
} from "./questionAnswerThunks";
import { ApiError, QuestionAnswerState } from "./questionAnswerTypes";

const initialState: QuestionAnswerState = {
  answers: [],
  currentAnswer: null,
  loading: false,
  error: null,
};

const questionAnswerSlice = createSlice({
  name: "questionAnswers",
  initialState,
  reducers: {
    clearCurrentAnswer(state) {
      state.currentAnswer = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ===============================
         GET ALL
      ================================ */
      .addCase(fetchQuestionAnswers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuestionAnswers.fulfilled, (state, action) => {
        state.loading = false;
        state.answers = action.payload;
      })
      .addCase(fetchQuestionAnswers.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as ApiError) ?? {
            error: "Failed to fetch answers",
            errors: null,
          };
      })

      /* ===============================
         GET BY ID
      ================================ */
      .addCase(fetchQuestionAnswerById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuestionAnswerById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAnswer = action.payload;
      })
      .addCase(fetchQuestionAnswerById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as ApiError) ?? {
            error: "Failed to fetch question answer",
            errors: null,
          };
      })

      /* ===============================
         CREATE
      ================================ */
      .addCase(createQuestionAnswer.fulfilled, (state, action) => {
        if (action.payload.answer) {
          state.answers.unshift(action.payload.answer);
        }
      })

      /* ===============================
         UPDATE
      ================================ */
      .addCase(updateQuestionAnswer.fulfilled, (state) => {
        // Backend does not return full updated entity
        // Best practice: refetch OR manually update if needed
      })

      /* ===============================
         DELETE
      ================================ */
      .addCase(deleteQuestionAnswer.fulfilled, (state, action) => {
        state.answers = state.answers.filter(
          (answer) =>
            answer.questionAnswerId !== action.payload.id
        );
      });
  },
});

export const { clearCurrentAnswer } = questionAnswerSlice.actions;

export default questionAnswerSlice.reducer;
