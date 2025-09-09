export enum CourseLevel {
    Beginner = 'Beginner',
    Intermediate = 'Intermediate',
    Expert = 'Expert'
}

export interface Course {
    courseId: number;
    firmId?: number;
    firmName?: string;
    courseCategoryId: number;
    courseCategoryName: string;
    courseName: string;
    courseDescription: string;
    courseLevel: CourseLevel;
    status: boolean;
    courseOrder: number;
    createdAt: string;
    updatedAt?: string;
}

export interface PaginatedCourses {
    items: Course[];
    totalCount: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
}

export interface CourseState {
    courses: Course[];
    currentCourse: Course | null;
    totalCount: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
    loading: boolean;
    error: string | null;
    searchTerm: string;
    statusFilter: boolean | null;
    courseLevelFilter: CourseLevel | null;
    categoryFilter: number | null;
    page: number;
}

export interface CreateCourseDto {
    firmId?: number;
    courseCategoryId: number;
    courseName: string;
    courseDescription: string;
    courseLevel: CourseLevel;
    status: boolean;
    courseOrder: number;
}

export interface UpdateCourseDto {
    id: number;
    firmId?: number;
    courseCategoryId: number; // Make this required
    courseName: string;
    courseDescription: string;
    courseLevel: CourseLevel;
    status: boolean;
    courseOrder: number; // Make this required
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string | null;
    errors?: any | null;
}

export interface FetchCoursesParams {
    page?: number;
    searchTerm?: string;
    status?: boolean | null;
    courseLevel?: CourseLevel | null;
    categoryId?: number | null;
}

export interface CreateCourseDto {
    firmId?: number;
    courseCategoryId: number;
    courseName: string;
    courseDescription: string;
    courseLevel: CourseLevel;
    status: boolean;
    courseOrder: number;
}