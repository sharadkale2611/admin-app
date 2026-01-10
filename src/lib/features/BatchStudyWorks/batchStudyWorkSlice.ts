import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  BatchStudyWork,
  PaginatedBatchStudyWorks,
} from "./batchStudyWorkTypes";

import {
  fetchBatchStudyWorks,
  createBatchStudyWork,
  updateBatchStudyWork,
  deleteBatchStudyWork,
  fetchBatchStudyWorkById,
} from "./batchStudyWorkThunk";

import type { ApiError } from "./batchStudyWorkThunk";

// ----------------------------------------------
// SLICE STATE
//-----------------------------------------------
export interface BatchStudyWorkState {
  items: BatchStudyWork[];
  paginated: PaginatedBatchStudyWorks | null;

  current: BatchStudyWork | null;

  // UI filters / pagination
  searchTerm: string;
  activeOnly: boolean;
  page: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;

  loading: boolean;
  error: string | null;
  errors: string[] | null;
}

const initialState: BatchStudyWorkState = {
  items: [],
  paginated: null,

  current: null,

  // filters
  searchTerm: "",
  activeOnly: true,

  // pagination
  page: 1,
  totalPages: 1,
  totalCount: 0,
  pageSize: 10,

  loading: false,
  error: null,
  errors: null,
};

// ----------------------------------------------
// SLICE
// ----------------------------------------------
const batchStudyWorkSlice = createSlice({
  name: "batchStudyWorks",
  initialState,
  reducers: {
    clearBatchStudyWorkState(state) {
      state.current = null;
      state.error = null;
      state.errors = null;
    },

    // FILTERS
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
      state.page = 1;
    },

    toggleActiveOnly(state) {
      state.activeOnly = !state.activeOnly;
      state.page = 1;
    },

    resetFilters(state) {
      state.searchTerm = "";
      state.activeOnly = true;
      state.page = 1;
    },

    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
  },

  extraReducers: (builder) => {
    // ------------------------------------------------
    // FETCH PAGINATED
    // ------------------------------------------------
    builder.addCase(fetchBatchStudyWorks.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.errors = null;
    });

    builder.addCase(
      fetchBatchStudyWorks.fulfilled,
      (state, action: PayloadAction<PaginatedBatchStudyWorks>) => {
        state.loading = false;

        state.paginated = action.payload;
        state.items = action.payload.items;

        // update pagination state
        state.totalCount = action.payload.totalCount;
        state.pageSize = action.payload.pageSize;
        state.page = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      }
    );

    builder.addCase(
      fetchBatchStudyWorks.rejected,
      (state, action: PayloadAction<ApiError | undefined>) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to fetch data";
        state.errors = action.payload?.errors ?? null;
      }
    );

    // ------------------------------------------------
    // CREATE
    // ------------------------------------------------
    builder.addCase(createBatchStudyWork.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.errors = null;
    });

    builder.addCase(createBatchStudyWork.fulfilled, (state, action) => {
      state.loading = false;

      if (action.payload.data) {
        state.items.unshift(action.payload.data);
        state.totalCount++;
        state.totalPages = Math.ceil(state.totalCount / state.pageSize);
      }
    });

    builder.addCase(
      createBatchStudyWork.rejected,
      (state, action: PayloadAction<ApiError | undefined>) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to create";
        state.errors = action.payload?.errors ?? null;
      }
    );

    // ------------------------------------------------
    // UPDATE
    // ------------------------------------------------
    builder.addCase(updateBatchStudyWork.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.errors = null;
    });

    builder.addCase(updateBatchStudyWork.fulfilled, (state, action) => {
      state.loading = false;

      const updated = action.payload.data;

      if (updated) {
        const index = state.items.findIndex(
          (b) => b.batchStudyWorkId === updated.batchStudyWorkId
        );

        if (index !== -1) {
          state.items[index] = updated;
        }

        if (state.current?.batchStudyWorkId === updated.batchStudyWorkId) {
          state.current = updated;
        }
      }
    });

    builder.addCase(
      updateBatchStudyWork.rejected,
      (state, action: PayloadAction<ApiError | undefined>) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to update";
        state.errors = action.payload?.errors ?? null;
      }
    );

    // ------------------------------------------------
    // DELETE
    // ------------------------------------------------
    builder.addCase(deleteBatchStudyWork.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.errors = null;
    });

    builder.addCase(deleteBatchStudyWork.fulfilled, (state, action) => {
      state.loading = false;
      const id = action.payload.id;

      state.items = state.items.filter(
        (item) => item.batchStudyWorkId !== id
      );

      if (state.current?.batchStudyWorkId === id) {
        state.current = null;
      }
    });

    builder.addCase(
      deleteBatchStudyWork.rejected,
      (state, action: PayloadAction<ApiError | undefined>) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to delete";
        state.errors = action.payload?.errors ?? null;
      }
    );

    // ------------------------------------------------
    // FETCH BY ID
    // ------------------------------------------------
    builder.addCase(fetchBatchStudyWorkById.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.errors = null;
    });

    builder.addCase(
      fetchBatchStudyWorkById.fulfilled,
      (state, action: PayloadAction<BatchStudyWork>) => {
        state.loading = false;
        state.current = action.payload;
      }
    );

    builder.addCase(
      fetchBatchStudyWorkById.rejected,
      (state, action: PayloadAction<ApiError | undefined>) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to fetch record";
        state.errors = action.payload?.errors ?? null;
        state.current = null;
      }
    );
  },
});

// ----------------------------------------------
// EXPORTS
// ----------------------------------------------
export const {
  clearBatchStudyWorkState,
  setSearchTerm,
  toggleActiveOnly,
  resetFilters,
  setPage,
} = batchStudyWorkSlice.actions;

export default batchStudyWorkSlice.reducer;

