import { createSlice } from "@reduxjs/toolkit";
import {
  fetchQuestionTypes,
  fetchQuestionTypeById,
  createQuestionType,
  updateQuestionType,
  deleteQuestionType,
  fetchQuestionTypesPaginated,
} from "./questionTypeThunks";
import { ApiError, QuestionTypeState } from "./questionTypeTypes";

const initialState: QuestionTypeState = {
  questionTypes: [],
  currentQuestionType: null,
  loading: false,
  error: null,
};

const questionTypeSlice = createSlice({
  name: "questionTypes",
  initialState,
  reducers: {
    clearCurrentQuestionType(state) {
      state.currentQuestionType = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ===============================
         GET ALL
      ================================ */
      .addCase(fetchQuestionTypes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuestionTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.questionTypes = action.payload;
      })
      .addCase(fetchQuestionTypes.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as ApiError) ?? {
            error: "Failed to fetch question types",
            errors: null,
          };
      })

      /* ===============================
         GET PAGINATED
      ================================ */
      .addCase(fetchQuestionTypesPaginated.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuestionTypesPaginated.fulfilled, (state, action) => {
        state.loading = false;
        state.questionTypes = action.payload.items;
      })
      .addCase(fetchQuestionTypesPaginated.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as ApiError) ?? {
            error: "Failed to fetch question types",
            errors: null,
          };
      })

      /* ===============================
         CREATE
      ================================ */
      .addCase(createQuestionType.fulfilled, (state, action) => {
        if (action.payload.questionType) {
          state.questionTypes.unshift(action.payload.questionType);
        }
      })

      /* ===============================
         GET BY ID
      ================================ */
      .addCase(fetchQuestionTypeById.fulfilled, (state, action) => {
        state.currentQuestionType = action.payload;
      })

      /* ===============================
         UPDATE
      ================================ */
      .addCase(updateQuestionType.fulfilled, (state, action) => {
        if (!action.payload.questionType) return;

        state.questionTypes = state.questionTypes.map((qt) =>
          qt.questionTypeId ===
          action.payload.questionType!.questionTypeId
            ? action.payload.questionType!
            : qt
        );

        if (
          state.currentQuestionType?.questionTypeId ===
          action.payload.questionType.questionTypeId
        ) {
          state.currentQuestionType = action.payload.questionType;
        }
      })

      /* ===============================
         DELETE
      ================================ */
      .addCase(deleteQuestionType.fulfilled, (state, action) => {
        state.questionTypes = state.questionTypes.filter(
          (qt) => qt.questionTypeId !== action.payload.id
        );
      });
  },
});

export const { clearCurrentQuestionType } = questionTypeSlice.actions;
export default questionTypeSlice.reducer;
