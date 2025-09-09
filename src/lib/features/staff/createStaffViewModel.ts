'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createStaff } from './staffThunks';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify'; // Import toast for notifications

export interface StaffFormData {
    // User fields
    userName: string;
    password: string;
    email: string;
    mobileNumber: string;

    // Staff fields
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    position: string;
    department: string;
    hireDate: string;
    salary: string;
}

export default function useCreateStaffViewModel() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState<StaffFormData>({
        userName: '',
        password: '',
        email: '',
        mobileNumber: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        position: '',
        department: '',
        hireDate: new Date().toISOString().split('T')[0],
        salary: ''
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
                !formData.firstName || !formData.lastName || !formData.position) {
                throw new Error('Please fill in all required fields');
            }

            // Validate email format
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                throw new Error('Please enter a valid email address');
            }

            // Create the staff member using Redux action
            const result = await dispatch<any>(createStaff({
                userName: formData.userName,
                password: formData.password,
                email: formData.email,
                mobileNumber: formData.mobileNumber,
                firstName: formData.firstName,
                lastName: formData.lastName,
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
                position: formData.position,
                department: formData.department,
                hireDate: formData.hireDate,
                salary: Number(formData.salary) || 0
            })).unwrap();

            if (result.success) {
                toast.success('Staff member created successfully');

                // Reset form
                setFormData({
                    userName: '',
                    password: '',
                    email: '',
                    mobileNumber: '',
                    firstName: '',
                    lastName: '',
                    dateOfBirth: '',
                    gender: '',
                    position: '',
                    department: '',
                    hireDate: new Date().toISOString().split('T')[0],
                    salary: ''
                });

                // Redirect to staff list
                router.push('/staff');
            } else {
                throw new Error(result.error || 'Failed to create staff member');
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