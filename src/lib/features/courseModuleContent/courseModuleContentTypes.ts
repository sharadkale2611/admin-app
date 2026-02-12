export interface CourseModuleContentDto {
  courseModuleId: number;
  contentName: string;
  contentDescription?: string | null;
  durationInHrs?: number | null;
  contentOrder: number;
  status?: string | null;
}

export interface CourseModuleContentResponseDto {
  courseModuleContentId: number;
  courseModuleId: number;
  contentName: string;
  contentDescription?: string | null;
  durationInHrs?: number | null;
  contentOrder: number;
  status?: string | null;
  createdAt?: string;
  updatedAt?: string | null;
}

export interface CourseModuleContentState {
  contents: CourseModuleContentResponseDto[];
  loading: boolean;
  error: string | null;
}
