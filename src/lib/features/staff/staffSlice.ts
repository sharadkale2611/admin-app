// lib/features/staff/staffSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    createStaff,
    fetchStaff,
    updateStaff,
    deleteStaff,
    fetchStaffById,
    fetchAllStaff,   // ⭐ NEW IMPORT
} from "./staffThunks";

import { Staff, StaffState, PaginatedStaff } from "./staffTypes";

const initialState: StaffState = {
    staff: [],               // paginated list
    dropdownStaff: [],        // ⭐ NEW LIST FOR DROPDOWNS

    currentStaff: null,

    totalCount: 0,
    pageSize: 10,
    currentPage: 1,
    totalPages: 1,

    loading: false,
    error: null,

    searchTerm: "",
    isActive: true,
    page: 1,

    selectedDepartment: "",
    selectedPosition: "",

    firmId: null,
};

const staffSlice = createSlice({
    name: "staff",
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

        setDepartmentFilter(state, action: PayloadAction<string>) {
            state.selectedDepartment = action.payload;
            state.page = 1;
        },

        setPositionFilter(state, action: PayloadAction<string>) {
            state.selectedPosition = action.payload;
            state.page = 1;
        },

        resetFilters(state) {
            state.searchTerm = "";
            state.isActive = true;
            state.selectedDepartment = "";
            state.selectedPosition = "";
            state.page = 1;
        },

        setPage(state, action: PayloadAction<number>) {
            state.page = action.payload;
        },
    },

    extraReducers: (builder) => {
        builder
            /* =====================================================
               ⭐ FETCH PAGINATED STAFF
            ===================================================== */
            .addCase(fetchStaff.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchStaff.fulfilled, (state, action: PayloadAction<PaginatedStaff>) => {
                state.loading = false;

                state.staff = action.payload.items;
                state.totalCount = action.payload.totalCount;
                state.currentPage = action.payload.currentPage;
                state.pageSize = action.payload.pageSize;
                state.totalPages = action.payload.totalPages;
            })

            .addCase(fetchStaff.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Failed to fetch staff";
            })

            /* =====================================================
               ⭐ FETCH ALL STAFF (NON PAGINATED → For dropdown)
            ===================================================== */
            .addCase(fetchAllStaff.pending, (state) => {
                // NOT blocking UI
            })

            .addCase(fetchAllStaff.fulfilled, (state, action: PayloadAction<Staff[]>) => {
                state.dropdownStaff = action.payload;
            })

            .addCase(fetchAllStaff.rejected, (state, action) => {
                state.error = (action.payload as string) || "Failed to load staff list";
            })

            /* =====================================================
               ⭐ FETCH STAFF BY ID
            ===================================================== */
            .addCase(fetchStaffById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchStaffById.fulfilled, (state, action: PayloadAction<Staff>) => {
                state.loading = false;
                state.currentStaff = action.payload;
            })

            .addCase(fetchStaffById.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Failed to fetch staff details";
                state.currentStaff = null;
            })

            /* =====================================================
               ⭐ CREATE STAFF
            ===================================================== */
            .addCase(createStaff.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(createStaff.fulfilled, (state, action) => {
                state.loading = false;

                if (action.payload.success && action.payload.staff) {
                    state.staff.unshift(action.payload.staff); // update paginated
                    state.dropdownStaff.unshift(action.payload.staff); // ⭐ also update dropdown
                    state.totalCount += 1;
                    state.totalPages = Math.ceil(state.totalCount / state.pageSize);
                }
            })

            .addCase(createStaff.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Failed to create staff member";
            })

            /* =====================================================
               ⭐ UPDATE STAFF
            ===================================================== */
            .addCase(updateStaff.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(updateStaff.fulfilled, (state, action) => {
                state.loading = false;

                if (action.payload.success) {
                    const updated = action.payload.staff;

                    // Update in paginated list
                    const index = state.staff.findIndex((s) => s.staffId === updated.staffId);
                    if (index !== -1) {
                        state.staff[index] = { ...state.staff[index], ...updated };
                    }

                    // Update in dropdown staff ⭐
                    const ddIndex = state.dropdownStaff.findIndex((s) => s.staffId === updated.staffId);
                    if (ddIndex !== -1) {
                        state.dropdownStaff[ddIndex] = { ...state.dropdownStaff[ddIndex], ...updated };
                    }

                    // Update currentStaff
                    if (state.currentStaff?.staffId === updated.staffId) {
                        state.currentStaff = { ...state.currentStaff, ...updated };
                    }
                }
            })

            .addCase(updateStaff.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Failed to update staff member";
            })

            /* =====================================================
               ⭐ DELETE STAFF
            ===================================================== */
            .addCase(deleteStaff.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(deleteStaff.fulfilled, (state, action) => {
                state.loading = false;

                if (action.payload.success) {
                    // remove from paginated list
                    state.staff = state.staff.filter((s) => s.staffId !== action.payload.id);

                    // remove from dropdown list ⭐
                    state.dropdownStaff = state.dropdownStaff.filter(
                        (s) => s.staffId !== action.payload.id
                    );

                    state.totalCount -= 1;
                    state.totalPages = Math.ceil(state.totalCount / state.pageSize);
                }
            })

            .addCase(deleteStaff.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Failed to delete staff member";
            });
    },
});

export const {
    setFirmId,
    setSearchTerm,
    toggleActiveOnly,
    setDepartmentFilter,
    setPositionFilter,
    resetFilters,
    setPage,
} = staffSlice.actions;

export default staffSlice.reducer;
