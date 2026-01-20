export interface Exam {
  examId: number;
  firmId: number;
  courseId?: number | null;
  moduleId: number;

  examName: string;
  examDescription?: string | null;

  examDurationHrs: number;
  examDateTime?: string | null;
  examTotalMarks: number;
  examPassingMarks: number;

  isActive: boolean;
  isDeleted?: boolean;

  createdAt: string;
  updatedAt?: string | null;
}

export interface PaginatedExam {
  items: Exam[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}

export interface ExamState {
  exams: Exam[];
  currentExam: Exam | null;

  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;

  loading: boolean;
  error: string | null;

  searchTerm: string;
  isActive: boolean;
  page: number;

  firmId: number | null;
}


export interface CreateExamDto {
  firmId: number;
  courseId?: number | null;
  moduleId: number;

  examName: string;
  examDescription?: string | null;

  examDurationHrs: number;
  examDateTime: string;
  examTotalMarks: number;
  examPassingMarks: number;

  isActive: boolean;
}

export interface UpdateExamDto extends Partial<CreateExamDto> {
  id: number;
  isActive?: boolean;
}
export interface FetchExamParams {
  page?: number;
  searchTerm?: string;
  isActive?: boolean;
  firmId?: number | null;
  pageSize?: number;
}
