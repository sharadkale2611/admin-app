'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAppDispatch } from '@/lib/hooks';
import { CourseFee } from './feesTypes';
import { fetchCourseFeeById } from './feesThunks';
import { useCourseDetailsViewModel } from '@/lib/features/course/useCourseDetailsViewModel';

export const useCourseFeeDetailsViewModel = (feeId: string) => {
    const dispatch = useAppDispatch();

    const [fee, setFee] = useState<CourseFee | null>(null);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadFeeDetails = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const result = await dispatch(fetchCourseFeeById(Number(feeId))).unwrap();

            setFee(result);
        } catch (err: any) {
            setError(err || 'Failed to fetch course fee');
        } finally {
            setLoading(false);
        }
    }, [dispatch, feeId]);

    useEffect(() => {
        loadFeeDetails();
    }, [loadFeeDetails]);

    // Fetch course details to show category, firm, etc.
    const { course } = useCourseDetailsViewModel(fee?.courseId?.toString() || '');

    return {
        fee,
        course,
        isLoading,
        error,
        refetch: loadFeeDetails
    };
};
