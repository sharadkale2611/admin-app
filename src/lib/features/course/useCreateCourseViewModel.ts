'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { CourseLevel, CreateCourseDto } from './courseTypes';
import { fetchCourseCategories } from '../courseCategory/courseCategoryThunks';
import { createCourse } from './courseThunks';

interface FormData {
    courseName: string;
    courseDescription: string;
    courseCategoryId: number;
    courseLevel: CourseLevel;
    status: boolean;
    courseOrder: number;
}

const initialFormData: FormData = {
    courseName: '',
    courseDescription: '',
    courseCategoryId: 0,
    courseLevel: CourseLevel.Beginner,
    status: true,
    courseOrder: 1
};

export const useCreateCourseViewModel = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string>('');

    // Get course categories from Redux store
    const { categories, loading: categoriesLoading, error: categoriesError } = useAppSelector(
        (state) => state.courseCategories
    );

    // Fetch course categories on component mount
    useEffect(() => {
        dispatch(fetchCourseCategories(null)); // Pass null or firmId if needed
    }, [dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSelectChange = (e: any) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value === '' ? 0 : Number(value)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            
            // Validate required fields
            if (!formData.courseName.trim()) {
                throw new Error('Course name is required');
            }

            if (formData.courseCategoryId <= 0) {
                throw new Error('Please select a course category');
            }

            const createCourseDto: CreateCourseDto = {
                courseName: formData.courseName.trim(),
                courseDescription: formData.courseDescription.trim(),
                courseCategoryId: formData.courseCategoryId,
                courseLevel: formData.courseLevel,
                status: formData.status,
                courseOrder: formData.courseOrder
            };

            const result = await dispatch(createCourse(createCourseDto)).unwrap();

            if (result.success) {
                router.push('/courses');
                router.refresh();
            } else {
                setError(result.error || 'Failed to create course');
            }
        } catch (err: any) {
            console.log('qqqqqqqqqqqqqqqqqqqqqqqqqq: ',err);
            
            setError(err.message || 'An error occurred while creating the course');
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setError('');
    };

    return {
        formData,
        isSubmitting,
        error,
        categories,
        categoriesLoading,
        categoriesError,
        handleChange,
        handleSelectChange,
        handleNumberChange,
        handleSubmit,
        resetForm
    };
};

export default useCreateCourseViewModel;