import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    createCourse,
    fetchCourses,
    updateCourse,
    deleteCourse,
    fetchCourseById,
    fetchCoursesListOptions
} from './courseThunks';
import { Course, CourseState, CourseLevel, PaginatedCourses, CourseWithDetails } from "./courseTypes";

const initialState: CourseState = {
    courses: [],
    currentCourse: null,
    totalCount: 0,
    pageSize: 10,
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null,
    searchTerm: '',
    statusFilter: null,
    courseLevelFilter: null,
    categoryFilter: null,
    page: 1
};

const courseSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {
        setSearchTerm: (state, action: PayloadAction<string>) => {
            state.searchTerm = action.payload;
            state.page = 1;
        },
        setStatusFilter: (state, action: PayloadAction<boolean | null>) => {
            state.statusFilter = action.payload;
            state.page = 1;
        },
        setCourseLevelFilter: (state, action: PayloadAction<CourseLevel | null>) => {
            state.courseLevelFilter = action.payload;
            state.page = 1;
        },
        setCategoryFilter: (state, action: PayloadAction<number | null>) => {
            state.categoryFilter = action.payload;
            state.page = 1;
        },
        resetFilters: (state) => {
            state.searchTerm = '';
            state.statusFilter = null;
            state.courseLevelFilter = null;
            state.categoryFilter = null;
            state.page = 1;
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        clearCurrentCourse: (state) => {
            state.currentCourse = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Courses
            .addCase(fetchCourses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCourses.fulfilled, (state, action: PayloadAction<PaginatedCourses>) => {
                state.loading = false;
                const { items, totalCount, pageSize, currentPage, totalPages } = action.payload;
                state.courses = items;
                state.totalCount = totalCount;
                state.pageSize = pageSize;
                state.currentPage = currentPage;
                state.totalPages = totalPages;
            })
            .addCase(fetchCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to fetch courses";
            })
            // Fetch Course by ID
            .addCase(fetchCourseById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCourseById.fulfilled, (state, action: PayloadAction<CourseWithDetails>) => {
                state.loading = false;
                state.currentCourse = action.payload;
            })
            .addCase(fetchCourseById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to fetch course details";
                state.currentCourse = null;
            })
            // Create Course
            .addCase(createCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCourse.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.success && action.payload.course) {
                    state.courses.unshift(action.payload.course);
                    state.totalCount += 1;
                    state.totalPages = Math.ceil(state.totalCount / state.pageSize);
                }
            })
            .addCase(createCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to create course";
            })
            // Update Course
            .addCase(updateCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCourse.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.success) {
                    // Update the course in the list
                    const index = state.courses.findIndex(c => c.courseId === action.payload.course.courseId);
                    if (index !== -1) {
                        state.courses[index] = action.payload.course;
                    }
                    // Update currentCourse if it's the one being edited
                    if (state.currentCourse && state.currentCourse.courseId === action.payload.course.courseId) {
                        state.currentCourse = action.payload.course;
                    }
                }
            })
            .addCase(updateCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to update course";
            })
            // Delete Course
            .addCase(deleteCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCourse.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.success) {
                    state.courses = state.courses.filter(c => c.courseId !== action.payload.id);
                    state.totalCount -= 1;
                    state.totalPages = Math.ceil(state.totalCount / state.pageSize);
                }
            })
            .addCase(deleteCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to delete course";
            })
            .addCase(fetchCoursesListOptions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCoursesListOptions.fulfilled, (state, action: PayloadAction<Course[]>) => {
                state.loading = false;
                state.courses = action.payload; // ✅ update courses array
            })
            .addCase(fetchCoursesListOptions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Failed to fetch courses";
            })           
            ;
    }
});

export const {
    setSearchTerm,
    setStatusFilter,
    setCourseLevelFilter,
    setCategoryFilter,
    resetFilters,
    setPage,
    clearCurrentCourse
} = courseSlice.actions;

export const courseReducer = courseSlice.reducer;
export default courseSlice.reducer;