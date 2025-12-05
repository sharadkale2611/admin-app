// src/features/batchSchedules/batchScheduleThunks.ts

import { createAsyncThunk } from "@reduxjs/toolkit";
import API_ENDPOINTS from "@/lib/config/apiConfig";
import { api } from "@/lib/services/apiService";

import type {
  BatchScheduleDbModel,
  CreateBatchScheduleModel,
  CreateBatchSchedulesBulkModel,
} from "./batchScheduleTypes";

// ---------------------------------------------------
// FETCH SCHEDULES BY BATCH
// ---------------------------------------------------
export const fetchBatchSchedules = createAsyncThunk<
  BatchScheduleDbModel[],
  number,
  { rejectValue: string }
>(
  "batchSchedules/fetchByBatch",
  async (batchId, { rejectWithValue }) => {
    try {
      const endpoint = `${API_ENDPOINTS.BATCH_SCHEDULES.GET_BY_BATCH}/${batchId}`;

      const response = await api.get<BatchScheduleDbModel[]>(endpoint);

      if (!response.success) {
        return rejectWithValue(
          response.error || response.message || "Failed to load schedules"
        );
      }

      return response.data || [];
    } catch (error: any) {
      return rejectWithValue(error.message || "Server error");
    }
  }
);

// ---------------------------------------------------
// BULK CREATE
// ---------------------------------------------------
export const createBulkSchedules = createAsyncThunk<
  BatchScheduleDbModel[],
  CreateBatchSchedulesBulkModel,
  { rejectValue: string }
>(
  "batchSchedules/createBulk",
  async (payload, { rejectWithValue }) => {
    try {
      const endpoint = API_ENDPOINTS.BATCH_SCHEDULES.POST_CREATE_BULK;

      const response = await api.post<BatchScheduleDbModel[]>(
        endpoint,
        payload
      );

      if (!response.success) {
        return rejectWithValue(
          response.error || response.message || "Bulk schedule creation failed"
        );
      }

      return response.data || [];
    } catch (error: any) {
      return rejectWithValue(error.message || "Server error");
    }
  }
);

// ---------------------------------------------------
// SINGLE CREATE (RE-SCHEDULE)
// ---------------------------------------------------
export const createSingleSchedule = createAsyncThunk<
  BatchScheduleDbModel,
  { batchId: number; item: CreateBatchScheduleModel },
  { rejectValue: string }
>(
  "batchSchedules/createSingle",
  async ({ batchId, item }, { rejectWithValue }) => {
    try {
      const endpoint = `${API_ENDPOINTS.BATCH_SCHEDULES.POST_CREATE_SINGLE}?batchId=${batchId}`;

      const response = await api.post<BatchScheduleDbModel>(endpoint, item);

      if (!response.success) {
        return rejectWithValue(
          response.error || response.message || "Re-schedule creation failed"
        );
      }

      return response.data!;
    } catch (error: any) {
      return rejectWithValue(error.message || "Server error");
    }
  }
);
