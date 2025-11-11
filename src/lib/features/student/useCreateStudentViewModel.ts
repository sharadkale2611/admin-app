'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createStudent } from './studentThunks';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { AppDispatch } from '@/lib/store';
import { ApiError } from './studentTypes';

export interface StudentFormData {
    // User fields
    userName: string;
    password: string;
    email: string;
    mobileNumber: string;

    // Student fields
    studentCode: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
}

export default function useCreateStudentViewModel() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const [formData, setFormData] = useState<StudentFormData>({
        userName: '',
        password: '',
        email: '',
        mobileNumber: '',
        studentCode: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (e: { target: { name: string; value: string } }) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // Basic validation
            if (!formData.userName || !formData.password || !formData.email ||
                !formData.studentCode || !formData.firstName || !formData.lastName) {
                throw new Error('Please fill in all required fields');
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                throw new Error('Please enter a valid email address');
            }

            // Call createStudent thunk
            const result = await dispatch(createStudent(formData)).unwrap();

            if (result.success) {
                toast.success(result.message || 'Student created successfully');

                // Reset form
                setFormData({
                    userName: '',
                    password: '',
                    email: '',
                    mobileNumber: '',
                    studentCode: '',
                    firstName: '',
                    lastName: '',
                    dateOfBirth: '',
                    gender: ''
                });

                router.push('/students');
            } else {
                throw new Error(result.error || 'Failed to create student');
            }
        } catch (err: unknown) {
            let errorMessage = 'An unknown error occurred';
            let errorDetails: Record<string, string[]> | null = null;

            if (typeof err === 'object' && err !== null) {
                // Axios / API error
                if ('response' in err && (err as any).response?.data) {
                    const apiError = (err as any).response.data;
                    errorMessage = apiError.error || apiError.message || errorMessage;
                    errorDetails = apiError.errors || null;
                } else if ('error' in (err as any)) {
                    errorMessage = (err as any).error || errorMessage;
                    errorDetails = (err as any).errors || null;
                }
            } else if (typeof err === 'string') {
                errorMessage = err;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }

            setError({ error: errorMessage, errors: errorDetails });
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        isSubmitting,
        error,
        handleChange,
        handleSelectChange,
        handleSubmit
    };
}
