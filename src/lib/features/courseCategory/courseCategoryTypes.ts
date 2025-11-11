// src/lib/features/courseCategory/courseCategoryTypes.ts

export interface CourseCategory {
    courseCategoryId: number;
    firmId?: number | null;
    parentId?: number | null;
    courseCategoryName: string;
    status: boolean;
    courseCategoryOrder: number;
    createdAt: string;
    updatedAt?: string | null;
    isDeleted?: boolean;
}

export interface CourseCategoryDto {
    firmId?: number | null;
    parentId?: number | null;
    courseCategoryName: string;
    status: boolean;
    courseCategoryOrder: number;
}

export interface CourseCategoryResponseDto extends CourseCategoryDto {
    courseCategoryId: number;
    firmName?: string | null;
    parentCategoryName?: string | null;
    createdAt: string;
    updatedAt?: string | null;
}

export interface CourseCategoryTreeDto extends CourseCategoryResponseDto {
    children: CourseCategoryTreeDto[];
}

export interface PaginatedCourseCategories {
    items: CourseCategoryResponseDto[];
    totalCount: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
}

export interface CourseCategoryState {
    categories: CourseCategoryResponseDto[];
    currentCategory: CourseCategoryResponseDto | null;
    categoryTree: CourseCategoryTreeDto[];
    totalCount: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
    loading: boolean;
    error: string | null;
    searchTerm: string;
    activeOnly: boolean;
    page: number;
    selectedFirm: string;
}

export interface FetchCourseCategoriesParams {
    page?: number;
    searchTerm?: string;
    activeOnly?: boolean;
    firmId?: number | null;
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string | null;
    errors?: Record<string, string[]> | null;
}