// src/lib/features/admission/admissionDraftThunks.ts

import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";
import api from "@/lib/services/apiService";
import API_ENDPOINTS from "@/lib/config/apiConfig";

import { ApiResponse, Admission } from "./admissionTypes";
import { mapDraftToCreateAdmissionDto } from "./admissionDraftMapper";
import { parseApiError, ApiError } from "./admissionThunks";

export const submitAdmissionFromDraft = createAsyncThunk<
    {
        success: boolean;
        message: string;
        admission: Admission;
    },
    void,
    { state: RootState; rejectValue: ApiError }
>(
    "admissionDraft/submit",
    async (_, { getState, rejectWithValue }) => {
        try {
            const draft = getState().admissionDraft;
            const dto = mapDraftToCreateAdmissionDto(draft);

            const response = await api.post<Admission>(
                API_ENDPOINTS.ADMISSION.POST_COMPLETE_CREATE,
                dto,
                { withCredentials: true }
            );

            // ✅ CORRECT CHECK
            if (!response.success || !response.data) {
                return rejectWithValue({
                    error: response.message || "Failed to create admission",
                    errors: response.errors ?? null,
                });
            }

            return {
                success: response.success,
                message: response.message ?? "Admission created successfully",
                admission: response.data,
            };
        } catch (error: any) {
            return rejectWithValue(parseApiError(error));
        }
    }
);
