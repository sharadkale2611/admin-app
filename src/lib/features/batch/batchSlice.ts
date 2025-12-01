// src/lib/features/batch/batchSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Batch, BatchState } from "./batchTypes";
import {
  fetchBatches,
  fetchBatchById,
  deleteBatch,
  createBatch,
  updateBatch,
} from "./batchThunks";
import type { ApiError } from "./batchThunks";

const initialState: BatchState = {
  batches: [],
  currentBatch: null,
  totalCount: 0,
  pageSize: 10,
  currentPage: 1,
  totalPages: 0,
  loading: false,
  error: null,
  searchTerm: "",
  activeOnly: true,
  page: 1,
};

const batchSlice = createSlice({
  name: "batches",
  initialState,
  reducers: {
    setBatchPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setBatchSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
    setBatchActiveOnly(state, action: PayloadAction<boolean>) {
      state.activeOnly = action.payload;
    },
    toggleBatchActiveOnly(state) {
      state.activeOnly = !state.activeOnly;
      state.page = 1;
    },
    resetBatchFilters(state) {
      state.searchTerm = "";
      state.activeOnly = true;
      state.page = 1;
    },
  },

  extraReducers: (builder) => {
    builder
      // -------------------------------------------------
      // 🔹 FETCH BATCHES PAGINATED
      // -------------------------------------------------
      .addCase(fetchBatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBatches.fulfilled, (state, action) => {
        state.loading = false;

        const payload = action.payload;

        state.batches = payload.items ?? [];
        state.totalCount = payload.totalCount;
        state.pageSize = payload.pageSize;
        state.currentPage = payload.currentPage;
        state.totalPages = payload.totalPages;
      })
      .addCase(fetchBatches.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as ApiError) ?? {
            error: "Failed to fetch batches",
            errors: null,
          };
      })

      // -------------------------------------------------
      // 🔹 FETCH BATCH BY ID
      // -------------------------------------------------
      .addCase(fetchBatchById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBatchById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBatch = action.payload as Batch;
      })
      .addCase(fetchBatchById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as ApiError) ?? {
            error: "Failed to fetch batch",
            errors: null,
          };
      })

      // -------------------------------------------------
      // 🔹 CREATE BATCH 
      // -------------------------------------------------
       .addCase(createBatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBatch.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createBatch.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? { error: "Failed to create batch", errors: null };
      })


      // -------------------------------------------------
      // 🔹 UPDATE BATCH 
      // -------------------------------------------------


      .addCase(updateBatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBatch.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const updated = action.payload.data; // Batch | null

        if (updated) {
          const index = state.batches.findIndex(b => b.batchId === updated.batchId);
          if (index !== -1) {
            state.batches[index] = updated;
          }
        }
      })
      .addCase(updateBatch.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? { error: "Failed to update batch", errors: null };
      })


      // -------------------------------------------------
      // 🔹 DELETE BATCH
      // -------------------------------------------------
      .addCase(deleteBatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBatch.fulfilled, (state, action) => {
        state.loading = false;

        const deletedId = action.payload.id;

        state.batches = state.batches.filter((b) => b.batchId !== deletedId);

        state.totalCount -= 1;
        state.totalPages = Math.ceil(state.totalCount / state.pageSize);
      })
      .addCase(deleteBatch.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as ApiError) ?? {
            error: "Failed to delete batch",
            errors: null,
          };
      });
  },
});

export const {
  setBatchPage,
  setBatchSearchTerm,
  setBatchActiveOnly,
  toggleBatchActiveOnly,
  resetBatchFilters,
} = batchSlice.actions;

export const batchReducer = batchSlice.reducer;
export default batchSlice.reducer;
