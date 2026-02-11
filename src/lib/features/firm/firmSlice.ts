// lib/features/firm/firmSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    fetchFirms,
    createFirm,
    updateFirm,
    deleteFirm,
    fetchFirmById,
    uploadFirmLogo,
} from "./firmThunks";

import { Firm, FirmsState } from "./firmType"; 

const initialState: FirmsState = {
    firms: [],
    currentFirm: null,    
    totalCount: 0,
    pageSize: 10,
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null,
    searchTerm: "",
    activeOnly: true,
    page: 1,
};

const firmSlice = createSlice({
    name: "firms",
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
        resetFilters: (state) => {
            state.searchTerm = "";
            state.activeOnly = true;
            state.page = 1;
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        clearFirmError: (state) => {
            state.error = null;
        }
    },

    extraReducers: (builder) => {
        builder

            // -------------------------------
            // FETCH FIRMS (LIST)
            // -------------------------------
            .addCase(fetchFirms.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFirms.fulfilled, (state, action) => {
                state.loading = false;
                const { items, totalCount, pageSize, currentPage, totalPages } = action.payload;

                state.firms = items;
                state.totalCount = totalCount;
                state.pageSize = pageSize;
                state.currentPage = currentPage;
                state.totalPages = totalPages;
            })
            .addCase(fetchFirms.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    typeof action.payload === "string"
                        ? action.payload
                        : action.payload?.error ?? "Network error";
            })

            // -------------------------------
            // FETCH FIRM BY ID (DETAILS PAGE)
            // -------------------------------
            .addCase(fetchFirmById.pending, (state) => {
    state.loading = true;
    state.error = null;
})

            .addCase(fetchFirmById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentFirm = action.payload; // ✅ store single firm
            })
            .addCase(fetchFirmById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || "Failed to load firm";
                state.currentFirm = null;
            })

            // -------------------------------
            // CREATE FIRM
            // -------------------------------
            .addCase(createFirm.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createFirm.fulfilled, (state, action) => {
                state.loading = false;

                if (action.payload.success && action.payload.firm) {
                    state.firms.unshift(action.payload.firm);
                    state.totalCount++;
                    state.totalPages = Math.ceil(state.totalCount / state.pageSize);
                }
            })
            .addCase(createFirm.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    typeof action.payload === "string"
                        ? action.payload
                        : action.payload?.error ?? "Failed to create firm";
            })

            // -------------------------------
            // UPDATE FIRM
            // -------------------------------
            .addCase(updateFirm.fulfilled, (state, action) => {
                if (action.payload.firm) {
                    const index = state.firms.findIndex(
                        (f) => f.firmId === action.payload.firm.firmId
                    );
                    if (index !== -1) state.firms[index] = action.payload.firm;

                    state.currentFirm = action.payload.firm;
                }
            })
// -------------------------------
// UPLOAD / CHANGE FIRM LOGO
// -------------------------------
.addCase(uploadFirmLogo.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(uploadFirmLogo.fulfilled, (state, action) => {
  state.loading = false;

  if (state.currentFirm) {
    // ✅ payload is STRING
    state.currentFirm.firmLogoImagePath = action.payload;
  }
})
.addCase(uploadFirmLogo.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload?.error ?? "Logo upload failed";
})



            // -------------------------------
            // DELETE FIRM
            // -------------------------------
            .addCase(deleteFirm.fulfilled, (state, action) => {
                state.firms = state.firms.filter(
                    (firm) => firm.firmId.toString() !== action.payload.id
                );
                state.totalCount--;
            })
            .addCase(deleteFirm.rejected, (state, action) => {
                state.error = action.payload?.error ?? "Failed to delete firm";
            });
         },
    
});




export const {
    setSearchTerm,
    toggleActiveOnly,
    resetFilters,
    setPage,
    clearFirmError,
} = firmSlice.actions;

export const firmReducer = firmSlice.reducer;
export default firmSlice.reducer;
