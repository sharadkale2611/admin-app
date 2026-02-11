import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "@/lib/store";
import {
    Student,
    CreateStudentDto,
    UpdateStudentDto,
    PaginatedStudent,
    ApiResponse,
    FetchStudentParams,
    CreateStudentResponse,
    CreatedStudent,
    StudentByAadharResponse,
    StudentBatchAssignment,
    ModuleWiseAttendanceResponse,
    ApiError
} from "./studentTypes";
import API_ENDPOINTS from "@/lib/config/apiConfig";
import api from "@/lib/services/apiService";

type UpdateStudentPayload = {
    id: number;
    data: UpdateStudentDto;
};


/**
 * Common error parser for API responses
 */

function parseApiError(error: any): ApiError {
    if (error?.response?.data) {
        const data = error.response.data;

        if (data.errors && typeof data.errors === "object") {
            return {
                error: null,
                errors: data.errors
            };
        }

        if (data.error) {
            return {
                error: data.error,
                errors: null
            };
        }
    }

    return {
        error: "An unknown error occurred",
        errors: null
    };
}




export const fetchStudentList = createAsyncThunk<
    Student[], // Response type: list of students
    void,      // No parameters
    { dispatch: AppDispatch; state: RootState; rejectValue: ApiError }
>(
    "students/fetchStudents",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<Student[]>(
                API_ENDPOINTS.STUDENT.GET_LIST,
                { withCredentials: true }
            );

            if (!response.data) {
                return rejectWithValue({
                    error: "No data returned from server",
                    errors: null,
                });
            }

            return response.data;
        } catch (error: any) {
            return rejectWithValue(parseApiError(error));
        }
    }
);



/**
 * Fetch Students (paginated)
 */
export const fetchStudents = createAsyncThunk<
    PaginatedStudent,
    FetchStudentParams,
    { dispatch: AppDispatch; state: RootState; rejectValue: ApiError }
>(
    "students/fetchStudents",
    async ({ page = 1, searchTerm = "", activeOnly = true }, { rejectWithValue }) => {
        try {
            const query = new URLSearchParams({
                page: page.toString(),
                search: searchTerm,
                activeOnly: activeOnly.toString(),
                _: Date.now().toString()
            }).toString();

            const response = await api.get<PaginatedStudent>(
                `${API_ENDPOINTS.STUDENT.GET_LIST_PAGINATED}?${query}`,
                { withCredentials: true }
            );

            if (!response.data) {
                return rejectWithValue({ error: "No data from server", errors: null });
            }

            return response.data;
        } catch (error: any) {
            return rejectWithValue(parseApiError(error));
        }
    }
);




/**
 * Create Student
 */

export const createStudent = createAsyncThunk<
    {
        success: boolean;
        message: string;
        error: string | null;
        errors: Record<string, string[]> | null;
        student: CreatedStudent | null;
    },
    CreateStudentDto,
    { rejectValue: ApiError }
>(
    "students/createStudent",
    async (createStudentDto, { rejectWithValue }) => {
        try {
            const response = await api.post<CreateStudentResponse>(
                API_ENDPOINTS.STUDENT.POST_CREATE,
                createStudentDto,
                { withCredentials: true }
            );

            if (!response.success || !response.data) {
                return rejectWithValue({
                    error: response.message || "Invalid server response",
                    errors: response.errors ?? null, // ✅ NO FLATTENING
                });
            }
            const created = response.data;

            return {
                success: true,
                message: response.message || "Student created successfully",
                error: null,
                errors: null,
                student: {
                    studentId: created.studentId,
                    studentCode: created.studentCode,
                    userName: created.userName,
                },
            };
        } catch (error: any) {
            return rejectWithValue({
                error: error.message || "Creation failed",
                errors: error.errors ?? null,
            });
        }
    }
);



/**
 * Update Student
 */
export const updateStudent = createAsyncThunk<
    {
        success: boolean;
        message: string;
        error: string | null;
        errors: string[] | null;
        student: Student;
    },
    UpdateStudentPayload,
    { dispatch: AppDispatch; state: RootState; rejectValue: ApiError }
