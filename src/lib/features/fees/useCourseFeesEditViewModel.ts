// src/lib/features/fees/useCourseFeesEditViewModel.ts
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import {
    CourseFee,
    CourseFeeDto,
    fetchCourseFeeById,
    updateCourseFee,
} from './feesThunks';
import { SelectChangeEvent } from '@mui/material';
import Swal from 'sweetalert2';

/* ======================================================
   EDIT COURSE FEES VIEW MODEL
====================================================== */
export const useCourseFeesEditViewModel = (id: string) => {
    const dispatch = useAppDispatch();

    /* -----------------------------
       Redux state
    ------------------------------ */
    const { currentCourseFee, loading, error } = useAppSelector(
        (state) => state.courseFees
    );

    /* -----------------------------
       Local state
    ------------------------------ */
    const [formData, setFormData] = useState<CourseFee>({
        courseFeeId: 0,
        courseId: 0,
        feeAmount: 0,
        gstPercentage: 0,
        totalInstallments: 1,
        branchId: null,
        courseName: '',
        totalFee: 0,
        createdAt: new Date().toISOString(),
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    /* -----------------------------
       Derived values
    ------------------------------ */
    const totalFee =
        Number(formData.feeAmount || 0) +
        (Number(formData.feeAmount || 0) *
            Number(formData.gstPercentage || 0)) /
        100;

    /* ======================================================
       FETCH COURSE FEE BY ID (ONCE)
    ====================================================== */
    const handleFetchCourseFeeById = useCallback(
        async (courseFeeId: number) => {
            const result = await dispatch(fetchCourseFeeById(courseFeeId));

            if (fetchCourseFeeById.fulfilled.match(result)) {
                setFormData(result.payload);
            }
        },
        [dispatch]
    );

    useEffect(() => {
        if (!id || id === '0') return;

        handleFetchCourseFeeById(Number(id));
    }, [id, handleFetchCourseFeeById]);

    /* ======================================================
       UPDATE COURSE FEE
    ====================================================== */
    const handleUpdateCourseFee = useCallback(
        async (data: CourseFee) => {
            setIsSubmitting(true);
            setSubmitError(null);

            try {
                const dto: CourseFeeDto = {
                    courseFeeId: Number(data.courseFeeId),
                    courseId: Number(data.courseId),
                    totalInstallments: Number(data.totalInstallments),
                    feeAmount: Number(data.feeAmount),
                    gstPercentage: Number(data.gstPercentage),
                    branchId: data.branchId ?? undefined,
                };

                const result = await dispatch(updateCourseFee(dto)).unwrap();
                setSubmitSuccess(true);

                Swal.fire({
                    title: 'Success!',
                    text: 'Fee structure updated successfully',
                    icon: 'success',
                    timer: 1800,
                    showConfirmButton: false,
                });

                return result;
            } catch (err: any) {
                setSubmitError(err?.message || 'Failed to update course fee');
                return null;
            } finally {
                setIsSubmitting(false);
            }
        },
        [dispatch]
    );

    /* ======================================================
       INPUT HANDLERS
    ====================================================== */
    const handleNumberChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value === '' ? 0 : Number(value),
        }));
    };


    const handleSelectChange = (e: SelectChangeEvent<number>) => {
        const { name, value } = e.target;

        if (!name) return;

        setFormData((prev) => ({
            ...prev,
            [name]: Number(value),
        }));
    };

    /* ======================================================
       EXPOSE TO UI
    ====================================================== */
    return {
        // redux
        currentCourseFee,
        isLoading: loading,
        error,

        // form
        formData,
        setFormData,
        totalFee,

        // state
        isSubmitting,
        submitError,
        submitSuccess,

        // actions
        handleFetchCourseFeeById,
        handleUpdateCourseFee,
        handleNumberChange,
        handleSelectChange,
    };
};
