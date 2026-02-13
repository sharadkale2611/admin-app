import { createSlice } from "@reduxjs/toolkit";
import {
  fetchQuestions,
  fetchQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  fetchQuestionsPaginated,
} from "./questionThunks";
import { ApiError, QuestionState } from "./questionTypes";

const initialState: QuestionState = {
  questions: [],
  currentQuestion: null,
  loading: false,
  error: null,
};

const questionSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    clearCurrentQuestion(state) {
      state.currentQuestion = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ===============================
         GET ALL
      ================================ */
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as ApiError) ?? {
            error: "Failed to fetch questions",
            errors: null,
          };
      })

      /* ===============================
         GET PAGINATED
      ================================ */
      .addCase(fetchQuestionsPaginated.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuestionsPaginated.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload.items;
      })
      .addCase(fetchQuestionsPaginated.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as ApiError) ?? {
            error: "Failed to fetch questions",
            errors: null,
          };
      })

      /* ===============================
         CREATE
      ================================ */
      .addCase(createQuestion.fulfilled, (state, action) => {
        if (action.payload.question) {
          state.questions.unshift(action.payload.question);
        }
      })

      /* ===============================
         GET BY ID
      ================================ */
      .addCase(fetchQuestionById.fulfilled, (state, action) => {
        state.currentQuestion = action.payload;
      })

      /* ===============================
         UPDATE
      ================================ */
      .addCase(updateQuestion.fulfilled, (state, action) => {
        // Since backend doesn't return updated entity,
        // best practice is to refetch OR update manually if needed
      })

      /* ===============================
         DELETE
      ================================ */
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.questions = state.questions.filter(
          (question) => question.questionId !== action.payload.id
        );
      });
  },
});

export const { clearCurrentQuestion } = questionSlice.actions;

export default questionSlice.reducer;