>(
    "students/updateStudent",
    async ({ id, data }, { rejectWithValue, getState }) => {
        try {
            const response = await api.put<ApiResponse<null>>(
                `${API_ENDPOINTS.STUDENT.PUT_UPDATE}/${id}`,
                data,
                {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (!response.success) {
                return rejectWithValue({
                    error: response.error || response.message || "Update failed",
                    errors: null,
                });
            }

            /* ============================
               Fetch updated student
            ============================ */
            try {
                const studentResponse = await api.get<ApiResponse<Student>>(
                    `${API_ENDPOINTS.STUDENT.GET_BY_ID}/${id}`,
                    { withCredentials: true }
                );

                if (studentResponse.success && studentResponse.data) {
                    const updatedStudent: Student = studentResponse.data.data!;

                    return {
                        success: true,
                        message: response.message || "Student updated successfully",
                        error: null,
                        errors: null,
                        student: updatedStudent,
                    };
                }
            } catch {
                // ignore & fallback
            }

            /* ============================
               Fallback: merge from state
            ============================ */
            const state = getState() as RootState;

            const existingStudent =
                state.students.currentStudent ||
                state.students.students.find((s: Student) => s.studentId === id);

            if (!existingStudent) {
                return rejectWithValue({
                    error: "Could not find student to update",
                    errors: null,
                });
            }

            const mergedStudent: Student = {
                ...existingStudent,
                ...data,
                studentId: id,
                updatedAt: new Date().toISOString(),
            };

            return {
                success: true,
                message: response.message || "Student updated successfully",
                error: null,
                errors: null,
                student: mergedStudent,
            };
        } catch (error: any) {
            const parsed = parseApiError(error);
            return rejectWithValue({
                error: parsed.error ?? "Update failed",
                errors: parsed.errors ?? null,
            });
        }
    }
);



/**
 * Delete Student
 */
export const deleteStudent = createAsyncThunk<
    { success: boolean; message: string; id: number },
    number,
    { dispatch: AppDispatch; state: RootState; rejectValue: ApiError }
>(
    "students/deleteStudent",
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`${API_ENDPOINTS.STUDENT.DELETE}/${id}`, { withCredentials: true });

            return {
                success: true,
                message: "Student deleted successfully",
                id
            };
        } catch (error: any) {
            return rejectWithValue(parseApiError(error));
        }
    }
);


/**
 * Fetch Student By Id
 */
export const fetchStudentById = createAsyncThunk<
    Student,
    string,
    { dispatch: AppDispatch; state: RootState; rejectValue: ApiError }
>(
    "students/fetchStudentById",
    async (studentId, { rejectWithValue }) => {
        try {
            const response = await api.get<Student>(
                `${API_ENDPOINTS.STUDENT.GET_BY_ID}/${studentId}`,
                { withCredentials: true }
            );

            if (!response.data) {
                return rejectWithValue({ error: "Student not found", errors: null });
            }

            return response.data;
        } catch (error: any) {
            return rejectWithValue(parseApiError(error));
        }
    }
);


// export const fetchStudentByMobile = createAsyncThunk<
//     StudentByMobileResponse,
//     string,
//     { rejectValue: ApiError }
// >(
//     "students/fetchStudentByMobile",
//     async (mobile, { rejectWithValue }) => {
//         try {
//             // ✅ api.get<T>() already returns ApiResponse<T>
//             const response = await api.get<StudentByMobileResponse>(
//                 `${API_ENDPOINTS.STUDENT.GET_BY_MOBILE}/${mobile}`,
//                 { withCredentials: true }
//             );

//             // response is ApiResponse<StudentByMobileResponse>
//             if (!response.success || !response.data) {
//                 return rejectWithValue({
//                     error: "Student not found",
//                     errors: null,
//                 });
//             }

//             // ✅ Explicitly return payload
//             const payload: StudentByMobileResponse = response.data;
//             return payload;

//         } catch (error: any) {
//             return rejectWithValue(parseApiError(error));
//         }
//     }
// );


