import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    fetchCourseFees,
    fetchCourseFeeById,
    createCourseFee,
    updateCourseFee,
    deleteCourseFee,
    CourseFee,
    fetchCourseFeesByFirm,
} from './feesThunks';

interface CourseFeeState {
    courseFees: CourseFee[];
    currentCourseFee: CourseFee | null;
    loading: boolean;
    error: string | null;
    filters: {
        courseId?: number;
    };
    loadedCourseId: number | null;
}

const initialState: CourseFeeState = {
    courseFees: [],
    currentCourseFee: null,
    loading: false,
    error: null,
    filters: {
        courseId: undefined
    },
    loadedCourseId: null,
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
            .addCase(fetchCourseFees.fulfilled, (state, action) => {
                state.loading = false;
                state.courseFees = action.payload;

                const courseId = action.meta.arg?.courseId ?? null;
                state.loadedCourseId = courseId;
            })
            .addCase(fetchCourseFees.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchCourseFeesByFirm.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCourseFeesByFirm.fulfilled, (state, action) => {
                state.loading = false;
                state.courseFees = action.payload;

                // ❗ this data is NOT course-specific
                state.loadedCourseId = null;
            })
            .addCase(fetchCourseFeesByFirm.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to fetch fees by firm";
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
                state.courseFees.unshift(action.payload);
                state.currentCourseFee = action.payload;

                // 🔒 still same course
                state.loadedCourseId = action.payload.courseId;
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

                if (!action.payload || action.payload === true) return;

                const updatedFee = action.payload;

                const index = state.courseFees.findIndex(
                    cf => cf.courseFeeId === updatedFee.courseFeeId
                );

                if (index !== -1) {
                    state.courseFees[index] = updatedFee;
                }

                state.currentCourseFee = updatedFee;

                // 🔒 preserve cache key
                state.loadedCourseId = updatedFee.courseId;
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
            .addCase(deleteCourseFee.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;

                state.courseFees = state.courseFees.filter(
                    cf => cf.courseFeeId !== action.payload
                );

                if (state.currentCourseFee?.courseFeeId === action.payload) {
                    state.currentCourseFee = null;
                }

                if (state.courseFees.length === 0) {
                    state.loadedCourseId = null;
                }
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