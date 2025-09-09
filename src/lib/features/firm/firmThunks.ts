import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "@/lib/store";
import { Firm, CreateFirmDto, PaginatedFirms, ApiResponse } from './firmType';
import API_ENDPOINTS from "@/lib/config/apiConfig";
import api from "@/lib/services/apiService";

interface FetchFirmsParams {
    page?: number;
    searchTerm?: string;
    activeOnly?: boolean;
}



export const fetchFirms = createAsyncThunk<
    PaginatedFirms,  // Changed from ApiResponse<PaginatedFirms>
    FetchFirmsParams,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
    'firms/fetchFirms',
    async ({ page = 1, searchTerm = '', activeOnly = true }, { rejectWithValue }) => {
        try {
            const query = new URLSearchParams({
                page: page.toString(),
                search: searchTerm,
                activeOnly: activeOnly.toString(),
                _: Date.now().toString()
            }).toString();

            const response = await api.get<PaginatedFirms>(  // Changed from ApiResponse<PaginatedFirms>
                `${API_ENDPOINTS.FIRM.LIST}?${query}`,
                { withCredentials: true }
            );

            // Directly return the response data since it matches PaginatedFirms
            return response.data;

        } catch (error) {
            console.error('Fetch firms error:', error);
            if (error instanceof Error) {
                return rejectWithValue(
                    error.message.includes('401') ? 'SESSION_EXPIRED' : error.message
                );
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);


export const createFirm = createAsyncThunk<
    {
        success: boolean;
        message: string;
        error: string | null;
        errors: Record<string, string[]> | null;
        firm: Firm;
    },
    CreateFirmDto,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
    'firms/createFirm',
    async (createFirmDto, { rejectWithValue }) => {
        try {
            const response = await api.post<Firm>(
                API_ENDPOINTS.FIRM.CREATE,
                { firmId: 0, ...createFirmDto },
                {
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            if (!response?.data) {
                return rejectWithValue('No response data from server');
            }

            // Here we fake success & message since API doesn’t provide them
            return {
                success: true,
                message: 'Firm created successfully',
                error: null,
                errors: null,
                firm: response.data
            };

        } catch (error: any) {
            if (error.response) {
                return rejectWithValue(
                    error.response.data?.error ||
                    error.response.data?.message ||
                    'Server responded with an error'
                );
            }

            if (error.message) {
                return rejectWithValue(
                    error.message.includes('401') ? 'SESSION_EXPIRED' : error.message
                );
            }

            return rejectWithValue('An unknown error occurred');
        }
    }
);
