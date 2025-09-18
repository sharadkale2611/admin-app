import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
    fetchCourseFees,
    fetchCourseFeeById,
    createCourseFee,
    updateCourseFee,
    deleteCourseFee,
    CourseFee,
    CourseFeeDto
} from './feesThunks';

interface CourseFeeState {
    courseFees: CourseFee[];
    currentCourseFee: CourseFee | null;
    loading: boolean;
    error: string | null;
    filters: {
        courseId?: number;
    };
}

const initialState: CourseFeeState = {
    courseFees: [],
    currentCourseFee: null,
    loading: false,
    error: null,
    filters: {
        courseId: undefined
    }
};

const feesSlice = createSlice({
    name: 'courseFees',
    initialState,
    reducers: {
        setCourseIdFilter: (state, action: PayloadAction<number | undefined>) => {
            state.filters.courseId = action.payload;
        },
        clearFilters: (state) => {
            state.filters.courseId = undefined;
        },
        clearCurrentCourseFee: (state) => {
            state.currentCourseFee = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Course Fees
            .addCase(fetchCourseFees.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCourseFees.fulfilled, (state, action: PayloadAction<CourseFee[]>) => {
                state.loading = false;
                state.courseFees = action.payload;
            })
            .addCase(fetchCourseFees.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to fetch course fees";
            })
            // Fetch Course Fee by ID
            .addCase(fetchCourseFeeById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCourseFeeById.fulfilled, (state, action: PayloadAction<CourseFee>) => {
                state.loading = false;
                state.currentCourseFee = action.payload;
            })
            .addCase(fetchCourseFeeById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to fetch course fee details";
                state.currentCourseFee = null;
            })
            // Create Course Fee
            .addCase(createCourseFee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCourseFee.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.success && action.payload.courseFee) {
                    state.courseFees.unshift(action.payload.courseFee);
                }
            })
            .addCase(createCourseFee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to create course fee";
            })
            // Update Course Fee
            .addCase(updateCourseFee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCourseFee.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.success) {
                    // Update the course fee in the list
                    const index = state.courseFees.findIndex(cf => cf.courseFeeId === action.payload.courseFee.courseFeeId);
                    if (index !== -1) {
                        state.courseFees[index] = action.payload.courseFee;
                    }
                    // Update currentCourseFee if it's the one being edited
                    if (state.currentCourseFee && state.currentCourseFee.courseFeeId === action.payload.courseFee.courseFeeId) {
                        state.currentCourseFee = action.payload.courseFee;
                    }
                }
            })
            .addCase(updateCourseFee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to update course fee";
            })
            // Delete Course Fee
            .addCase(deleteCourseFee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCourseFee.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.success) {
                    state.courseFees = state.courseFees.filter(cf => cf.courseFeeId !== action.payload.id);
                }
            })
            .addCase(deleteCourseFee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to delete course fee";
            });
    }
});

export const {
    setCourseIdFilter,
    clearFilters,
    clearCurrentCourseFee,
    clearError
} = feesSlice.actions;

export const courseFeeReducer = feesSlice.reducer;
export default feesSlice.reducer;