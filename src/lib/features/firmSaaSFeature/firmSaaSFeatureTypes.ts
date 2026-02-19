export interface FirmSaaSFeature {
  firmSaaSFeatureId: number;

  firmId: number;
  saaSFeatureId: number;

  isEnabled: boolean;

  limitType?: string | null;
  limitValue?: number | null;
}

export interface FirmSaaSFeatureState {
  firmSaaSFeatures: FirmSaaSFeature[];
  currentFirmSaaSFeature: FirmSaaSFeature | null;
  loading: boolean;
  error: ApiError | null;
}

export interface CreateFirmSaaSFeatureDto {
  firmId: number;
  saaSFeatureId: number;
  isEnabled: boolean;
  limitType?: string | null;
  limitValue?: number | null;
}

export interface UpdateFirmSaaSFeatureDto {
  firmId: number;
  saaSFeatureId: number;
  isEnabled: boolean;
  limitType?: string | null;
  limitValue?: number | null;
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