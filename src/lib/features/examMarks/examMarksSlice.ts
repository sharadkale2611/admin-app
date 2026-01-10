import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchExamMarksPaginated,
  fetchExamMarkById,
  createExamMark,
  updateExamMark,
  deleteExamMark,
} from "./examMarksThunks";
import { ExamMark, ExamMarksState, PaginatedExamMarks } from "./examMarksTypes";

const initialState: ExamMarksState = {
  items: [],
  currentExamMark: null,
  totalCount: 0,
  pageSize: 10,
  currentPage: 1,
  totalPages: 1,
  loading: false,
  error: null,
  examId: null,
  studentId: null,
  status: null,
};

const examMarksSlice = createSlice({
  name: "examMarks",
  initialState,
  reducers: {
    setExamFilter(state, action: PayloadAction<number | null>) {
      state.examId = action.payload;
      state.currentPage = 1;
    },
    setStudentFilter(state, action: PayloadAction<number | null>) {
      state.studentId = action.payload;
      state.currentPage = 1;
    },
    setStatusFilter(state, action: PayloadAction<boolean | null>) {
      state.status = action.payload;
      state.currentPage = 1;
    },
    setExamMarksPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    resetExamMarksFilters(state) {
      state.examId = null;
      state.studentId = null;
      state.status = null;
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExamMarksPaginated.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchExamMarksPaginated.fulfilled,
        (state, action: PayloadAction<PaginatedExamMarks>) => {
          state.loading = false;
          state.items = action.payload.items;
          state.totalCount = action.payload.totalCount;
          state.pageSize = action.payload.pageSize;
          state.currentPage = action.payload.currentPage;
          state.totalPages = action.payload.totalPages;
        }
      )
      .addCase(fetchExamMarksPaginated.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch exam marks";
      })
      .addCase(fetchExamMarkById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchExamMarkById.fulfilled,
        (state, action: PayloadAction<ExamMark>) => {
          state.loading = false;
          state.currentExamMark = action.payload;
        }
      )
      .addCase(fetchExamMarkById.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch exam mark";
        state.currentExamMark = null;
      })
      .addCase(createExamMark.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExamMark.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success && action.payload.examMark) {
          state.items.unshift(action.payload.examMark);
          state.totalCount += 1;
          state.totalPages = Math.ceil(state.totalCount / state.pageSize);
        }
      })
      .addCase(createExamMark.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to create exam mark";
      })
      .addCase(updateExamMark.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExamMark.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success && action.payload.examMark) {
          const updated = action.payload.examMark;
          const idx = state.items.findIndex(
            (x) => x.examMarkId === updated.examMarkId
          );
          if (idx !== -1) {
            state.items[idx] = { ...state.items[idx], ...updated };
          }
          if (state.currentExamMark?.examMarkId === updated.examMarkId) {
            state.currentExamMark = { ...state.currentExamMark, ...updated };
          }
        }
      })
      .addCase(updateExamMark.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to update exam mark";
      })
      .addCase(deleteExamMark.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExamMark.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.items = state.items.filter(
            (x) => x.examMarkId !== action.payload.id
          );
          state.totalCount -= 1;
          state.totalPages = Math.max(
            1,
            Math.ceil(state.totalCount / state.pageSize)
          );
        }
      })
      .addCase(deleteExamMark.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to delete exam mark";
      });
  },
});

export const {
  setExamFilter,
  setStudentFilter,
  setStatusFilter,
  setExamMarksPage,
  resetExamMarksFilters,
} = examMarksSlice.actions;

export default examMarksSlice.reducer;
