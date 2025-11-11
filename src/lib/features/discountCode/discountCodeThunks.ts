// src/lib/features/discountCode/discountCodeThunks.ts

import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "@/lib/store";
import {
  DiscountCodeDto,
  DiscountCodeResponseDto,
  ApiResponse
} from "./discountCodeTypes";
import API_ENDPOINTS from "@/lib/config/apiConfig";
import api from "@/lib/services/apiService";

interface TypedApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string | null;
  errors?: Record<string, string[]> | null;
}

const handleApiResponse = <T>(response: any): T | null => {
  if (response && typeof response === "object" && "success" in response) {
    if (response.success) {
      return (response.data ?? {}) as T;
    }
    return null;
  }
  return response as T;
};

export const fetchDiscountCodes = createAsyncThunk<
  DiscountCodeResponseDto[],
  void,
  { dispatch: AppDispatch; state: RootState; rejectValue: string }
>("discountCodes/fetchDiscountCodes", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<TypedApiResponse<DiscountCodeResponseDto[]>>(
      API_ENDPOINTS.DISCOUNT_CODES.GET_LIST,
      { withCredentials: true }
    );

    const codes = handleApiResponse<DiscountCodeResponseDto[]>(response);
    if (!codes) return rejectWithValue("No discount codes found");

    return codes;
  } catch (error: any) {
    if (error.status === 401) return rejectWithValue("SESSION_EXPIRED");
    return rejectWithValue(error.message || "An unknown error occurred");
  }
});

export const fetchDiscountCodeById = createAsyncThunk<
  DiscountCodeResponseDto,
  number,
  { dispatch: AppDispatch; state: RootState; rejectValue: string }
>("discountCodes/fetchDiscountCodeById", async (id, { rejectWithValue }) => {
  try {
    const response = await api.get<TypedApiResponse<DiscountCodeResponseDto>>(
      `${ API_ENDPOINTS.DISCOUNT_CODES.GET_BY_ID }/${id}`,
{ withCredentials: true }
    );

const code = handleApiResponse<DiscountCodeResponseDto>(response);
if (!code) return rejectWithValue("Discount code not found");

return code;
  } catch (error: any) {
    if (error.status === 401) return rejectWithValue("SESSION_EXPIRED");
    return rejectWithValue(error.message || "An unknown error occurred");
}
});

export const createDiscountCode = createAsyncThunk<
    { success: boolean; message: string; code: DiscountCodeResponseDto },
    DiscountCodeDto,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>("discountCodes/createDiscountCode", async (dto, { rejectWithValue }) => {
    try {
        const response = await api.post<TypedApiResponse<DiscountCodeResponseDto>>(
            API_ENDPOINTS.DISCOUNT_CODES.POST_CREATE,
            dto,
            { withCredentials: true, headers: { "Content-Type": "application/json" } }
        );

        const created = handleApiResponse<DiscountCodeResponseDto>(response);
        if (!created) return rejectWithValue("Failed to create discount code");

        return { success: true, message: "Created successfully", code: created };
    } catch (error: any) {
        if (error.status === 401) return rejectWithValue("SESSION_EXPIRED");
        return rejectWithValue(error.message || "An unknown error occurred");
    }
});

export const updateDiscountCode = createAsyncThunk<
    { success: boolean; message: string; code: DiscountCodeResponseDto },
    { id: number; data: DiscountCodeDto },
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>("discountCodes/updateDiscountCode", async ({ id, data }, { rejectWithValue }) => {
    try {
        const response = await api.put<TypedApiResponse<DiscountCodeResponseDto>>(
            `${API_ENDPOINTS.DISCOUNT_CODES.PUT_UPDATE}/${id}`,
            data,
            { withCredentials: true, headers: { "Content-Type": "application/json" } }
        );

        const updated = handleApiResponse<DiscountCodeResponseDto>(response);
        if (!updated) return rejectWithValue("Failed to update discount code");

        return { success: true, message: "Updated successfully", code: updated };
    } catch (error: any) {
        if (error.status === 401) return rejectWithValue("SESSION_EXPIRED");
        return rejectWithValue(error.message || "An unknown error occurred");
    }
});

export const deleteDiscountCode = createAsyncThunk<
    { success: boolean; message: string; id: number },
    number,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>("discountCodes/deleteDiscountCode", async (id, { rejectWithValue }) => {
    try {
        const response = await api.delete<TypedApiResponse<any>>(
            `${API_ENDPOINTS.DISCOUNT_CODES.DELETE}/${id}`,
            { withCredentials: true }
        );

        if (!response.success) {
            return rejectWithValue(response.message || "Failed to delete");
        }

        return { success: true, message: response.message || "Deleted", id };
    } catch (error: any) {
        if (error.status === 401) return rejectWithValue("SESSION_EXPIRED");
        return rejectWithValue(error.message || "An unknown error occurred");
    }
});

