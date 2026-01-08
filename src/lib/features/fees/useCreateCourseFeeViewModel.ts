'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { CourseFeeDto } from './feesThunks';
import { createCourseFee } from './feesThunks';
import { fetchCourses } from '../course/courseThunks';
import Swal from 'sweetalert2';

interface FormData {
    courseId: number;
    totalInstallments: number | '';
    feeAmount: number | '';
    gstPercentage: number | '';
    branchId?: number;
}

const initialFormData: FormData = {
    courseId: 0,
    totalInstallments: 1,
    feeAmount: 0,
    gstPercentage: 0,
    branchId: undefined
};

export const useCreateCourseFeeViewModel = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string>('');

    // Get courses from Redux store
    const { courses, loading: coursesLoading, error: coursesError } = useAppSelector(
        (state) => state.courses
    );

    // Fetch courses on component mount
    useEffect(() => {
        dispatch(fetchCourses({}));
    }, [dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
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
            [name]: value === '' ? '' : Number(value)  // ❌ Converting to Number
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            // Convert to numbers for validation
            const courseId = Number(formData.courseId);
            const feeAmount = Number(formData.feeAmount);
            const totalInstallments = Number(formData.totalInstallments);
            const gstPercentage = Number(formData.gstPercentage);

            // Validate required fields
            if (courseId <= 0) {
                throw new Error('Please select a course');
            }

            if (feeAmount <= 0) {
                throw new Error('Fee amount must be greater than 0');
            }

            if (totalInstallments < 1 || totalInstallments > 12) {
                throw new Error('Total installments must be between 1 and 12');
            }

            if (gstPercentage < 0 || gstPercentage > 100) {
                throw new Error('GST percentage must be between 0 and 100');
            }

            const courseFeeDto: CourseFeeDto = {
                courseId,
                totalInstallments,
                feeAmount,
                gstPercentage,
                branchId: formData.branchId ? Number(formData.branchId) : undefined
            };

            console.log('Dispatching createCourseFee with:', courseFeeDto);

            // Use the alternative approach with match() instead of unwrap()
            const resultAction = await dispatch(createCourseFee(courseFeeDto));

            if (createCourseFee.fulfilled.match(resultAction)) {
                // Success case
                const result = resultAction.payload;
                console.log('Create course fee success:', result);
                Swal.fire({
                    title: 'Success!',
                    text: 'Recrod Added successfully!',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
                window.location.reload();
                // router.push('/fees');
                // router.refresh();
            } else if (createCourseFee.rejected.match(resultAction)) {
                // Error case - get the error from the action payload
                console.log('Create course fee rejected:', resultAction);
                setError(resultAction.payload || 'Failed to create course fee');
            }

        } catch (err: any) {
            console.error('Error in handleSubmit:', err);

            // Handle different error types
            if (err.payload) {
                setError(err.payload); // Error from thunk rejection
            } else if (err.message) {
                setError(err.message); // Validation error
            } else {
                setError('An unexpected error occurred while creating the course fee');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setError('');
    };

    // Calculate total fee
    const totalFee = Number(formData.feeAmount) + (Number(formData.feeAmount) * Number(formData.gstPercentage) / 100);

    return {
        formData,
        setFormData,
        totalFee,
        isSubmitting,
        error,
        courses,
        coursesLoading,
        coursesError,
        handleChange,
        handleSelectChange,
        handleNumberChange,
        handleSubmit,
        resetForm
    };
};

export default useCreateCourseFeeViewModel;