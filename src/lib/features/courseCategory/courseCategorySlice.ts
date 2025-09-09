import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    createCourseCategory,
    fetchCourseCategories,
    updateCourseCategory,
    deleteCourseCategory,
    fetchCourseCategoryById,
    fetchCourseCategoryTree
} from './courseCategoryThunks';
import {
    CourseCategoryState,
    CourseCategoryResponseDto,
    CourseCategoryTreeDto
} from "./courseCategoryTypes";

const initialState: CourseCategoryState = {
    categories: [],
    currentCategory: null,
    categoryTree: [],
    totalCount: 0,
    pageSize: 10,
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null,
    searchTerm: '',
    activeOnly: true,
    page: 1,
    selectedFirm: ''
};

const courseCategorySlice = createSlice({
    name: 'courseCategories',
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
        setFirmFilter: (state, action: PayloadAction<string>) => {
            state.selectedFirm = action.payload;
            state.page = 1;
        },
        resetFilters: (state) => {
            state.searchTerm = '';
            state.activeOnly = true;
            state.selectedFirm = '';
            state.page = 1;
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        clearCurrentCategory: (state) => {
            state.currentCategory = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Categories
            .addCase(fetchCourseCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCourseCategories.fulfilled, (state, action: PayloadAction<CourseCategoryResponseDto[]>) => {
                state.loading = false;
                state.categories = action.payload;
                state.totalCount = action.payload.length;
                state.totalPages = Math.ceil(action.payload.length / state.pageSize);
            })
            .addCase(fetchCourseCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to fetch categories";
            })

            // Fetch Category Tree
            .addCase(fetchCourseCategoryTree.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCourseCategoryTree.fulfilled, (state, action: PayloadAction<CourseCategoryTreeDto[]>) => {
                state.loading = false;
                state.categoryTree = action.payload;
            })
            .addCase(fetchCourseCategoryTree.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to fetch category tree";
            })

            // Fetch Category by ID
            .addCase(fetchCourseCategoryById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCourseCategoryById.fulfilled, (state, action: PayloadAction<CourseCategoryResponseDto>) => {
                state.loading = false;
                state.currentCategory = action.payload;
            })
            .addCase(fetchCourseCategoryById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to fetch category details";
                state.currentCategory = null;
            })

            // Create Category
            .addCase(createCourseCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCourseCategory.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.success && action.payload.category) {
                    state.categories.unshift(action.payload.category);
                    state.totalCount += 1;
                    state.totalPages = Math.ceil(state.totalCount / state.pageSize);
                }
            })
            .addCase(createCourseCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to create category";
            })

            // Update Category
            .addCase(updateCourseCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCourseCategory.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.success && action.payload.category) {
                    // Update the category in the list
                    const index = state.categories.findIndex(c => c.courseCategoryId === action.payload.category.courseCategoryId);
                    if (index !== -1) {
                        state.categories[index] = action.payload.category;
                    }
                    // Update currentCategory if it's the one being edited
                    if (state.currentCategory && state.currentCategory.courseCategoryId === action.payload.category.courseCategoryId) {
                        state.currentCategory = action.payload.category;
                    }
                }
            })
            .addCase(updateCourseCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to update category";
            })

            // Delete Category
            .addCase(deleteCourseCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCourseCategory.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.success) {
                    state.categories = state.categories.filter(c => c.courseCategoryId !== action.payload.id);
                    state.totalCount -= 1;
                    state.totalPages = Math.ceil(state.totalCount / state.pageSize);
                    if (state.currentCategory && state.currentCategory.courseCategoryId === action.payload.id) {
                        state.currentCategory = null;
                    }
                }
            })
            .addCase(deleteCourseCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to delete category";
            });
    }
});

export const {
    setSearchTerm,
    toggleActiveOnly,
    setFirmFilter,
    resetFilters,
    setPage,
    clearCurrentCategory,
    clearError
} = courseCategorySlice.actions;

export const courseCategoryReducer = courseCategorySlice.reducer;
export default courseCategorySlice.reducer;