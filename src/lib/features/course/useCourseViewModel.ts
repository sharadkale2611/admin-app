import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect, useCallback } from "react";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { CourseLevel } from "./courseTypes";
import { fetchCourses } from "./courseThunks";
import { resetFilters, setCategoryFilter, setCourseLevelFilter, setPage, setSearchTerm, setStatusFilter } from "./courseSlice";

export const useCourseViewModel = () => {
    const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useAppDispatch();

    const authUser = useAppSelector((state: RootState) => state.auth.user);

    const {
        courses,
        loading,
        error,
        page,
        totalPages,
        searchTerm,
        statusFilter,
        courseLevelFilter,
        categoryFilter
    } = useAppSelector((state: RootState) => state.courses);

    const safeCourses = courses || [];

    const firmId = authUser?.firmId ? Number(authUser.firmId) : null;

    // Memoized fetch function
    const fetchCourseData = useCallback(() => {
        dispatch(fetchCourses({
            page,
            searchTerm,
            status: statusFilter,
            courseLevel: courseLevelFilter,
            categoryId: categoryFilter,
            firmId,
        }));
    }, [dispatch, page, searchTerm, statusFilter, courseLevelFilter, categoryFilter, firmId]);

    // Fetch courses when filters change with debounce for search
    useEffect(() => {
        if (firmId === null) return; 

        const timer = setTimeout(() => {
            fetchCourseData();
        }, searchTerm ? 300 : 0);

        return () => clearTimeout(timer);
    }, [fetchCourseData, searchTerm, firmId]);

    // Action Handlers
    const handleSearch = useCallback((term: string) => {
        dispatch(setSearchTerm(term));
    }, [dispatch]);

    const handleStatusFilter = useCallback((status: boolean | null) => {
        dispatch(setStatusFilter(status));
    }, [dispatch]);

    const handleCourseLevelFilter = useCallback((level: CourseLevel | string | null) => {
        // Convert empty string to null, otherwise ensure it's a valid CourseLevel
        const filteredLevel = level === '' || level === null ? null : level as CourseLevel;
        dispatch(setCourseLevelFilter(filteredLevel));
    }, [dispatch]);

    const handleCategoryFilter = useCallback((categoryId: number | null) => {
        dispatch(setCategoryFilter(categoryId));
    }, [dispatch]);

    const handleResetFilters = useCallback(() => {
        dispatch(resetFilters());
    }, [dispatch]);

    const handlePageChange = useCallback((newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            dispatch(setPage(newPage));
        }
    }, [dispatch, totalPages]);

    return {
        // State
        courses: safeCourses,
        isLoading: loading,
        error,
        page,
        totalPages: totalPages || 1,
        searchTerm,
        statusFilter,
        courseLevelFilter,
        categoryFilter,
        firmId,

        // Actions
        handleSearch,
        handleStatusFilter,
        handleCourseLevelFilter,
        handleCategoryFilter,
        handleResetFilters,
        handlePageChange,
        refetch: fetchCourseData
    };
};