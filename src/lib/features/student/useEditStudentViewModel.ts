'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { updateStudent, fetchStudentById } from './studentThunks';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import { toast } from 'react-toastify';
import { ApiError } from './studentTypes';

/* =========================================================
   FULL FORM DATA – MATCHES ASP.NET CORE MODEL
   (EXCLUDES profileImage)
========================================================= */
export interface StudentFormData {
    userName: string;

    firstName: string;
    motherName: string;
    fatherName: string;
    lastName: string;

    email: string;
    mobileNumber1: string;
    mobileNumber2: string;
    whatsappNumber: string;

    dateOfBirth: string;
    gender: 'M' | 'F' | 'O' | 'Male' | 'Female' | 'Other' | '';

    resevationCategory: string;
    fathersOccupation: string;

    isActive: boolean;
}

export default function useEditStudentViewModel() {
    const router = useRouter();
    const { id } = useParams();
    const dispatch: AppDispatch = useDispatch();

    const studentId = Number(id);
    if (!id || isNaN(studentId)) {
        throw new Error('Invalid student ID');
    }

    const { currentStudent, loading, error: fetchError } = useSelector(
        (state: RootState) => state.students
    );

    const [formData, setFormData] = useState<StudentFormData>({
        userName: '',

        firstName: '',
        motherName: '',
        fatherName: '',
        lastName: '',

        email: '',
        mobileNumber1: '',
        mobileNumber2: '',
        whatsappNumber: '',

        dateOfBirth: '',
        gender: '',

        resevationCategory: '',
        fathersOccupation: '',

        isActive: true,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);

    /* ---------------- FETCH ---------------- */
    useEffect(() => {
        dispatch(fetchStudentById(String(studentId)));
    }, [dispatch, studentId]);

    const normalizeGender = (
        gender?: string
    ): StudentFormData['gender'] => {
        if (
            gender === 'M' ||
            gender === 'F' ||
            gender === 'O' ||
            gender === 'Male' ||
            gender === 'Female' ||
            gender === 'Other'
        ) {
            return gender;
        }
        return '';
    };

    /* ---------------- HYDRATE ---------------- */
    useEffect(() => {
        if (!currentStudent) return;

        setFormData({
            userName: currentStudent.userName || '',

            firstName: currentStudent.firstName || '',
            motherName: currentStudent.motherName || '',
            fatherName: currentStudent.fatherName || '',
            lastName: currentStudent.lastName || '',

            email: currentStudent.email || '',
            mobileNumber1: currentStudent.mobileNumber1 || '',
            mobileNumber2: currentStudent.mobileNumber2 || '',
            whatsappNumber: currentStudent.whatsappNumber || '',

            dateOfBirth: currentStudent.dateOfBirth
                ? currentStudent.dateOfBirth.split('T')[0]
                : '',
            gender: normalizeGender(currentStudent.gender),

            resevationCategory: currentStudent.resevationCategory || '',
            fathersOccupation: currentStudent.fathersOccupation || '',

            isActive: currentStudent.isActive,
        });
    }, [currentStudent]);

    /* ---------------- HANDLERS ---------------- */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((p) => ({ ...p, [name]: value }));
    };

    const handleSelectChange = (e: { target: { name: string; value: string } }) => {
        const { name, value } = e.target;
        setFormData((p) => ({ ...p, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData((p) => ({ ...p, [name]: checked }));
    };

    /* ---------------- SUBMIT ---------------- */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const result = await dispatch(
                updateStudent({
                    id: studentId,
                    data: {
                        firstName: formData.firstName,
                        motherName: formData.motherName || undefined,
                        fatherName: formData.fatherName || undefined,
                        lastName: formData.lastName,

                        email: formData.email || undefined,
                        mobileNumber1: formData.mobileNumber1 || undefined,
                        mobileNumber2: formData.mobileNumber2 || undefined,
                        whatsappNumber: formData.whatsappNumber || undefined,

                        dateOfBirth: formData.dateOfBirth || undefined,
                        gender: formData.gender || undefined,

                        resevationCategory:
                            formData.resevationCategory || undefined,
                        fathersOccupation:
                            formData.fathersOccupation || undefined,

                        isActive: formData.isActive,
                    },
                })
            ).unwrap();

            if (result.success) {
                toast.success('Student updated successfully');
                router.push('/students');
            } else {
                throw new Error(result.error || 'Update failed');
            }
        } catch (err: any) {
            setError({
                error: err?.error || err?.message || 'Update failed',
                errors: err?.errors || null,
            });
            toast.error(err?.message || 'Update failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        isSubmitting,
        loading,
        error: error || fetchError,
        errors: error || fetchError,

        handleChange,
        handleSelectChange,
        handleCheckboxChange,
        handleSubmit,
    };
}
