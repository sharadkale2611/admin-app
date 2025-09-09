'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch } from '@/lib/hooks';
import { login } from './authThunks';
import { AlertColor } from '@mui/material';

interface LoginFormValues {
    username: string;
    password: string;
}

interface ThunkRejectValue {
    message: string;
    fieldErrors?: Record<string, string[]>;
}

export const useLoginViewModel = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<{
        message: string;
        severity?: AlertColor;
        fieldErrors?: Record<string, string[]>;
    } | null>(null);
    const [loading, setLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    console.log('im useLoginViewModel');

    const handleSubmit = async (values: LoginFormValues) => {
        setLoading(true);
        setError(null);
        setValidationErrors([]);

        try {
            // Use unwrap() to properly handle the promise
            const result = await dispatch(login(values)).unwrap();

        } catch (err: unknown) {
            const error = err as ThunkRejectValue;

            if (error?.fieldErrors) {
                const errorMessages = Object.values(error.fieldErrors)
                    .flat()
                    .map((msg: string) => msg);
                setValidationErrors(errorMessages);
            }

            setError({
                message: error?.message || 'Login failed',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return {
        handleSubmit,
        loading,
        error,
        validationErrors
    };
};
