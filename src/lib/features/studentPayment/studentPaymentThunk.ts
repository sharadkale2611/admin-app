// src/lib/features/studentPayment/studentPaymentThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "@/lib/store";
import { ApiResponse, UpdateStudentPaymentRequest } from "@/lib/features/studentPayment/studentPaymentType";
import { StudentPayment } from "./studentPaymentType";
import API_ENDPOINTS from "@/lib/config/apiConfig";
import api from "@/lib/services/apiService";

/**
 * Same ApiError used everywhere
 */
export interface ApiError {
    error: string | null;
    errors: string[] | null;
}

/**
 * Reuse your common parser
 */
function parseApiError(error: any): ApiError {
    if (error?.response?.data) {
        const data = error.response.data;

        if (data.errors && typeof data.errors === "object") {
            const flattened = Object.entries(data.errors).flatMap(([field, msgs]) =>
                (msgs as string[]).map(msg => `${field}: ${msg}`)
            );
            return { error: null, errors: flattened };
        }

        if (data.error) {
            return { error: data.error, errors: null };
        }
    }

    return {
        error: error?.message || "An unknown error occurred",
        errors: null
    };
}

/**
 * Fetch Student Payments by Student Id
 * GET /api/StudentPayments/student-id/{id}
 */
export const fetchStudentPaymentsByStudentId = createAsyncThunk<
    StudentPayment[],
    number,
    { dispatch: AppDispatch; state: RootState; rejectValue: ApiError }
>(
    "studentPayments/fetchByStudentId",
    async (studentId, { rejectWithValue }) => {
        try {
            // 🔥 response is already ApiResponse<T>
            const response = await api.get<ApiResponse<StudentPayment[]>>(
                `${API_ENDPOINTS.STUDENT_PAYMENTS.GET_BY_STUDENT_ID}/${studentId}`,
                { withCredentials: true }
            );

            if (!response.success || !Array.isArray(response.data)) {
                return rejectWithValue({
                    error: response.message || "No payment data found",
                    errors: null
                });
            }

            return response.data; // ✅ array

        } catch (error: any) {
            return rejectWithValue(parseApiError(error));
        }
    }
);


/**
 * Update Student Payment
 * POST /api/StudentPayments/updatePayment
 */

export const updateStudentPayment = createAsyncThunk<
    UpdateStudentPaymentRequest,     // ✅ return type
    UpdateStudentPaymentRequest,     // ✅ argument type
    { rejectValue: ApiError }
>(
    "studentPayments/updatePayment",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await api.post<ApiResponse<null>>(
                API_ENDPOINTS.STUDENT_PAYMENTS.UPDATE_PAYMENT,
                payload,
                { withCredentials: true }
            );

            if (!response.success) {
                return rejectWithValue({
                    error: response.message || "Payment update failed",
                    errors: null
                });
            }

            return payload; // ✅ typed payload
        } catch (error: any) {
            return rejectWithValue(parseApiError(error));
        }
    }
);
