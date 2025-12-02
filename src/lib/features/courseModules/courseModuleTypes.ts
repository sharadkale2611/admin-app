export interface CourseModuleDto {
    courseId: number;
    moduleId: number;
    moduleOrder: number;
    isActive: boolean;
}

export interface CourseModuleResponseDto {
    courseModuleId: number;
    courseId: number ;
    courseName: string | null;
    courseCategoryName: string | null;
    moduleId: number;
    moduleName: string | null;

    moduleOrder: number;
    isActive: boolean;

    createdAt: string;
    updatedAt: string | null;
    isDeleted: boolean;
}
