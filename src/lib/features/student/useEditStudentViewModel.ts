'use client'

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { updateStudent, fetchStudentById } from './studentThunks';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import { toast } from 'react-toastify';
import { ApiError } from './studentTypes';



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
    const [error, setError] = useState<ApiError | null>(null);


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
        console.log('flag --- 1');
        
        try {
            console.log('flag --- 2');

            if (!id) {
                console.log('flag --- 3');

                throw new Error('Student ID is required');
            }

            // Validate form data
            if (!formData.userName || !formData.email || !formData.firstName || !formData.lastName) {
                console.log('flag --- 4');

                throw new Error('Please fill in all required fields');
            }

            // Validate email format
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                console.log('flag --- 5');
                throw new Error('Please enter a valid email address');
            }
            console.log('flag --- 6');

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
            
            console.log('flag --- 7');

            toast.success(result.message || 'Student updated successfully');
            router.push('/students'); // no need to check result.error
            console.log('flag --- 8');
                        
            if (result.success) {
                console.log('flag --- 9');

                toast.success('Student updated successfully');
                router.push('/students');
            } else {
                console.log('flag --- 10');

                throw new Error(result.error || 'Failed to update student');
            }
        } catch (err: unknown) {
            // console.log(err);
            // console.log('flag --- 11');

            // const errorMessage = err instanceof Error ? err.error :
            //     typeof err === 'string' ? err :
            //         'An unknown error occurred from edit view model';
            // setError({ error: errorMessage, errors: null });

            // toast.error(errorMessage);
            console.log(err);
            console.log('flag --- 11');

            let errorMessage = 'An unknown error occurred from edit view model';
            let errorDetails: Record<string, string[]> | null = null;

            if (typeof err === 'object' && err !== null) {
                // If it's Axios error with response
                if ('response' in err && (err as any).response?.data) {
                    const apiError = (err as any).response.data;
                    errorMessage = apiError.error || apiError.message || errorMessage;
                    errorDetails = apiError.errors || null;
                }
                // If it's plain object already shaped like API response
                else if ('error' in (err as any)) {
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
            console.log('flag --- 12');

            setIsSubmitting(false);
        }
    };

    return {
        formData,
        isSubmitting,
        error: error || fetchError,
        errors: error || fetchError,
        loading,
        handleChange,
        handleSelectChange,
        handleCheckboxChange,
        handleSubmit
    };
}