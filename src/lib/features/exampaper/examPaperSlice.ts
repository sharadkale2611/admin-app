import { createSlice } from "@reduxjs/toolkit";
import {
  fetchExamPapers,
  fetchExamPaperById,
  createExamPaper,
  deleteExamPaper,
} from "./examPaperThunks";
import { ExamPaperState, ApiError } from "./examPaperTypes";

const initialState: ExamPaperState = {
  examPapers: [],
  currentExamPaper: null,
  loading: false,
  error: null,
};

const examPaperSlice = createSlice({
  name: "examPapers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExamPapers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExamPapers.fulfilled, (state, action) => {
        state.loading = false;
        state.examPapers = action.payload;
      })
      .addCase(fetchExamPapers.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as ApiError) ?? null;
      })

      .addCase(fetchExamPaperById.fulfilled, (state, action) => {
        state.currentExamPaper = action.payload;
      })

      .addCase(createExamPaper.fulfilled, (state, action) => {
        if (action.payload.examPaper) {
          state.examPapers.unshift(action.payload.examPaper);
        }
      })

      .addCase(deleteExamPaper.fulfilled, (state, action) => {
        state.examPapers = state.examPapers.filter(
          (e) => e.examPaperId !== action.payload.id
        );
      });
  },
});

export default examPaperSlice.reducer;
