export interface SubscriptionPlan {
  planId: number;
  planCode: string;
  planName: string;
  price: number;
  billingCycle: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string | null;
}

export interface SubscriptionPlanState {
  subscriptionPlans: SubscriptionPlan[];
  currentSubscriptionPlan: SubscriptionPlan | null;
  loading: boolean;
  error: ApiError | null;
}

export interface CreateSubscriptionPlanDto {
  planCode: string;
  planName: string;
  price: number;
  billingCycle: string;
  isActive?: boolean;
}

export interface UpdateSubscriptionPlanDto {
  planId?: number;
  planCode: string;
  planName: string;
  price: number;
  billingCycle: string;
  isActive: boolean;
}

export interface ApiError {
  error: string | null;
  errors: Record<string, string[]> | null;
}
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string | null;
  errors?: any | null;
}