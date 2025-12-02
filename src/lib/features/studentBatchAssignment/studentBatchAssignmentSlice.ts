import { createSlice } from "@reduxjs/toolkit";

import {
    fetchSBAList,
    fetchSBAPaginated,
    fetchSBAById,
    createSBA,
    updateSBA,
    deleteSBA,
} from "./studentBatchAssignmentThunks";

import {
    StudentBatchAssignment,
    ApiError,
} from "./studentBatchAssignmentTypes";


// -----------------------------------------
// State Structure
// -----------------------------------------

export interface StudentBatchAssignmentState {
    assignments: StudentBatchAssignment[];
    currentAssignment: StudentBatchAssignment | null;

    totalCount: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;

    loading: boolean;
    error: ApiError | null;

    searchTerm: string;
    activeOnly: boolean;
    page: number;
}

const initialState: StudentBatchAssignmentState = {
    assignments: [],
    currentAssignment: null,

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


// -----------------------------------------
// Slice
// -----------------------------------------

const studentBatchAssignmentSlice = createSlice({
    name: "studentBatchAssignments",
    initialState,
    reducers: {
        setPage(state, action) {
            state.page = action.payload;
        },
        setSearchTerm(state, action) {
            state.searchTerm = action.payload;
        },
        setActiveOnly(state, action) {
            state.activeOnly = action.payload;
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
    },

    extraReducers: (builder) => {
        builder
            // -----------------------------------------
            // 🔹 Fetch PAGINATED
            // -----------------------------------------
            .addCase(fetchSBAPaginated.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSBAPaginated.fulfilled, (state, action) => {
                state.loading = false;

                state.assignments = action.payload.items;
                state.totalCount = action.payload.totalCount;
                state.totalPages = Math.ceil(state.totalCount / state.pageSize);
            })
            .addCase(fetchSBAPaginated.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as ApiError) ??
                    { error: "Failed to fetch batch assignments", errors: null };
            })

            // -----------------------------------------
            // 🔹 Fetch All (Non paged)
            // -----------------------------------------
            .addCase(fetchSBAList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSBAList.fulfilled, (state, action) => {
                state.loading = false;
                state.assignments = action.payload;
            })
            .addCase(fetchSBAList.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as ApiError) ??
                    { error: "Failed to load list", errors: null };
            })

            // -----------------------------------------
            // 🔹 Fetch By ID
            // -----------------------------------------
            .addCase(fetchSBAById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSBAById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentAssignment = action.payload;
            })
            .addCase(fetchSBAById.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as ApiError) ??
                    { error: "Failed to fetch assignment", errors: null };
            })

            // -----------------------------------------
            // 🔹 Create
            // -----------------------------------------
            .addCase(createSBA.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createSBA.fulfilled, (state, action) => {
                state.loading = false;

                if (action.payload.success && action.payload.data) {
                    state.assignments.unshift(action.payload.data);

                    state.totalCount += 1;
                    state.totalPages = Math.ceil(state.totalCount / state.pageSize);
                }
            })
            .addCase(createSBA.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as ApiError) ??
                    { error: "Failed to create assignment", errors: null };
            })

            // -----------------------------------------
            // 🔹 Update
            // -----------------------------------------
            .addCase(updateSBA.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateSBA.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;

                if (action.payload.success && action.payload.data) {
                    const updated = action.payload.data;

                    const index = state.assignments.findIndex(
                        (s) => s.studentBatchAssignmentId === updated.studentBatchAssignmentId
                    );

                    if (index !== -1) {
                        state.assignments[index] = updated;
                    }
                }
            })
            .addCase(updateSBA.rejected, (state, action) => {
                state.loading = false;

                if (!action.payload) {
                    state.error = { error: "Failed to update assignment", errors: null };
                } else if (typeof action.payload === "string") {
                    state.error = { error: action.payload, errors: null };
                } else {
                    state.error = {
                        error: action.payload.error ?? "Failed to update assignment",
                        errors: action.payload.errors ?? null,
                    };
                }
            })

            // -----------------------------------------
            // 🔹 Delete
            // -----------------------------------------
            .addCase(deleteSBA.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteSBA.fulfilled, (state, action) => {
                state.loading = false;

                if (action.payload.success) {
                    state.assignments = state.assignments.filter(
                        (a) => a.studentBatchAssignmentId !== action.payload.id
                    );

                    state.totalCount -= 1;
                    state.totalPages = Math.ceil(state.totalCount / state.pageSize);
                }
            })
            .addCase(deleteSBA.rejected, (state, action) => {
                state.loading = false;

                state.error =
                    (action.payload as ApiError) ??
                    { error: "Failed to delete assignment", errors: null };
            });
    },
});


// -----------------------------------------
// Export Actions & Reducer
// -----------------------------------------

export const {
    setPage,
    setSearchTerm,
    setActiveOnly,
    resetFilters,
    toggleActiveOnly
} = studentBatchAssignmentSlice.actions;

export const studentBatchAssignmentReducer = studentBatchAssignmentSlice.reducer;

export default studentBatchAssignmentSlice.reducer;
