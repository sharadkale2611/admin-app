// lib/features/courseModules/courseModuleSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CourseModuleResponseDto, CourseModuleDto } from "./courseModuleTypes";
import {
    fetchCourseModules,
    createCourseModule,
    updateCourseModule,
    deleteCourseModule,
    fetchCoursesDropdown,
    fetchModulesDropdown
} from "./courseModuleThunks";
import { Course } from "../course/courseTypes";
import { ModuleResponseDto } from "../module/moduleTypes";

interface CourseModuleState {
    courseModules: CourseModuleResponseDto[];
    coursesDropdown: Course[];
    modulesDropdown: ModuleResponseDto[];
    loading: boolean;
    dropdownLoading: boolean;
    error: string | null;
    successMessage: string | null;
}

const initialState: CourseModuleState = {
    courseModules: [],
    coursesDropdown: [],
    modulesDropdown: [],
    loading: false,
    dropdownLoading: false,
    error: null,
    successMessage: null,
};

const courseModuleSlice = createSlice({
    name: "courseModules",
    initialState,
    reducers: {
        clearMessages(state) {
            state.error = null;
            state.successMessage = null;
        },
    },
    extraReducers: (builder) => {
        // -----------------------
        // FETCH ALL COURSE MODULES
        // -----------------------
        builder.addCase(fetchCourseModules.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchCourseModules.fulfilled, (state, action: PayloadAction<CourseModuleResponseDto[]>) => {
            state.loading = false;
            state.courseModules = action.payload;
        });
        builder.addCase(fetchCourseModules.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to fetch course modules";
        });

        // -----------------------
        // CREATE COURSE MODULE
        // -----------------------
        builder.addCase(createCourseModule.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(createCourseModule.fulfilled, (state, action: PayloadAction<{ success: boolean; courseModule: CourseModuleResponseDto }>) => {
            state.loading = false;
            state.courseModules.push(action.payload.courseModule);
            state.successMessage = "Course module created successfully";
        });
        builder.addCase(createCourseModule.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to create course module";
        });

        // -----------------------
        // UPDATE COURSE MODULE
        // -----------------------
        builder.addCase(updateCourseModule.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateCourseModule.fulfilled, (state, action: PayloadAction<{ success: boolean; courseModule: CourseModuleResponseDto }>) => {
            state.loading = false;
            const index = state.courseModules.findIndex(cm => cm.courseModuleId === action.payload.courseModule.courseModuleId);
            if (index >= 0) {
                state.courseModules[index] = action.payload.courseModule;
            }
            state.successMessage = "Course module updated successfully";
        });
        builder.addCase(updateCourseModule.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to update course module";
        });

        // -----------------------
        // DELETE COURSE MODULE
        // -----------------------
        builder.addCase(deleteCourseModule.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(deleteCourseModule.fulfilled, (state, action: PayloadAction<{ success: boolean; id: number }>) => {
            state.loading = false;
            state.courseModules = state.courseModules.filter(cm => cm.courseModuleId !== action.payload.id);
            state.successMessage = "Course module deleted successfully";
        });
        builder.addCase(deleteCourseModule.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to delete course module";
        });

        // -----------------------
        // FETCH COURSES DROPDOWN
        // -----------------------
        builder.addCase(fetchCoursesDropdown.pending, (state) => {
            state.dropdownLoading = true;
            state.error = null;
        });
        builder.addCase(fetchCoursesDropdown.fulfilled, (state, action: PayloadAction<Course[]>) => {
            state.dropdownLoading = false;
            state.coursesDropdown = action.payload;
        });
        builder.addCase(fetchCoursesDropdown.rejected, (state, action) => {
            state.dropdownLoading = false;
            state.error = action.payload || "Failed to fetch courses for dropdown";
        });

        // -----------------------
        // FETCH MODULES DROPDOWN
        // -----------------------
        builder.addCase(fetchModulesDropdown.pending, (state) => {
            state.dropdownLoading = true;
            state.error = null;
        });
        builder.addCase(fetchModulesDropdown.fulfilled, (state, action: PayloadAction<ModuleResponseDto[]>) => {
            state.dropdownLoading = false;
            state.modulesDropdown = action.payload;
        });
        builder.addCase(fetchModulesDropdown.rejected, (state, action) => {
            state.dropdownLoading = false;
            state.error = action.payload || "Failed to fetch modules for dropdown";
        });
    },
});

export const { clearMessages } = courseModuleSlice.actions;
export const courseModuleReducer = courseModuleSlice.reducer;
export default courseModuleSlice.reducer;

