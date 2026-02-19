export interface SaaSFeature {
  saaSFeatureId: number;
  featureKey: string;
  featureName: string;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string | null;
}

export interface SaaSFeatureState {
  saasFeatures: SaaSFeature[];
  currentSaaSFeature: SaaSFeature | null;
  loading: boolean;
  error: ApiError | null;
}

export interface CreateSaaSFeatureDto {
  featureKey: string;
  featureName: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateSaaSFeatureDto {
  saaSFeatureId?: number;
  featureKey: string;
  featureName: string;
  description?: string;
  isActive: boolean;
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
