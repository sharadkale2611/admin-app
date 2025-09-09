import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createStaff, fetchStaff, updateStaff, deleteStaff, fetchStaffById } from './staffThunks';
import { Staff, StaffState, PaginatedStaff } from "./staffTypes";

const initialState: StaffState = {
    staff: [],
    currentStaff: null, // Add this
    totalCount: 0,
    pageSize: 10,
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null,
    searchTerm: '',
    activeOnly: true,
    page: 1,
    selectedDepartment: '',
    selectedPosition: ''
};

const staffSlice = createSlice({
    name: 'staff',
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
        setDepartmentFilter: (state, action: PayloadAction<string>) => {
            state.selectedDepartment = action.payload;
            state.page = 1;
        },
        setPositionFilter: (state, action: PayloadAction<string>) => {
            state.selectedPosition = action.payload;
            state.page = 1;
        },
        resetFilters: (state) => {
            state.searchTerm = '';
            state.activeOnly = true;
            state.selectedDepartment = '';
            state.selectedPosition = '';
            state.page = 1;
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Staff
            .addCase(fetchStaff.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStaff.fulfilled, (state, action: PayloadAction<PaginatedStaff>) => {
                state.loading = false;
                const { items, totalCount, pageSize, currentPage, totalPages } = action.payload;
                state.staff = items;
                state.totalCount = totalCount;
                state.pageSize = pageSize;
                state.currentPage = currentPage;
                state.totalPages = totalPages;
            })
            .addCase(fetchStaff.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to fetch staff";
            })
            // Fetch Staff by ID
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
                state.error = action.payload as string || "Failed to fetch staff details";
                state.currentStaff = null;
            })            

            // Create Staff
            .addCase(createStaff.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createStaff.fulfilled, (state, action: PayloadAction<{ success: boolean; staff: Staff }>) => {
                state.loading = false;
                if (action.payload.success && action.payload.staff) {
                    state.staff.unshift(action.payload.staff);
                    state.totalCount += 1;
                    state.totalPages = Math.ceil(state.totalCount / state.pageSize);
                }
            })
            .addCase(createStaff.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to create staff member";
            })

            // Update Staff
            .addCase(updateStaff.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateStaff.fulfilled, (state, action: PayloadAction<{ success: boolean; staff: Staff }>) => {
                state.loading = false;
                if (action.payload.success) {
                    // Update the staff in the list
                    const index = state.staff.findIndex(s => s.staffId === action.payload.staff.staffId);
                    if (index !== -1) {
                        state.staff[index] = { ...state.staff[index], ...action.payload.staff };
                    }
                    // Update currentStaff if it's the one being edited
                    if (state.currentStaff && state.currentStaff.staffId === action.payload.staff.staffId) {
                        state.currentStaff = { ...state.currentStaff, ...action.payload.staff };
                    }
                }
            })
            .addCase(updateStaff.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to update staff member";
            })

            // Delete Staff
            .addCase(deleteStaff.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteStaff.fulfilled, (state, action: PayloadAction<{ success: boolean; id: string }>) => {
                state.loading = false;
                if (action.payload.success) {
                    state.staff = state.staff.filter(s => s.staffId !== action.payload.id);
                    state.totalCount -= 1;
                    state.totalPages = Math.ceil(state.totalCount / state.pageSize);
                }
            })
            .addCase(deleteStaff.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to delete staff member";
            });
    }
});

export const {
    setSearchTerm,
    toggleActiveOnly,
    setDepartmentFilter,
    setPositionFilter,
    resetFilters,
    setPage,
} = staffSlice.actions;

export const staffReducer = staffSlice.reducer;
export default staffSlice.reducer;