export const fetchStudentByAadhar = createAsyncThunk<
    StudentByAadharResponse,
    string,
    { rejectValue: ApiError }
>(
    "students/fetchStudentByAadhar",
    async (aadharNumber, { rejectWithValue }) => {
        try {
            const response = await api.get<StudentByAadharResponse>(
                `${API_ENDPOINTS.STUDENT.GET_BY_AADHAR}/${aadharNumber}`,
                { withCredentials: true }
            );

            if (!response.success || !response.data) {
                return rejectWithValue({
                    error: "Student not found",
                    errors: null,
                });
            }

            const payload: StudentByAadharResponse = response.data;
            return payload;

        } catch (error: any) {
            return rejectWithValue(parseApiError(error));
        }
    }
);



export const fetchStudentBatchCourseAssignments = createAsyncThunk<
    StudentBatchAssignment[],   // ✅ fulfilled payload
    number,                     // batchId
    { rejectValue: ApiError }   // ✅ IMPORTANT
>(
    "students/fetchStudentBatchCourseAssignments",
    async (batchId, { rejectWithValue }) => {
        try {
            const response = await api.get<StudentBatchAssignment[]>(
                `${API_ENDPOINTS.STUDENT.GET_BATCH_COURSE_ASSIGNMENTS}/${batchId}`,
                { withCredentials: true }
            );

            if (!response.success || !response.data) {
                return rejectWithValue({
                    error: response.error || "No data returned from server",
                    errors: null
                });
            }

            return response.data;
        } catch (err: any) {
            return rejectWithValue({
                error: err.message ?? "Failed to load batch assignments",
                errors: null,
            });
        }
    }
);





type UpdateProfileImageResponse = {
    studentId: number;
    profileImagePath: string;
};

export const updateStudentProfileImage = createAsyncThunk<
    UpdateProfileImageResponse,
    { studentId: number; file: File },
    { rejectValue: ApiError }
>(
    "students/updateStudentProfileImage",
    async ({ studentId, file }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append("ProfileImage", file); // Must match DTO property name

            const response = await api.put<UpdateProfileImageResponse>(
                `${API_ENDPOINTS.STUDENT.GET_BY_ID}/${studentId}/profile-image`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                }

            );

            if (!response.success || !response.data) {
                return rejectWithValue({
                    error:
                        typeof response.data === "string"
                            ? response.data
                            : response.message || "Failed to update profile image",
                    errors: null,
                });
            }

            // Always return a value (never undefined)
            return response.data as UpdateProfileImageResponse;

        } catch (error: any) {
            return rejectWithValue({
                error: error?.response?.data?.message || "Upload failed",
                errors: error?.response?.data?.errors || null,
            });
        }
    }
);


export const fetchStudentModuleWiseAttendance = createAsyncThunk<
    ModuleWiseAttendanceResponse,
    {
        studentId: number;
        from?: string;
        to?: string;
    },
    { rejectValue: ApiError }
>(
    "students/fetchStudentModuleWiseAttendance",
    async ({ studentId, from, to }, { rejectWithValue }) => {
        try {
            const queryParams = new URLSearchParams();
            if (from) queryParams.append("from", from);
            if (to) queryParams.append("to", to);

            const response = await api.get<
                ApiResponse<ModuleWiseAttendanceResponse>
            >(
                `${API_ENDPOINTS.ATTENDANCE.GET_BY_STUDENT_ID}/${studentId}/module-wise?${queryParams.toString()}`,
                { withCredentials: true }
            );

            // ❗ Only check success
            if (!response.success) {
                return rejectWithValue({
                    error:
                        response.message ||
                        "Failed to fetch module-wise attendance",
                    errors: response.errors || null,
                });
            }

            // ❗ Make sure data exists
            if (!response.data) {
                return rejectWithValue({
                    error: "No attendance data returned",
                    errors: null,
                });
            }

            return response.data;

        } catch (error: any) {
            return rejectWithValue({
                error:
                    error?.response?.data?.message ||
                    error?.response?.data?.error ||
                    "Something went wrong",
                errors: error?.response?.data?.errors || null,
            });
        }
    }
);
