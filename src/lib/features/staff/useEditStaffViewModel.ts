// lib/features/staff/useEditStaffViewModel.ts
'use client'

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { updateStaff, fetchStaffById } from './staffThunks';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import { toast } from 'react-toastify';

export interface StaffFormData {
    userName: string;
    email: string;
    mobileNumber: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    position: string;
    department: string;
    hireDate: string;
    salary: string;
    isActive: boolean;
}

export default function useEditStaffViewModel() {
    const router = useRouter();
    const { id } = useParams();
    const dispatch: AppDispatch = useDispatch();

    const { currentStaff, loading, error: fetchError } = useSelector((state: RootState) => state.staff);

    const [formData, setFormData] = useState<StaffFormData>({
        userName: '',
        email: '',
        mobileNumber: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        position: '',
        department: '',
        hireDate: '',
        salary: '',
        isActive: true
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load staff data when component mounts
    useEffect(() => {
        if (id) {
            dispatch(fetchStaffById(id as string));
        }
    }, [dispatch, id]);

    // Populate form when staff data is loaded
    useEffect(() => {
        if (currentStaff) {
            setFormData({
                userName: currentStaff.userName || '',
                email: currentStaff.email || '',
                mobileNumber: currentStaff.mobileNumber || '',
                firstName: currentStaff.firstName || '',
                lastName: currentStaff.lastName || '',
                dateOfBirth: currentStaff.dateOfBirth ? currentStaff.dateOfBirth.split('T')[0] : '',
                gender: currentStaff.gender || '',
                position: currentStaff.position || '',
                department: currentStaff.department || '',
                hireDate: currentStaff.hireDate ? currentStaff.hireDate.split('T')[0] : '',
                salary: currentStaff.salary?.toString() || '',
                isActive: currentStaff.isActive
            });
        }
    }, [currentStaff]);

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
                throw new Error('Staff ID is required');
            }

            // Validate form data
            if (!formData.userName || !formData.email ||
                !formData.firstName || !formData.lastName || !formData.position) {
                throw new Error('Please fill in all required fields');
            }

            // Validate email format
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                throw new Error('Please enter a valid email address');
            }

            // Update the staff member using Redux action
            const result = await dispatch(updateStaff({
                id: id as string,
                userName: formData.userName,
                email: formData.email,
                mobileNumber: formData.mobileNumber,
                firstName: formData.firstName,
                lastName: formData.lastName,
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
                position: formData.position,
                department: formData.department,
                hireDate: formData.hireDate,
                salary: Number(formData.salary) || 0,
                isActive: formData.isActive
            })).unwrap();

            if (result.success) {
                toast.success('Staff member updated successfully');
                router.push('/staff');
            } else {
                throw new Error(result.error || 'Failed to update staff member');
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