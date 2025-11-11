// src/lib/features/discountCode/useDiscountCodeViewModel.ts

'use client';
import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import {
  fetchDiscountCodes,
  fetchDiscountCodeById,
  createDiscountCode as createCodeAction,
  updateDiscountCode as updateCodeAction,
  deleteDiscountCode as deleteCodeAction
} from './discountCodeThunks';
import { DiscountCodeDto } from './discountCodeTypes';
import { clearCurrentCode, clearError, setSearchTerm, toggleActiveOnly, setPage } from './discountCodeSlice';

export const useDiscountCodeViewModel = () => {
  const dispatch = useAppDispatch();
  const {
    codes,
    loading,
    error,
    currentCode,
    totalCount,
    pageSize,
    currentPage,
    totalPages,
    searchTerm,
    activeOnly,
    page
  } = useAppSelector(state => state.discountCodes);

  // Fetch discount codes
  const fetchCodes = useCallback(() => {
    dispatch(fetchDiscountCodes());
  }, [dispatch]);

  // Fetch single discount code by ID
  const fetchCodeById = useCallback((id: number) => {
    dispatch(fetchDiscountCodeById(id));
  }, [dispatch]);

  // Create
  const createDiscountCode = useCallback(async (data: DiscountCodeDto) => {
    try {
      const result = await dispatch(createCodeAction(data)).unwrap();
      return result;
    } catch (error) {
      console.error('Failed to create discount code:', error);
      throw error;
    }
  }, [dispatch]);

  // Update
  const updateDiscountCode = useCallback(async ({ id, data }: { id: number; data: DiscountCodeDto }) => {
    try {
      const result = await dispatch(updateCodeAction({ id, data })).unwrap();
      return result;
    } catch (error) {
      console.error('Failed to update discount code:', error);
      throw error;
    }
  }, [dispatch]);

  // Delete
  const handleDelete = useCallback(async (id: number): Promise<boolean> => {
    try {
      const result = await dispatch(deleteCodeAction(id)).unwrap();
      return result.success;
    } catch (error) {
      console.error('Failed to delete discount code:', error);
      return false;
    }
  }, [dispatch]);

  // Clear current
  const clearCurrent = useCallback(() => {
    dispatch(clearCurrentCode());
  }, [dispatch]);

  // Clear error
  const clearErrorState = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Search
  const updateSearchTerm = useCallback((term: string) => {
    dispatch(setSearchTerm(term));
  }, [dispatch]);

  // Toggle active filter
  const toggleActive = useCallback(() => {
    dispatch(toggleActiveOnly());
  }, [dispatch]);

  // Pagination
  const changePage = useCallback((newPage: number) => {
    dispatch(setPage(newPage));
  }, [dispatch]);

  useEffect(() => {
    fetchCodes();
  }, [fetchCodes]);

  return {
    // State
    codes,
    isLoading: loading,
    error,
    currentCode,
    totalCount,
    pageSize,
    currentPage,
    totalPages,
    searchTerm,
    activeOnly,
    page,

    // Actions
    fetchCodes,
    fetchCodeById,
    createDiscountCode,
    updateDiscountCode,
    handleDelete,
    clearCurrent,
    clearError: clearErrorState,
    updateSearchTerm,
    toggleActive,
    changePage,
    refetch: fetchCodes
  };
};
