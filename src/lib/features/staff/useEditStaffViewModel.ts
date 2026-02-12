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

type StaffFormErrors = Partial<Record<keyof StaffFormData, string>>;

export default function useEditStaffViewModel() {
    const router = useRouter();
    const { id } = useParams();
    const dispatch: AppDispatch = useDispatch();

    const { currentStaff, loading, error: fetchError } =
        useSelector((state: RootState) => state.staff);

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

    const [errors, setErrors] = useState<StaffFormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 🔔 Snackbar state
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'error' | 'success';
    }>({
        open: false,
        message: '',
        severity: 'error'
    });

    // Fetch staff
    useEffect(() => {
        if (id) dispatch(fetchStaffById(id as string));
    }, [dispatch, id]);

    // Populate form
    useEffect(() => {
        if (currentStaff) {
            setFormData({
                userName: currentStaff.userName || '',
                email: currentStaff.email || '',
                mobileNumber: currentStaff.mobileNumber || '',
                firstName: currentStaff.firstName || '',
                lastName: currentStaff.lastName || '',
                dateOfBirth: currentStaff.dateOfBirth
                    ? currentStaff.dateOfBirth.split('T')[0]
                    : '',
                gender: currentStaff.gender || '',
                position: currentStaff.position || '',
                department: currentStaff.department || '',
                hireDate: currentStaff.hireDate
                    ? currentStaff.hireDate.split('T')[0]
                    : '',
                salary: currentStaff.salary?.toString() || '',
                isActive: currentStaff.isActive
            });
        }
    }, [currentStaff]);

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

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    // 🔒 Validation
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

        // First Name
        if (!formData.firstName)
            e.firstName = 'First name is required';
        else if (formData.firstName.trim().length < 2)
            e.firstName = 'First name must be at least 2 characters';

        // Last Name
        if (!formData.lastName)
            e.lastName = 'Last name is required';
        else if (formData.lastName.trim().length < 2)
            e.lastName = 'Last name must be at least 2 characters';

        if (!formData.dateOfBirth)
            e.dateOfBirth = 'Date of birth is required';
        else {
            const age =
                new Date().getFullYear() -
                new Date(formData.dateOfBirth).getFullYear();
            if (age < 18)
                e.dateOfBirth = 'Staff must be at least 18 years old';
        }

        if (!formData.gender)
            e.gender = 'Gender is required';

        if (!formData.department)
            e.department = 'Department is required';

        if (!formData.hireDate)
            e.hireDate = 'Hire date is required';
        else if (new Date(formData.hireDate) > new Date())
            e.hireDate = 'Hire date cannot be in future';

        if (!formData.salary)
            e.salary = 'Salary is required';
        else if (Number(formData.salary) < 0)
            e.salary = 'Salary cannot be negative';

        return e;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!id) {
            setSnackbar({
                open: true,
                message: 'Staff ID missing',
                severity: 'error'
            });
            return;
        }

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setSnackbar({
                open: true,
                message: 'Please fix form errors',
                severity: 'error'
            });
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await dispatch(updateStaff({
                id: id as string,
                userName: formData.userName,   // readonly
                email: formData.email,
                mobileNumber: formData.mobileNumber,
                firstName: formData.firstName,
                lastName: formData.lastName,
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
                position: formData.position,   // readonly
                department: formData.department,
                hireDate: formData.hireDate,
                salary: Number(formData.salary),
                isActive: formData.isActive
            })).unwrap();

            toast.success('Staff member updated successfully');
            router.push('/staff');

        } catch (err: any) {
            const msg = err?.message || 'Update failed';
            setError(msg);
            setSnackbar({
                open: true,
                message: msg,
                severity: 'error'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        errors,
        isSubmitting,
        error: error || fetchError,
        loading,
        snackbar,
        setSnackbar,
        handleChange,
        handleSelectChange,
        handleCheckboxChange,
        handleSubmit
    };
}