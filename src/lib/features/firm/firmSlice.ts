import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createFirm, fetchFirms } from './firmThunks';
import { Firm, FirmsState, PaginatedFirms } from "./firmType";

const initialState: FirmsState = {
    firms: [],
    totalCount: 0,
    pageSize: 10,
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null,
    searchTerm: '',
    activeOnly: true,
    page: 1
};

const firmSlice = createSlice({
    name: 'firms',
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
            state.searchTerm = '';
            state.activeOnly = true;
            state.page = 1;
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFirms.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFirms.fulfilled, (state, action) => {
                state.loading = false;
                // Now action.payload is the direct PaginatedFirms data
                const { items, totalCount, pageSize, currentPage, totalPages } = action.payload;
                state.firms = items;
                state.totalCount = totalCount;
                state.pageSize = pageSize;
                state.currentPage = currentPage;
                state.totalPages = totalPages;
            })
            .addCase(fetchFirms.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Network error";
            })
            .addCase(createFirm.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createFirm.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;

                if (action.payload.success && action.payload.firm) {
                    state.firms.unshift(action.payload.firm);
                    state.totalCount += 1;
                    state.totalPages = Math.ceil(state.totalCount / state.pageSize);
                }
            })
            .addCase(createFirm.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to create firm";
            });
    }
});

export const {
    setSearchTerm,
    toggleActiveOnly,
    resetFilters,
    setPage,
} = firmSlice.actions;

export const firmReducer = firmSlice.reducer;
export default firmSlice.reducer;