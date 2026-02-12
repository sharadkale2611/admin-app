import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "@/lib/store";
import { Firm, CreateFirmDto, UpdateFirmDto, PaginatedFirms, ApiResponse } from './firmType';
import API_ENDPOINTS from "@/lib/config/apiConfig";
import api from "@/lib/services/apiService";
import flattenErrors from "@/lib/utils/errorUtil";

/**
 * Error type for consistent API error handling
 */
export interface ApiError {
    error: string | null;       // single error message
    errors: string[] | null;    // detailed field errors
}

/**
 * Parse API errors into consistent shape
 */
function parseApiError(error: any): ApiError {
    console.log('parseApiError from firm thunk', error);

    if (error?.response?.data) {
        const data = error.response.data;

        if (data.errors && typeof data.errors === "object") {
            const flattened = Object.entries(data.errors).flatMap(
                ([field, msgs]) => (msgs as string[]).map(msg => `${field}: ${msg}`)
            );
            return { error: null, errors: flattened };
        }

        if (data.error) {
            return { error: data.error, errors: null };
        }
    }

    if (error?.errors) {
        return { error: error.message, errors: error.errors };
    }

    return { error: "An unknown error occurred", errors: null };
}

/**
 * Fetch Firms (paginated)
 */
interface FetchFirmsParams {
    page?: number;
    searchTerm?: string;
    activeOnly?: boolean;
}

export const fetchFirms = createAsyncThunk<
    PaginatedFirms,
    FetchFirmsParams,
    { dispatch: AppDispatch; state: RootState; rejectValue: ApiError }
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

            console.log(`${API_ENDPOINTS.FIRM.GET_LIST_PAGINATED}?${query}`);
            
            const response = await api.get<PaginatedFirms>(
                `${API_ENDPOINTS.FIRM.GET_LIST_PAGINATED}?${query}`,
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
 * Create Firm
 */

export const createFirm = createAsyncThunk<
    {
        success: boolean;
        message: string;
        error: string | null;
        errors: string[] | null;
        firm: Firm | null;
    },
    CreateFirmDto,
    { rejectValue: ApiError }
>(
    'firms/createFirm',
    async (createFirmDto, { rejectWithValue }) => {
        try {
            const response = await api.post<Firm>(
                API_ENDPOINTS.FIRM.POST_CREATE,
                { firmId: 0, ...createFirmDto },
                { withCredentials: true }
            );

            console.log("Create Firm Response:", response);

            if (!response.success) {
                return rejectWithValue({
                    error: response.error || response.message || "Creation failed",
                    errors: flattenErrors(response.errors)
                });
            }

            return {
                success: true,
                message: response.message ?? "Firm created successfully", // ✅ fix #1
                error: null,
                errors: null,
                firm: response.data ?? null                                // ✅ fix #2
            };
        } catch (err: any) {
            const parsed = parseApiError(err);
            return rejectWithValue({
                error: parsed.error ?? "Creation failed",
                errors: parsed.errors ?? null
            });
        }
    }
);



/**
 * Update Firm
 */
export const updateFirm = createAsyncThunk<
    { success: boolean; message: string; error: string | null; errors: string[] | null; firm: Firm },
    UpdateFirmDto,
    { dispatch: AppDispatch; state: RootState; rejectValue: ApiError }
>(
    'firms/updateFirm',
    async (updateFirmDto, { rejectWithValue, getState }) => {
        try {
            const response = await api.put<ApiResponse<Firm>>(
                `${API_ENDPOINTS.FIRM.PUT_UPDATE}/${updateFirmDto.firmId}`,
                updateFirmDto,
                { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
            );

            if (response.status !== 200) {
                return rejectWithValue({
                    error: response.data?.error || response.data?.message || 'Update failed',
                    errors: null
                });
            }

            // Try fetching updated firm
            try {
                const firmResponse = await api.get<ApiResponse<Firm>>(
                    `${API_ENDPOINTS.FIRM.GET_BY_ID}/${updateFirmDto.firmId}`,
                    { withCredentials: true }
                );

                if (firmResponse.data?.data) {
                    return {
                        success: true,
                        message: response.data?.message || 'Firm updated successfully',
                        error: null,
                        errors: null,
                        firm: firmResponse.data.data
                    };
                }
            } catch (fetchError) {
                console.warn("Could not fetch updated firm:", fetchError);
            }

            // fallback: merge state
            const state = getState() as RootState;
            const existingFirm =
                // state.firms.currentFirm ||
                state.firms.firms.find(f => f.firmId === updateFirmDto.firmId);

            if (!existingFirm) {
                return rejectWithValue({ error: 'Could not find firm to update', errors: null });
            }

            return {
                success: true,
                message: response.data?.message || 'Firm updated successfully',
                error: null,
                errors: null,
                firm: { ...existingFirm, ...updateFirmDto, updatedAt: new Date().toISOString() }
            };
        } catch (error: any) {
            const parsed = parseApiError(error);
            return rejectWithValue({
                error: parsed.error ?? 'Update failed',
                errors: parsed.errors ?? null
            });
        }
    }
);

/**
 * Delete Firm
 */
export const deleteFirm = createAsyncThunk<
    { success: boolean; message: string; id: string },
    string,
    { dispatch: AppDispatch; state: RootState; rejectValue: ApiError }
>(
    'firms/deleteFirm',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`${API_ENDPOINTS.FIRM.DELETE}/${id}`, { withCredentials: true });

            return { success: true, message: 'Firm deleted successfully', id };
        } catch (error: any) {
            return rejectWithValue(parseApiError(error));
        }
    }
);

/**
 * Fetch Firm By Id
 */
export const fetchFirmById = createAsyncThunk<
    Firm,
    string,
    { rejectValue: ApiError }
>(
    "firms/fetchFirmById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get<Firm>(
                `${API_ENDPOINTS.FIRM.GET_BY_ID}/${id}`
            );

            // Your API returns the firm directly, so response.data IS the firm
            const firm = response.data;

            if (!firm || !firm.firmId) {
                return rejectWithValue({ error: "Firm not found", errors: null });
            }

            return firm;

        } catch (error: any) {
            return rejectWithValue(parseApiError(error));
        }
    }
);

/**
 * Upload / Change Firm Logo
 */


/**
 * Upload / Change Firm Logo
 */
export const uploadFirmLogo = createAsyncThunk<
  string,
  { firmId: number; file: File },
  { rejectValue: ApiError }
>(
  'firms/uploadFirmLogo',
  async ({ firmId, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("File", file); // must match DTO

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Firms/${firmId}/upload-logo`,
        {
          method: "PUT",
          body: formData,
          credentials: "include", // ✅ important
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Logo upload failed");
      }

      const json = await res.json();

      return json.data.firmLogoImagePath as string;
    } catch (error: any) {
      return rejectWithValue({
        error: error.message || "Logo upload failed",
        errors: null,
      });
    }
  }
);
