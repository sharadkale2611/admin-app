// lib/features/course/useCourseEditViewModel.ts
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect, useState } from "react";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { CourseLevel, UpdateCourseDto } from "./courseTypes";
import { fetchCourseById, updateCourse } from "./courseThunks";

export const useCourseEditViewModel = (courseId: string) => {
    const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useAppDispatch();

    const {
        currentCourse,
        loading,
        error
    } = useAppSelector((state: RootState) => state.courses);

    const [formData, setFormData] = useState<UpdateCourseDto>({
        id: parseInt(courseId),
        courseCategoryId: 0,
        courseName: '',
        courseDescription: '',
        courseLevel: CourseLevel.Beginner,
        status: false,
        courseOrder: 1
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Initialize form data when course is loaded
    useEffect(() => {
        if (currentCourse) {
            setFormData({
                id: currentCourse.courseId,
                courseCategoryId: currentCourse.courseCategoryId,
                courseName: currentCourse.courseName,
                courseDescription: currentCourse.courseDescription || '',
                courseLevel: currentCourse.courseLevel,
                status: currentCourse.status,
                courseOrder: currentCourse.courseOrder,
                firmId: currentCourse.firmId
            });
        }
    }, [currentCourse]);

    useEffect(() => {
        if (courseId) {
            dispatch(fetchCourseById(parseInt(courseId)));
        }
    }, [dispatch, courseId]);

    const handleInputChange = (field: keyof UpdateCourseDto, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // Clear errors when user starts typing
        if (submitError) {
            setSubmitError(null);
        }
    };

    const handleSubmit = async (): Promise<boolean> => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const result = await dispatch(updateCourse(formData)).unwrap();

            if (result.success) {
                setSubmitSuccess(true);

                setTimeout(() => setSubmitSuccess(false), 3000);

                return true; // 👈 KEY FIX
            } else {
                setSubmitError(result.error || "Failed to update course");
                return false;
            }
        } catch (err: any) {
            setSubmitError(
                err.message || "An error occurred while updating the course"
            );
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    // Helper to check if form is valid
    const isFormValid = () => {
        return formData.courseName.trim() !== '' &&
            formData.courseCategoryId > 0 &&
            formData.courseOrder > 0;
    };

    return {
        course: currentCourse,
        formData,
        isLoading: loading,
        error,
        isSubmitting,
        submitError,
        submitSuccess,
        isFormValid,
        handleInputChange,
        handleSubmit
    };
};