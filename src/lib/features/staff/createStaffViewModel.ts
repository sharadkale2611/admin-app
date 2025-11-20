'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createStaff } from './staffThunks';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

export interface StaffFormData {
    userName: string;
    password: string;
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
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (e: { target: { name: string; value: string } }) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            if (!formData.userName || !formData.password || !formData.email ||
                !formData.firstName || !formData.lastName || !formData.position) {
                throw new Error('Please fill in all required fields');
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                throw new Error('Please enter a valid email address');
            }

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
                router.push('/staff');
            } else {
                throw new Error(result.error || 'Failed to create staff member');
            }

        } catch (err: any) {
            let errorMessage = "";

            if (typeof err === "string") {
                errorMessage = err;
            }
            else if (err instanceof Error) {
                errorMessage = err.message;
            }
            else if (err?.error) {
                errorMessage = err.error;
            }
            else if (err?.message) {
                errorMessage = err.message;
            }
            else if (err?.errors && typeof err.errors === "object") {
                const all = Object.values(err.errors).flat();
                errorMessage = all.join(", ");
            }
            else if (Array.isArray(err?.errors)) {
                errorMessage = err.errors.join(", ");
            }
            else {
                errorMessage = "An unknown error occurred";
            }

            setError(errorMessage);
            toast.error(errorMessage);
        }
        finally {
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
