'use client';

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

type StaffFormErrors = Partial<Record<keyof StaffFormData, string>>;

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
        position: 'Teacher',
        department: '',
        hireDate: new Date().toISOString().split('T')[0],
        salary: ''
    });

    const [errors, setErrors] = useState<StaffFormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: undefined }));
    };

    const handleSelectChange = (e: { target: { name: string; value: string } }) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: undefined }));
    };

    const validate = (): StaffFormErrors => {
        const e: StaffFormErrors = {};

        if (!formData.email)
            e.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            e.email = 'Invalid email format';

        if (!formData.mobileNumber)
            e.mobileNumber = 'Mobile number is required';
        else if (!/^[6-9]\d{9}$/.test(formData.mobileNumber))
            e.mobileNumber = 'Enter valid 10-digit Indian mobile number';

        if (!formData.firstName)
            e.firstName = 'First name is required';
        else if (formData.firstName.length < 2)
            e.firstName = 'Minimum 2 characters';

        if (!formData.lastName)
            e.lastName = 'Last name is required';

        // DATE OF BIRTH – REQUIRED + AGE CHECK
        if (!formData.dateOfBirth)
            e.dateOfBirth = 'Date of birth is required';
        else {
            const dob = new Date(formData.dateOfBirth);
            const age = new Date().getFullYear() - dob.getFullYear();
            if (age < 18) e.dateOfBirth = 'Staff must be at least 18 years old';
        }

        if (!formData.gender)
            e.gender = 'Gender is required';

        if (!formData.position)
            e.position = 'Position is required';

        // DEPARTMENT – REQUIRED
        if (!formData.department)
            e.department = 'Department is required';

        if (!formData.hireDate)
            e.hireDate = 'Hire date is required';
        else if (new Date(formData.hireDate) > new Date())
            e.hireDate = 'Hire date cannot be in future';

        // SALARY – REQUIRED
        if (!formData.salary)
            e.salary = 'Salary is required';
        else if (Number(formData.salary) < 0)
            e.salary = 'Salary cannot be negative';

        return e;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error('Please fix form errors');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const result = await dispatch<any>(
                createStaff({
                    ...formData,
                    salary: Number(formData.salary)
                })
            ).unwrap();

            toast.success(result.message || 'Staff created successfully');
            router.push('/staff');

        } catch (err: any) {
            const msg = err?.message || 'Server error';
            setError(msg);
            toast.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        errors,
        isSubmitting,
        error,
        handleChange,
        handleSelectChange,
        handleSubmit
    };
}