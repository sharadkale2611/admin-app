'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { AppDispatch } from '@/lib/store';
import { ApiError, createAdmission } from './admissionThunks';
import { CreateAdmissionDto, EnrollmentType, PaymentStatus } from './admissionTypes';
import { fetchDiscountCodes } from '../discountCode/discountCodeThunks';

export interface Installment {
    installmentCount: number;
    amount: number;
    date: string;
}

export interface AdmissionFormData {
    studentId: number | null;
    courseId: number | null;
    enrollmentType: EnrollmentType | '';
    enrollmentDate: string;
    paymentStatus: PaymentStatus | '';
    totalAmount: number | null;
    paidAmount: number | null;
    discountCode: string | null;
    discountAmount: number | null;
    finalAmount: number | null;
    remarks: string | null;
    lastTransactionId: string | null;
    courseFeeId: number | null;
    installmentCount: number;
    installments: Installment[];
}

export default function useCreateAdmissionViewModel() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch<AppDispatch>();

    const [discounts, setDiscounts] = useState<
        { code: string; discountType: string; discountValue: number }[]
    >([]);

    const [formData, setFormData] = useState<AdmissionFormData>({
        studentId: null,
        courseId: null,
        enrollmentType: '',
        enrollmentDate: new Date().toISOString().split("T")[0],
        paymentStatus: '',
        totalAmount: null,
        paidAmount: null,
        discountCode: null,
        discountAmount: null,
        finalAmount: null,
        remarks: null,
        lastTransactionId: null,
        courseFeeId: null,
        installmentCount: 1,
        installments: []
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);

    // Prefill student & course from query params
    useEffect(() => {
        const studentIdParam = searchParams.get("studentId");
        const courseIdParam = searchParams.get("courseId");

        setFormData((prev) => ({
            ...prev,
            studentId: studentIdParam ? Number(studentIdParam) : prev.studentId,
            courseId: courseIdParam ? Number(courseIdParam) : prev.courseId,
        }));
    }, [searchParams]);

    // Load discounts
    useEffect(() => {
        async function getDiscounts() {
            try {
                const result = await dispatch(fetchDiscountCodes()).unwrap();
                setDiscounts(result);
            } catch (err) {
                console.error("Failed to fetch discounts", err);
            }
        }
        getDiscounts();
    }, [dispatch]);

    // Handle discount changes
    const handleDiscountChange = (code: string) => {
        const selected = discounts.find((d) => d.code === code);
        if (!selected) return;

        const discountAmount =
            selected.discountType === "Percentage"
                ? ((formData.totalAmount ?? 0) * selected.discountValue) / 100
                : selected.discountValue;

        const finalAmount = (formData.totalAmount ?? 0) - discountAmount;

        setFormData((prev) => ({
            ...prev,
            discountCode: selected.code,
            discountAmount,
            finalAmount,
        }));
    };

    // General form input handling
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        let updatedValue: any =
            ["studentId", "courseId", "totalAmount", "paidAmount"].includes(name)
                ? value === "" ? null : Number(value)
                : value;

        setFormData((prev) => {
            let updated = { ...prev, [name]: updatedValue };

            // Auto-payment status logic
            if (name === "paidAmount" && updated.finalAmount !== null) {
                if (updatedValue < 100) {
                    toast.error("Paid amount must be at least 100");
                } else if (updatedValue > updated.finalAmount) {
                    toast.error("Paid amount cannot exceed Final Amount");
                }

                if (updatedValue === updated.finalAmount) {
                    updated.paymentStatus = PaymentStatus.Paid;
                } else if (updatedValue >= 100 && updatedValue < updated.finalAmount) {
                    updated.paymentStatus = PaymentStatus.PartiallyPaid;
                } else {
                    updated.paymentStatus = "";
                }
            }

            return updated;
        });
    };

    // Handle select fields
    const handleSelectChange = (e: { target: { name: string; value: any } }) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "enrollmentType" ? (value as EnrollmentType) : value,
        }));
    };

    // Submit handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        console.log('Submitting form with data:', formData);
        try {
            // VALIDATION FIXED (no falsy-number issues)
            if (
                formData.studentId === null ||
                formData.courseId === null ||
                !formData.enrollmentType ||
                !formData.enrollmentDate ||
                formData.totalAmount === null ||
                formData.finalAmount === null ||
                formData.paidAmount === null
            ) {
                throw "Please fill in all required fields";
            }

            if (formData.paidAmount < 100) throw "Paid Amount must be at least 100";
            if (formData.paidAmount > formData.finalAmount)
                throw "Paid Amount cannot exceed Final Amount";

            const dto: CreateAdmissionDto = {
                studentId: formData.studentId!,
                courseId: formData.courseId!,
                enrollmentType: formData.enrollmentType as EnrollmentType,
                enrollmentDate: formData.enrollmentDate,
                paymentStatus: formData.paymentStatus as PaymentStatus,
                totalAmount: formData.totalAmount!,
                paidAmount: formData.paidAmount!,
                discountCode: formData.discountCode || "",
                discountAmount: formData.discountAmount || 0,
                finalAmount: formData.finalAmount!,
                remarks: formData.remarks || "",
                lastTransactionId: formData.lastTransactionId || "",
                courseFeeId: formData.courseFeeId || null,
                installmentCount: formData.installmentCount,
                installments: formData.installments,
            };

            const result = await dispatch(createAdmission(dto)).unwrap();

            if (result.success) {
                toast.success(result.message || "Admission created successfully");
                router.push("/admissions");
            } else {
                throw result.error || "Failed to create admission";
            }
        } catch (err: any) {
            const msg = typeof err === "string"
            ? err
            : err?.message ?? JSON.stringify(err);

            setError({ error: msg, errors: null });
            toast.error(msg);

        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        setFormData,
        isSubmitting,
        error,
        discounts,
        handleChange,
        handleSelectChange,
        handleDiscountChange,
        handleSubmit,
    };
}
