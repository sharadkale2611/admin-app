export interface PlanSaaSFeature {
  planSaaSFeatureId: number;
  planId: number;
  planName?: string;      
  saaSFeatureId: number;
  featureName?: string;    
  featureKey?: string;     
  isEnabled: boolean;
  limitType?: string | null;
  limitValue?: number | null;
}

export interface PlanSaaSFeatureState {
  planSaaSFeatures: PlanSaaSFeature[];
  currentPlanSaaSFeature: PlanSaaSFeature | null;
  loading: boolean;
  error: ApiError | null;
}

export interface CreatePlanSaaSFeatureDto {
  planId: number;
  saaSFeatureId: number;
  isEnabled?: boolean;
  limitType?: string | null;
  limitValue?: number | null;
}

export interface UpdatePlanSaaSFeatureDto {
  planSaaSFeatureId?: number;
  planId: number;
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
