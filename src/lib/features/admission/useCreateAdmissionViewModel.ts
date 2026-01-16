'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { AppDispatch } from '@/lib/store';
import { fetchDiscountCodes } from '../discountCode/discountCodeThunks';
import { EnrollmentType, PaymentStatus } from './admissionTypes';
import { formatDate } from 'date-fns';

export interface Installment {
    installmentCount: number;
    amount: number;
    date: string;
}

export type InstallmentCycle =
    | 'Weekly'
    | 'Monthly'
    | 'BiMonthly'
    | 'Quarterly'
    | 'FourMonthly';

export type PaymentMode = 'Cash' | 'UPI' | 'Card';

export interface AdmissionFormData {
    studentId: number | null;
    courseId: number | null;
    enrollmentType: EnrollmentType | '';
    enrollmentDate: string;
    paymentStatus: PaymentStatus | '';
    totalAmount: number;
    paidAmount: number | null;
    discountCode: string | null;
    discountAmount: number;
    finalAmount: number;
    remarks: string | null;
    courseFeeId: number | null;

    // ✅ ADD THESE
    feeAmount: number;        // base fee
    gstPercentage: number;
    gstAmount: number;

    paymentMode?: PaymentMode;              
    installmentCount: number;
    installmentCycle?: InstallmentCycle;

    installments: {
        installmentCount: number;
        amount: number;
        date: string;
    }[];
}


export default function useCreateAdmissionViewModel() {
    const dispatch = useDispatch<AppDispatch>();

    const [discounts, setDiscounts] = useState<
        { code: string; discountType: string; discountValue: number }[]
    >([]);

    const [formData, setFormData] = useState<AdmissionFormData>({
        studentId: null,
        courseId: null,
        enrollmentType: '',
        enrollmentDate: new Date().toISOString().split('T')[0],
        paymentStatus: '',
        totalAmount: 0,
        paidAmount: null,
        discountCode: null,
        discountAmount: 0,
        finalAmount: 0,
        remarks: 'Registration Fee',
        courseFeeId: null,

        feeAmount: 0,
        gstPercentage: 0,
        gstAmount: 0,

        installmentCount: 1,          
        installmentCycle: 'Monthly',
        paymentMode: undefined,
        installments: [],
    });


    /* -------------------------------------------------------
       LOAD DISCOUNTS
    ------------------------------------------------------- */
    useEffect(() => {
        dispatch(fetchDiscountCodes())
            .unwrap()
            .then(setDiscounts)
            .catch(() => console.error('Failed to load discounts'));
    }, [dispatch]);

    /* -------------------------------------------------------
       APPLY DISCOUNT
    ------------------------------------------------------- */
    const handleDiscountChange = (code: string) => {
        setFormData(prev => {
            const selected = discounts.find(d => d.code === code);
            if (!selected) return prev;

            let discountAmount = 0;

            if (selected.discountType === 'Percentage') {
                discountAmount = Math.round(
                    (prev.totalAmount * selected.discountValue) / 100
                );
            } else {
                discountAmount = selected.discountValue;
            }

            const finalAmount = Math.max(
                0,
                prev.totalAmount - discountAmount
            );

            return {
                ...prev,
                discountCode: selected.code,
                discountAmount,
                finalAmount,
                paidAmount: null,
                paymentStatus: '',
            };
        });
    };
 
    
    


    /* -------------------------------------------------------
       PAID AMOUNT → PAYMENT STATUS
    ------------------------------------------------------- */
    const handlePaidAmountChange = (amount: number | null) => {
        setFormData(prev => {
            let status: PaymentStatus | '' = '';

            if (amount !== null) {
                if (amount < 100) {
                    toast.error('Paid amount must be at least ₹100');
                } else if (amount > prev.finalAmount) {
                    toast.error('Paid amount cannot exceed Final Amount');
                } else if (amount === prev.finalAmount) {
                    status = PaymentStatus.Paid;
                } else if (amount >= 100) {
                    status = PaymentStatus.PartiallyPaid;
                }
            }

            return {
                ...prev,
                paidAmount: amount,
                paymentStatus: status,
            };
        });
    };

    /* -------------------------------------------------------
       INSTALLMENT GENERATION
    ------------------------------------------------------- */
   
 
    useEffect(() => {
        if (!formData.installmentCount || formData.finalAmount <= 0) return;

        const count = formData.installmentCount;
        const paid = formData.paidAmount ?? 0;

        // 1️⃣ Split FINAL AMOUNT (before paid)
        const baseAmount = Math.ceil(formData.finalAmount / count);
        let remaining = formData.finalAmount;

        const startDate = new Date(formData.enrollmentDate);
        startDate.setDate(startDate.getDate() + 10);

        const installments: Installment[] = Array.from({ length: count }, (_, i) => {
            const amount =
                i === count - 1 ? remaining : Math.min(baseAmount, remaining);

            remaining -= amount;

            const d = new Date(startDate);
            d.setMonth(startDate.getMonth() + i);

            return {
                installmentCount: i + 1,
                amount,
                date: formatDate(d, 'dd-MM-yyyy'),
            };
        });

        // 2️⃣ Deduct PAID AMOUNT from FIRST installment
        if (paid > 0 && installments.length > 0) {
            installments[0].amount = Math.max(
                0,
                installments[0].amount - paid
            );
        }

        setFormData(prev => ({
            ...prev,
            installments,
        }));
    }, [
        formData.installmentCount,
        formData.finalAmount,
        formData.paidAmount,
        formData.enrollmentDate,
    ]);

    

    return {
        formData,
        setFormData,
        discounts,
        handleDiscountChange,
        handlePaidAmountChange,
    };
}
