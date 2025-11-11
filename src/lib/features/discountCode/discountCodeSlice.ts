// src/lib/features/discountCode/discountCodeSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchDiscountCodes,
  fetchDiscountCodeById,
  createDiscountCode,
  updateDiscountCode,
  deleteDiscountCode
} from "./discountCodeThunks";
import { DiscountCodeState, DiscountCodeResponseDto } from "./discountCodeTypes";

const initialState: DiscountCodeState = {
  codes: [],
  currentCode: null,
  totalCount: 0,
  pageSize: 10,
  currentPage: 1,
  totalPages: 1,
  loading: false,
  error: null,
  searchTerm: "",
  activeOnly: true,
  page: 1
};

const discountCodeSlice = createSlice({
  name: "discountCodes",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.page = 1;
    },
    toggleActiveOnly: (state) => {
      state.activeOnly = !state.activeOnly;
      state.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    clearCurrentCode: (state) => {
      state.currentCode = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch list
      .addCase(fetchDiscountCodes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDiscountCodes.fulfilled, (state, action) => {
        state.loading = false;
        state.codes = action.payload;
        state.totalCount = action.payload.length;
        state.totalPages = Math.ceil(action.payload.length / state.pageSize);
      })
      .addCase(fetchDiscountCodes.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch codes";
      })

      // Fetch by ID
      .addCase(fetchDiscountCodeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDiscountCodeById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCode = action.payload;
      })
      .addCase(fetchDiscountCodeById.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch code";
        state.currentCode = null;
      })

      // Create
      .addCase(createDiscountCode.fulfilled, (state, action) => {
        state.codes.unshift(action.payload.code);
        state.totalCount += 1;
        state.totalPages = Math.ceil(state.totalCount / state.pageSize);
      })

      // Update
      .addCase(updateDiscountCode.fulfilled, (state, action) => {
        const index = state.codes.findIndex(
          (c) => c.discountCodeId === action.payload.code.discountCodeId
        );
        if (index !== -1) {
          state.codes[index] = action.payload.code;
        }
        if (
          state.currentCode &&
          state.currentCode.discountCodeId === action.payload.code.discountCodeId
        ) {
          state.currentCode = action.payload.code;
        }
      })

      // Delete
      .addCase(deleteDiscountCode.fulfilled, (state, action) => {
        state.codes = state.codes.filter((c) => c.discountCodeId !== action.payload.id);
        state.totalCount -= 1;
        state.totalPages = Math.ceil(state.totalCount / state.pageSize);
        if (state.currentCode?.discountCodeId === action.payload.id) {
          state.currentCode = null;
        }
      });
  }
});

export const { setSearchTerm, toggleActiveOnly, setPage, clearCurrentCode, clearError } =
  discountCodeSlice.actions;

export default discountCodeSlice.reducer;
export const discountCodeReducer = discountCodeSlice.reducer;
