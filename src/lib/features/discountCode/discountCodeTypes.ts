// src/lib/features/discountCode/discountCodeTypes.ts

export interface DiscountCode {
  discountCodeId: number;
  code: string;
  description?: string | null;
  discountType: "Percentage" | "FixedAmount";
  discountValue: number;
  isActive: boolean;
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  isDeleted?: boolean;
}

export interface DiscountCodeDto {
  code: string;
  description?: string | null;
  discountType: "Percentage" | "FixedAmount";
  discountValue: number;
  isActive: boolean;
  startDate?: string | null;
  endDate?: string | null;
}

export interface DiscountCodeResponseDto extends DiscountCodeDto {
  discountCodeId: number;
  createdAt: string;
  updatedAt?: string | null;
}

export interface PaginatedDiscountCodes {
  items: DiscountCodeResponseDto[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}

export interface DiscountCodeState {
  codes: DiscountCodeResponseDto[];
  currentCode: DiscountCodeResponseDto | null;
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  searchTerm: string;
  activeOnly: boolean;
  page: number;
}

export interface FetchDiscountCodesParams {
  page?: number;
  searchTerm?: string;
  activeOnly?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string | null;
  errors?: Record<string, string[]> | null;
}
