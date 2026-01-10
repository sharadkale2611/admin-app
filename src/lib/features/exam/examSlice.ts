import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  fetchExams,
  fetchExamById,
  createExam,
  updateExam,
  deleteExam,
} from "./examThunks";

import { Exam, ExamState, PaginatedExam } from "./examTypes";

const initialState: ExamState = {
  exams: [],
  currentExam: null,

  totalCount: 0,
  pageSize: 10,
  currentPage: 1,
  totalPages: 1,

  loading: false,
  error: null,

  searchTerm: "",
  isActive: true,
  page: 1,

  firmId: null,
};

const examSlice = createSlice({
  name: "exam",
  initialState,

  reducers: {
    setFirmId(state, action: PayloadAction<number | null>) {
      state.firmId = action.payload;
      state.page = 1;
    },

    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
      state.page = 1;
    },

    toggleActiveOnly(state) {
      state.isActive = !state.isActive;
      state.page = 1;
    },

    resetFilters(state) {
      state.searchTerm = "";
      state.isActive = true;
      state.page = 1;
    },

    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder

      /* =====================================================
          ⭐ FETCH PAGINATED EXAMS
      ===================================================== */
      .addCase(fetchExams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        fetchExams.fulfilled,
        (state, action: PayloadAction<PaginatedExam>) => {
          state.loading = false;

          state.exams = action.payload.items;
          state.totalCount = action.payload.totalCount;
          state.currentPage = action.payload.currentPage;
          state.pageSize = action.payload.pageSize;
          state.totalPages = action.payload.totalPages;
        }
      )

      .addCase(fetchExams.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to fetch exams";
      })

      /* =====================================================
          ⭐ FETCH EXAM BY ID
      ===================================================== */
      .addCase(fetchExamById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchExamById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentExam = action.payload;
      })

      .addCase(fetchExamById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to load exam details";
        state.currentExam = null;
      })

      /* =====================================================
          ⭐ CREATE EXAM
      ===================================================== */
      .addCase(createExam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createExam.fulfilled, (state, action) => {
        state.loading = false;

        const created = action.payload;

        // add to current page list
        state.exams.unshift(created);

        state.totalCount += 1;
        state.totalPages = Math.ceil(state.totalCount / state.pageSize);
      })

      .addCase(createExam.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to create exam";
      })

      /* =====================================================
          ⭐ UPDATE EXAM
      ===================================================== */
      .addCase(updateExam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateExam.fulfilled, (state, action) => {
        state.loading = false;

        const updated = action.payload;

        // update in list
        const idx = state.exams.findIndex(
          (e) => e.examId === updated.examId
        );
        if (idx !== -1) {
          state.exams[idx] = { ...state.exams[idx], ...updated };
        }

        // update current exam
        if (state.currentExam?.examId === updated.examId) {
          state.currentExam = { ...state.currentExam, ...updated };
        }
      })

      .addCase(updateExam.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to update exam";
      })

      /* =====================================================
          ⭐ DELETE EXAM
      ===================================================== */
      .addCase(deleteExam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteExam.fulfilled, (state, action) => {
        state.loading = false;

        const deletedId = action.payload.id;

        state.exams = state.exams.filter(
          (e) => e.examId !== deletedId
        );

        state.totalCount -= 1;
        state.totalPages = Math.ceil(state.totalCount / state.pageSize);
      })

      .addCase(deleteExam.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to delete exam";
      });
  },
});

export const {
  setFirmId,
  setSearchTerm,
  toggleActiveOnly,
  resetFilters,
  setPage,
} = examSlice.actions;

export default examSlice.reducer;
