export interface FirmSaaSFeatureUsage {
  firmId: number;
  saaSFeatureId: number;
  usedCount: number;
  lastUpdated: string; // ISO date string
}

export interface FirmSaaSFeatureUsageState {
  items: FirmSaaSFeatureUsage[];
  current: FirmSaaSFeatureUsage | null;
  loading: boolean;
  error: ApiError | null;
}

export interface CreateFirmSaaSFeatureUsageDto {
  firmId: number;
  saaSFeatureId: number;
  usedCount?: number;
}

export interface UpdateFirmSaaSFeatureUsageDto {
  usedCount: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string | null;
  errors?: any | null;
}

export interface ApiError {
  error: string | null;
  errors: Record<string, string[]> | null;
}