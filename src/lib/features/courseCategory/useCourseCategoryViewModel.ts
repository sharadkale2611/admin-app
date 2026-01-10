// src/lib/features/courseCategory/useCourseCategoryViewModel.ts

'use client'
import { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import {
    fetchCourseCategories,
    createCourseCategory as createCategoryAction,
    updateCourseCategory as updateCategoryAction,
    deleteCourseCategory as deleteCategoryAction
} from './courseCategoryThunks';
import { CourseCategoryDto } from './courseCategoryTypes';
import { clearCurrentCategory, clearError } from './courseCategorySlice';


export const useCourseCategoryViewModel = () => {
    const dispatch = useAppDispatch();
    const {
        categories,
        loading,
        error,
        currentCategory
    } = useAppSelector(state => state.courseCategories);

    const firmId = useAppSelector(state => state.auth.user?.firmId);

    // Fetch categories
    const fetchCategories = useCallback(() => {
        dispatch(fetchCourseCategories());
    }, [dispatch]);
    // Create category
    const createCourseCategory = useCallback(async (data: CourseCategoryDto) => {
        try {

            const payload = {
                ...data,
                firmId: firmId
            };

            const result = await dispatch(createCategoryAction(payload)).unwrap();
            return result;
        } catch (error) {
            console.error('Failed to create category:', error);
            throw error;
        }
    }, [dispatch, firmId]);

    // Update category
    const updateCourseCategory = useCallback(async ({ id, data }: { id: number; data: CourseCategoryDto }) => {
        try {

            const payload = {
                ...data,
                firmId: firmId
            };

            const result = await dispatch(updateCategoryAction({ id, data: payload })).unwrap();
            return result;
        } catch (error) {
            console.error('Failed to update category:', error);
            throw error;
        }
    }, [dispatch, firmId]);

    // Delete category
    const handleDelete = useCallback(async (categoryId: number, categoryName: string): Promise<boolean> => {
        try {
            const result = await dispatch(deleteCategoryAction(categoryId)).unwrap();
            return result.success;
        } catch (error) {
            console.error('Failed to delete category:', error);
            return false;
        }
    }, [dispatch]);

    // Clear current category
    const clearCurrent = useCallback(() => {
        dispatch(clearCurrentCategory());
    }, [dispatch]);

    // Clear error
    const clearErrorState = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return {
        // State
        categories,
        isLoading: loading,
        error,
        currentCategory,

        // Actions
        fetchCategories,
        createCourseCategory,
        updateCourseCategory,
        handleDelete,
        clearCurrent,
        clearError: clearErrorState,
        refetch: fetchCategories
    };
};