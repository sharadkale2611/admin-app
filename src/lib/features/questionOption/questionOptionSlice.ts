import { createSlice } from "@reduxjs/toolkit";
import {
  fetchQuestionOptions,
  fetchQuestionOptionById,
  createQuestionOption,
  updateQuestionOption,
  deleteQuestionOption,
} from "./questionOptionThunks";
import { ApiError, QuestionOptionState } from "./questionOptionTypes";

const initialState: QuestionOptionState = {
  options: [],
  currentOption: null,
  loading: false,
  error: null,
};

const questionOptionSlice = createSlice({
  name: "questionOptions",
  initialState,
  reducers: {
    clearCurrentOption(state) {
      state.currentOption = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ===============================
         GET ALL
      ================================ */
      .addCase(fetchQuestionOptions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuestionOptions.fulfilled, (state, action) => {
        state.loading = false;
        state.options = action.payload;
      })
      .addCase(fetchQuestionOptions.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as ApiError) ?? {
            error: "Failed to fetch options",
            errors: null,
          };
      })

      /* ===============================
         GET BY ID
      ================================ */
      .addCase(fetchQuestionOptionById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuestionOptionById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOption = action.payload;
      })
      .addCase(fetchQuestionOptionById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as ApiError) ?? {
            error: "Failed to fetch option",
            errors: null,
          };
      })

      /* ===============================
         CREATE
      ================================ */
      .addCase(createQuestionOption.fulfilled, (state, action) => {
        if (action.payload.option) {
          state.options.unshift(action.payload.option);
        }
      })

      /* ===============================
         UPDATE
      ================================ */
      .addCase(updateQuestionOption.fulfilled, (state) => {
        // Backend does not return full updated entity
        // Best practice: refetch OR manually update if needed
      })

      /* ===============================
         DELETE
      ================================ */
      .addCase(deleteQuestionOption.fulfilled, (state, action) => {
        state.options = state.options.filter(
          (option) => option.optionId !== action.payload.id
        );
      });
  },
});

export const { clearCurrentOption } = questionOptionSlice.actions;

export default questionOptionSlice.reducer;
