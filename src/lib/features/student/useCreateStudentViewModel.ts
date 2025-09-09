'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createStudent } from './studentThunks';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

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
    const dispatch = useDispatch();
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
    const [error, setError] = useState<string | null>(null);

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
            // Validate form data
            if (!formData.userName || !formData.password || !formData.email ||
                !formData.studentCode || !formData.firstName || !formData.lastName) {
                throw new Error('Please fill in all required fields');
            }

            // Validate email format
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                throw new Error('Please enter a valid email address');
            }

            // Create the student using Redux action
            const result = await dispatch<any>(createStudent({
                userName: formData.userName,
                password: formData.password,
                email: formData.email,
                mobileNumber: formData.mobileNumber,
                studentCode: formData.studentCode,
                firstName: formData.firstName,
                lastName: formData.lastName,
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender
            })).unwrap();

            if (result.success) {
                toast.success('Student created successfully');

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

                // Redirect to students list
                router.push('/students');
            } else {
                throw new Error(result.error || 'Failed to create student');
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message :
                typeof err === 'string' ? err :
                    'An unknown error occurred';
            setError(errorMessage);
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