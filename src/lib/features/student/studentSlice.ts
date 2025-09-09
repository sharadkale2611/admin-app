import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    createStudent,
    fetchStudents,
    updateStudent,
    deleteStudent,
    fetchStudentById
} from './studentThunks';
import { Student, StudentState, PaginatedStudent } from "./studentTypes";

const initialState: StudentState = {
    students: [],
    currentStudent: null,
    totalCount: 0,
    pageSize: 10,
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null,
    searchTerm: '',
    activeOnly: true,
    page: 1
};

const studentSlice = createSlice({
    name: 'students',
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
        resetFilters: (state) => {
            state.searchTerm = '';
            state.activeOnly = true;
            state.page = 1;
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        clearCurrentStudent: (state) => {
            state.currentStudent = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Students
            .addCase(fetchStudents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudents.fulfilled, (state, action: PayloadAction<PaginatedStudent>) => {
                state.loading = false;
                const { items, totalCount, pageSize, currentPage, totalPages } = action.payload;
                state.students = items;
                state.totalCount = totalCount;
                state.pageSize = pageSize;
                state.currentPage = currentPage;
                state.totalPages = totalPages;
            })
            .addCase(fetchStudents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to fetch students";
            })
            // Fetch Student by ID
            .addCase(fetchStudentById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudentById.fulfilled, (state, action: PayloadAction<Student>) => {
                state.loading = false;
                state.currentStudent = action.payload;
            })
            .addCase(fetchStudentById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to fetch student details";
                state.currentStudent = null;
            })
            // Create Student
            .addCase(createStudent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createStudent.fulfilled, (state, action: PayloadAction<{ success: boolean; student: Student }>) => {
                state.loading = false;
                if (action.payload.success && action.payload.student) {
                    state.students.unshift(action.payload.student);
                    state.totalCount += 1;
                    state.totalPages = Math.ceil(state.totalCount / state.pageSize);
                }
            })
            .addCase(createStudent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to create student";
            })
            // Update Student
            .addCase(updateStudent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateStudent.fulfilled, (state, action: PayloadAction<{ success: boolean; student: Student }>) => {
                state.loading = false;
                if (action.payload.success) {
                    const index = state.students.findIndex(s => s.studentId === action.payload.student.studentId);
                    if (index !== -1) {
                        state.students[index] = { ...state.students[index], ...action.payload.student };
                    }
                    if (state.currentStudent && state.currentStudent.studentId === action.payload.student.studentId) {
                        state.currentStudent = { ...state.currentStudent, ...action.payload.student };
                    }
                }
            })
            .addCase(updateStudent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to update student";
            })
            // Delete Student
            .addCase(deleteStudent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteStudent.fulfilled, (state, action: PayloadAction<{ success: boolean; id: string }>) => {
                state.loading = false;
                if (action.payload.success) {
                    state.students = state.students.filter(s => s.studentId !== action.payload.id);
                    state.totalCount -= 1;
                    state.totalPages = Math.ceil(state.totalCount / state.pageSize);
                }
            })
            .addCase(deleteStudent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to delete student";
            });
    }
});

export const {
    setSearchTerm,
    toggleActiveOnly,
    resetFilters,
    setPage,
    clearCurrentStudent
} = studentSlice.actions;

export const studentReducer = studentSlice.reducer;
export default studentSlice.reducer;