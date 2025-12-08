// src/lib/features/admission/admissionThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "@/lib/store";
import { Admission, PaginatedAdmissions, EnrollmentType, ApiResponse, AdmissionStatus, CreateAdmissionDto, UpdateAdmissionDto } from "./admissionTypes";
import API_ENDPOINTS from "@/lib/config/apiConfig";
import api from "@/lib/services/apiService";

export interface ApiError {
    error: string | null;
    // errors: string[] | null; // list of errors
    errors: Record<string, string[]> | null; // dictionary for field errors
}

export function parseApiError(error: any): ApiError {
    console.log('parseApiError from std_Thunk', error);

    // Check if response data exists
    if (error?.response?.data) {
        const data = error.response.data;

        if (data.errors && typeof data.errors === "object") {
            // Keep as Record<string, string[]>
            return { error: data.error || null, errors: data.errors as Record<string, string[]> };
        }

        if (data.error) {
            return { error: data.error, errors: null };
        }
    }

    // Generic errors
    if (error?.errors && typeof error.errors === "object") {
        return { error: error.message || null, errors: error.errors as Record<string, string[]> };
    }

    if (error?.fieldErrors && typeof error.fieldErrors === "object") {
        return { error: error.message || null, errors: error.fieldErrors as Record<string, string[]> };
    }

    return { error: "An unknown error occurred", errors: null };
}

/**
 * Fetch Admissions (paginated)
 */
export const fetchAdmissions = createAsyncThunk<
    PaginatedAdmissions,
    {
        page?: number;
        searchTerm?: string;
        statusFilter?: AdmissionStatus | null;
        paymentStatusFilter?: string | null;
        enrollmentTypeFilter?: EnrollmentType | null;
        courseFilter?: string | null;
    },
    { dispatch: AppDispatch; state: RootState; rejectValue: ApiError }
>(
    "admissions/fetchAdmissions",
    async ({ page = 1, searchTerm = "", statusFilter = null, paymentStatusFilter = null, enrollmentTypeFilter = null, courseFilter = null }, { rejectWithValue }) => {
        try {
            const query = new URLSearchParams({
                page: page.toString(),
                search: searchTerm,
                status: statusFilter !== null ? statusFilter.toString() : "",
                paymentStatus: paymentStatusFilter ?? "",
                enrollmentType: enrollmentTypeFilter ?? "",
                courseId: courseFilter ?? "",
                _: Date.now().toString()
            }).toString();

            const response = await api.get<PaginatedAdmissions>(
                `${API_ENDPOINTS.ADMISSION.GET_LIST_PAGINATED}?${query}`,
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
 * Create Admission
 */
export const createAdmission = createAsyncThunk<
    {
        success: boolean;
        message: string;
        error: string | null;
        errors: Record<string, string[]> | null;
        admission: Admission | null;
    },
    CreateAdmissionDto, // <- here
    { dispatch: AppDispatch; state: RootState; rejectValue: ApiError }
>(
    "admissions/createAdmission",
    async (admissionDto, { rejectWithValue }) => {
        try {
            const response = await api.post<ApiResponse<Admission>>(API_ENDPOINTS.ADMISSION.POST_CREATE, admissionDto, {
                withCredentials: true,
                headers: { "Content-Type": "application/json" }
            });

            if (response.success === false || (response.status !== 200 && response.status !== 201)) {
                return rejectWithValue({ error: response.message || "Failed to create admission", errors: null });
            }

            return {
                success: true,
                message: response.data?.message || "Admission created successfully",
                error: null,
                errors: null,
                admission: response.data?.data ?? null
            };
        } catch (error: any) {
            const parsed = parseApiError(error);
            return rejectWithValue({ error: parsed.error ?? "Failed to create admission", errors: parsed.errors });
        }
    }
);


/**
 * Update Admission
 */
// export const updateAdmission = createAsyncThunk<
//     { success: boolean; message: string; error: string | null; errors: string[] | null; admission: Admission },
//     Admission,
//     { dispatch: AppDispatch; state: RootState; rejectValue: ApiError }
// >(
//     "admissions/updateAdmission",
//     async (admissionDto, { rejectWithValue }) => {
//         try {
//             const response = await api.put<ApiResponse<Admission>>(
//                 `${API_ENDPOINTS.ADMISSION.PUT_UPDATE}/${admissionDto.studentEnrollmentId}`,
//                 admissionDto,
//                 { withCredentials: true }
//             );

//             if (response.status !== 200) {
//                 return rejectWithValue({ error: response.data?.error || "Failed to update admission", errors: null });
//             }

//             return {
//                 success: true,
//                 message: response.data?.message || "Admission updated successfully",
//                 error: null,
//                 errors: null,
//                 admission: response.data?.data!
//             };
//         } catch (error: any) {
//             const parsed = parseApiError(error);
//             return rejectWithValue({ error: parsed.error ?? "Failed to update admission", errors: parsed.errors });
//         }
//     }
// );


export const updateAdmission = createAsyncThunk<
    {
        success: boolean;
        message: string;
        error: string | null;
        errors: Record<string, string[]> | null;
        admission: Admission;
    },
    UpdateAdmissionDto, // <-- FIXED
    { dispatch: AppDispatch; state: RootState; rejectValue: ApiError }
>(
    "admissions/updateAdmission",
    async (dto, { rejectWithValue }) => {
        try {
            const response = await api.put<ApiResponse<Admission>>(
                `${API_ENDPOINTS.ADMISSION.PUT_UPDATE}/${dto.studentEnrollmentId}`,
                dto,
                { withCredentials: true }
            );

            if (response.status !== 200) {
                return rejectWithValue({
                    error: response.data?.error || "Failed to update admission",
                    errors: null,
                });
            }

            return {
                success: true,
                message: response.data?.message || "Admission updated successfully",
                error: null,
                errors: null,
                admission: response.data?.data!,
            };
        } catch (error: any) {
            return rejectWithValue(parseApiError(error));
        }
    }
);



/**
 * Delete Admission
 */
export const deleteAdmission = createAsyncThunk<
    { success: boolean; message: string; id: number },
    number,
    { dispatch: AppDispatch; state: RootState; rejectValue: ApiError }
>(
    "admissions/deleteAdmission",
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`${API_ENDPOINTS.ADMISSION.DELETE}/${id}`, { withCredentials: true });
            return { success: true, message: "Admission deleted successfully", id };
        } catch (error: any) {
            return rejectWithValue(parseApiError(error));
        }
    }
);

/**
 * Fetch Admission by Id
 */

export const fetchAdmissionById = createAsyncThunk<
    Admission,
    number,
    { dispatch: AppDispatch; state: RootState; rejectValue: ApiError }
>(
    "admissions/fetchAdmissionById",
    async (admissionId, { rejectWithValue }) => {
        try {
            const response = await api.get<Admission>(
                `${API_ENDPOINTS.ADMISSION.GET_BY_ID}/${admissionId}`,
                { withCredentials: true }
            );

            console.log("Admission View Response", response);
            console.log("Admission View Response", response.data);

            if (!response.data) {
                return rejectWithValue({ error: "Admission not found", errors: null });
            }

            // Return the admission object directly
            return response.data;
        } catch (error: any) {
            return rejectWithValue(parseApiError(error));
        }
    }
);
