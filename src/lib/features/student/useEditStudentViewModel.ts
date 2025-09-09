'use client'

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { updateStudent, fetchStudentById } from './studentThunks';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import { toast } from 'react-toastify';

export interface StudentFormData {
    userName: string;
    email: string;
    mobileNumber: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    isActive: boolean;
}

export default function useEditStudentViewModel() {
    const router = useRouter();
    const { id } = useParams();
    const dispatch: AppDispatch = useDispatch();

    const { currentStudent, loading, error: fetchError } = useSelector((state: RootState) => state.students);

    const [formData, setFormData] = useState<StudentFormData>({
        userName: '',
        email: '',
        mobileNumber: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        isActive: true
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load student data when component mounts
    useEffect(() => {
        if (id) {
            dispatch(fetchStudentById(id as string));
        }
    }, [dispatch, id]);

    // Populate form when student data is loaded
    useEffect(() => {
        if (currentStudent) {
            setFormData({
                userName: currentStudent.userName || '',
                email: currentStudent.email || '',
                mobileNumber: currentStudent.mobileNumber || '',
                firstName: currentStudent.firstName || '',
                lastName: currentStudent.lastName || '',
                dateOfBirth: currentStudent.dateOfBirth ? currentStudent.dateOfBirth.split('T')[0] : '',
                gender: currentStudent.gender || '',
                isActive: currentStudent.isActive
            });
        }
    }, [currentStudent]);

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

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            if (!id) {
                throw new Error('Student ID is required');
            }

            // Validate form data
            if (!formData.userName || !formData.email || !formData.firstName || !formData.lastName) {
                throw new Error('Please fill in all required fields');
            }

            // Validate email format
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                throw new Error('Please enter a valid email address');
            }

            // Update the student using Redux action
            const result = await dispatch(updateStudent({
                id: id as string,
                userName: formData.userName,
                email: formData.email,
                mobileNumber: formData.mobileNumber,
                firstName: formData.firstName,
                lastName: formData.lastName,
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
                isActive: formData.isActive
            })).unwrap();

            if (result.success) {
                toast.success('Student updated successfully');
                router.push('/students');
            } else {
                throw new Error(result.error || 'Failed to update student');
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
        error: error || fetchError,
        loading,
        handleChange,
        handleSelectChange,
        handleCheckboxChange,
        handleSubmit
    };
}