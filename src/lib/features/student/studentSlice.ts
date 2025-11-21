import { createSlice } from "@reduxjs/toolkit";
import {
    fetchStudents,
    fetchStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
} from "./studentThunks";
import { Student, ApiError } from "./studentTypes";

export interface StudentState {
    students: Student[];
    currentStudent: Student | null;
    totalCount: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
    loading: boolean;
    error: ApiError | null;   // ✅ changed from string | null
    searchTerm: string;
    activeOnly: boolean;
    page: number;
}

const initialState: StudentState = {
    students: [],
    currentStudent: null,
    totalCount: 0,
    pageSize: 10,
    currentPage: 1,
    totalPages: 0,
    loading: false,
    error: null,
    searchTerm: "",
    activeOnly: true,
    page: 1,
};

const studentSlice = createSlice({
    name: "students",
    initialState,
    reducers: {
        setPage(state, action) {
            state.page = action.payload;
        },
        setSearchTerm(state, action) {
            state.searchTerm = action.payload;
        },
        setActiveOnly(state, action) {
            state.activeOnly = action.payload;
        },
        toggleActiveOnly(state) {
            state.activeOnly = !state.activeOnly;
            state.page = 1;
        },
        resetFilters(state) {
            state.searchTerm = '';
            state.activeOnly = true;
            state.page = 1;
        },        
    },
    extraReducers: (builder) => {
        builder
            // 🔹 Fetch Students
            .addCase(fetchStudents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudents.fulfilled, (state, action) => {
                state.loading = false;
                state.students = action.payload.items;
                state.totalCount = action.payload.totalCount;
                state.totalPages = Math.ceil(state.totalCount / state.pageSize);
            })
            .addCase(fetchStudents.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as ApiError) ?? { error: "Failed to fetch students", errors: null };
            })

            // 🔹 Fetch Student By ID
            .addCase(fetchStudentById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudentById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentStudent = action.payload;
            })
            .addCase(fetchStudentById.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as ApiError) ?? { error: "Failed to fetch student", errors: null };
            })

            // 🔹 Create Student
            .addCase(createStudent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createStudent.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.success && action.payload.student) {
                    state.students.unshift(action.payload.student);
                    state.totalCount += 1;
                    state.totalPages = Math.ceil(state.totalCount / state.pageSize);
                }
            })
            .addCase(createStudent.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as ApiError) ?? { error: "Failed to create student", errors: null };
            })

            // 🔹 Update Student
            .addCase(updateStudent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateStudent.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null; // ✅ important: clear previous errors
                if (action.payload.success && action.payload.student) {
                    const index = state.students.findIndex(
                        (s) => s.studentId === action.payload.student?.studentId
                    );
                    if (index !== -1 && action.payload.student) {
                        state.students[index] = action.payload.student;
                    }
                }
            })
            .addCase(updateStudent.rejected, (state, action) => {
                state.loading = false;
                if (!action.payload) {
                    // fallback if payload is undefined
                    state.error = { error: 'Failed to update student', errors: null };
                } else if (typeof action.payload === 'string') {
                    state.error = { error: action.payload, errors: null };
                } else {
                    // ensure it's ApiError
                    state.error = {
                        error: action.payload.error ?? 'Failed to update student',
                        // errors: action.payload.errors ?? null,
                    };
                }
            })
            // 🔹 Delete Student
            .addCase(deleteStudent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteStudent.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.success) {
                    state.students = state.students.filter(
                        (s) => s.studentId !== action.payload.id
                    );
                    state.totalCount -= 1;
                    state.totalPages = Math.ceil(state.totalCount / state.pageSize);
                }
            })
            .addCase(deleteStudent.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as ApiError) ?? { error: "Failed to delete student", errors: null };
            });
    },
});

export const { setPage, setSearchTerm, setActiveOnly, resetFilters, toggleActiveOnly } = studentSlice.actions;
export const studentReducer = studentSlice.reducer;
export default studentSlice.reducer;
