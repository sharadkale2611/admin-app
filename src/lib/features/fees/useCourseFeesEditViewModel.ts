// src/lib/features/fees/useCourseFeesEditViewModel.ts
import { useState, useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { CourseFee, CourseFeeDto, fetchCourseFeeById, updateCourseFee } from './feesThunks';
import { SelectChangeEvent } from '@mui/material';
import { fetchCourses } from '../course/courseThunks';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

export const useCourseFeesEditViewModel = (id: string) => {
    const dispatch = useAppDispatch();

    // Fees slice
    const { currentCourseFee, loading, error } = useAppSelector(
        (state) => state.courseFees
    );

    // Courses slice
    const { courses, loading: coursesLoading } = useAppSelector(
        (state) => state.courses
    );

    const router = useRouter();

    const [formData, setFormData] = useState<CourseFee>({
        courseFeeId: 0,
        courseId: 0,
        feeAmount: 0,
        gstPercentage: 0,
        totalInstallments: 1,
        branchId: null,
        courseName: "",
        totalFee: 0,
        createdAt: new Date().toISOString(),
    });


    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const totalFee =
        (formData.feeAmount ?? 0) +
        ((formData.feeAmount ?? 0) * (formData.gstPercentage ?? 0)) / 100;

    // Fetch courses when hook mounts
    useEffect(() => {
        console.log('from useCourseFeesEditViewModel');
        console.log('from useCourseFeesEditViewModel');
        
        dispatch(fetchCourses({ page: 1, searchTerm: '', status: null, courseLevel: null, categoryId: null }));
    }, [dispatch]);


    const handleFetchCourseFeeById = useCallback(
        async (courseFeeId: number) => {
            const result = await dispatch(fetchCourseFeeById(courseFeeId));
            if (fetchCourseFeeById.fulfilled.match(result)) {
                setFormData(result.payload);
            }
        },
        [dispatch]
    );

    const handleUpdateCourseFee = useCallback(
        async (data: CourseFee) => {
            setIsSubmitting(true);
            setSubmitError(null);
            try {
                const dto: CourseFeeDto = {
                    courseFeeId: data.courseFeeId,
                    courseId: data.courseId,
                    totalInstallments: data.totalInstallments,
                    feeAmount: data.feeAmount,
                    gstPercentage: data.gstPercentage,
                    branchId: data.branchId ?? undefined,
                };

                const result = await dispatch(updateCourseFee(dto)).unwrap();
                setSubmitSuccess(true);
                
            Swal.fire({
                title: 'Success!',
                text: 'Recrod updated successfully!',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            }); 
                router.push('/fees');               
                return result;
            } catch (err: any) {
                setSubmitError(err.message || 'Failed to update course fee');
                return null;
            } finally {
                setIsSubmitting(false);
            }
        },
        [dispatch]
    );

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: Number(e.target.value),
        }));
    };

    const handleSelectChange = (e: SelectChangeEvent<number>) => {
        const { name, value } = e.target;
        if (name) {
            setFormData((prev) => ({
                ...prev,
                [name]: Number(value),
            }));
        }
    };

    return {
        currentCourseFee,
        isLoading: loading,
        courses,
        coursesLoading,
        error,
        formData,
        totalFee,
        isSubmitting,
        submitError,
        submitSuccess,
        handleFetchCourseFeeById,
        handleUpdateCourseFee,
        handleNumberChange,
        handleSelectChange,
    };
};
