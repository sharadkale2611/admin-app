'use client';

import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Stack,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import { useEffect, useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setPricingDetails } from '@/lib/features/admission/admissionDraftSlice';
import { useWizardNext } from '../components/wizard/WizardNextContext';

import useCreateAdmissionViewModel from '@/lib/features/admission/useCreateAdmissionViewModel';
import { fetchCourseFees } from '@/lib/features/fees/feesThunks';

/* -------------------- TYPES -------------------- */
type InstallmentCycle =
    | 'Weekly'
    | 'Monthly'
    | 'BiMonthly'
    | 'Quarterly'
    | 'FourMonthly';

const cycleMonthMap: Record<InstallmentCycle, number> = {
    Weekly: 0,
    Monthly: 1,
    BiMonthly: 2,
    Quarterly: 3,
    FourMonthly: 4,
};

/* -------------------- HELPERS -------------------- */



const getNextMonthFirstDate = () =>
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);

const addMonths = (date: Date, months: number) =>
    new Date(date.getFullYear(), date.getMonth() + months, 1);

const addWeeks = (date: Date, weeks: number) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate() + weeks * 7);

const formatDate = (date: Date) =>
    date.toISOString().split('T')[0];

export default function AdmissionStep3PricingPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const draft = useAppSelector(s => s.admissionDraft);
    const wizardNextRef = useWizardNext();

    const {
        formData,
        setFormData,
        discounts,
        handleDiscountChange,
        handlePaidAmountChange,
    } = useCreateAdmissionViewModel();

    const rehydratedRef = useRef(false);


    const buildPricingPayload = () => {
        const {
            courseFeeId,
            totalAmount,
            discountCode,
            discountAmount,
            finalAmount,
            paidAmount,
            paymentMode,
            installmentCount,
            installmentCycle,
            installments,
        } = formData;

        return {
            courseFeeId,
            totalAmount,
            discountCode: discountCode || undefined,
            discountAmount: discountAmount || undefined,
            finalAmount,
            paidAmount: paidAmount ?? 0,

            paymentMode:
                paidAmount && paidAmount > 0
                    ? paymentMode
                    : undefined,

            installmentCount:
                installmentCount && installmentCount > 1
                    ? installmentCount
                    : undefined,

            installmentCycle:
                installmentCount && installmentCount > 1
                    ? installmentCycle
                    : undefined,

            installments:
                installmentCount && installmentCount > 1
                    ? installments
                    : [],
        };
    };


    /* -------------------- LOCAL ERRORS -------------------- */
    const [errors, setErrors] = useState<{
        paymentMode?: string;
        paidAmount?: string;
        installmentCycle?: string;
    }>({});

    /* -------------------- GUARDS -------------------- */
    useEffect(() => {
        if (!draft.studentConfirmed) {
            router.replace('/admissions/new/step-1');
            return;
        }
        if (!draft.courseConfirmed || !draft.courseId) {
            router.replace('/admissions/new/step-2');
        }
    }, [draft, router]);

    /* -------------------- REHYDRATE ONCE -------------------- */
    useEffect(() => {
        if (rehydratedRef.current) return;
        if (!draft.pricing) return;

        setFormData(prev => ({
            ...prev,
            installmentCycle: prev.installmentCycle ?? 'Monthly',
            ...draft.pricing,
        }));

        rehydratedRef.current = true;
    }, [draft.pricing, setFormData]);

    /* -------------------- LOAD COURSE FEES -------------------- */
    useEffect(() => {
        if (!draft.courseId) return;

        dispatch(fetchCourseFees({ courseId: draft.courseId }))
            .unwrap()
            .then((fees) => {
                if (!fees?.length) return;

                const fee = fees[0];
                const totalAmount = Math.ceil(Number(fee.totalFee));

                setFormData(prev => ({
                    ...prev,
                    courseId: draft.courseId ?? null,
                    courseFeeId: Number(fee.courseFeeId),
                    feeAmount: Math.ceil(Number(fee.feeAmount)),
                    gstPercentage: Number(fee.gstPercentage),
                    gstAmount: Math.ceil(totalAmount - Number(fee.feeAmount)),
                    totalAmount,
                    finalAmount: totalAmount,
                    installmentCount: prev.installmentCount || 1,
                    installmentCycle: prev.installmentCycle || 'Monthly',
                }));
            });
    }, [dispatch, draft.courseId, setFormData]);

    /* -------------------- GENERATE INSTALLMENTS -------------------- */
    useEffect(() => {
        if (
            !formData.finalAmount ||
            !formData.installmentCount ||
            formData.installmentCount <= 1
        ) {
            setFormData(prev => ({
                ...prev,
                installments: [],
            }));
            return;
        }


        const count = formData.installmentCount;
        const cycle = (formData.installmentCycle || 'Monthly') as InstallmentCycle;

        const baseAmount = Math.floor(formData.finalAmount / count);
        const remainder = formData.finalAmount % count;

        const startDate =
            cycle === 'Weekly'
                ? addWeeks(new Date(), 1)
                : getNextMonthFirstDate();

        const installments = Array.from({ length: count }, (_, i) => {
            const date =
                cycle === 'Weekly'
                    ? addWeeks(startDate, i)
                    : addMonths(startDate, i * cycleMonthMap[cycle]);

            return {
                installmentCount: i + 1,
                amount: i === 0 ? baseAmount + remainder : baseAmount,
                date: formatDate(date),
            };
        });

        setFormData(prev => ({
            ...prev,
            installments,
        }));
    }, [
        formData.finalAmount,
        formData.installmentCount,
        formData.installmentCycle,
        setFormData,
    ]);

    /* -------------------- PAID AMOUNT -------------------- */
    const handlePaidChange = (value: number | null) => {
        const firstInstallment = formData.installments?.[0]?.amount ?? formData.finalAmount;

        if (value && value > firstInstallment) {
            setErrors(prev => ({
                ...prev,
                paidAmount: `Paid amount cannot exceed ₹${firstInstallment}`,
            }));
            handlePaidAmountChange(firstInstallment);
            return;
        }

        setErrors(prev => ({ ...prev, paidAmount: undefined }));
        handlePaidAmountChange(value);
    };

    /* -------------------- VALIDATE BEFORE NEXT -------------------- */
    const validate = () => {
        const e: typeof errors = {};
        if (formData.paidAmount !== null && formData.paidAmount < 0) {
            e.paidAmount = 'Paid amount cannot be negative';
        }

        if (formData.paidAmount !== null && formData.paidAmount > 0) {
            if (!formData.paymentMode) {
                e.paymentMode = 'Payment mode is required';
            }
        }

        if (
            formData.installmentCount > 1 &&
            !formData.installmentCycle
        ) {
            e.installmentCycle = 'Installment cycle is required';
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    /* -------------------- NEXT -------------------- */

    const handleNext = useCallback((): boolean => {
        if (!validate()) return false;
        if (formData.finalAmount <= 0) return false;

        const pricingPayload = buildPricingPayload();

        dispatch(setPricingDetails(pricingPayload));
        return true;
    }, [dispatch, formData]);


    useEffect(() => {
        if (!wizardNextRef) return;
        wizardNextRef.current = handleNext;
        return () => {
            wizardNextRef.current = null;
        };
    }, [wizardNextRef, handleNext]);

    /* ======================== UI ======================== */
    return (
        <Box maxWidth={900}>
            <Typography variant="h6" gutterBottom>
                Fees & Installments
            </Typography>

            <Card variant="outlined">
                <CardContent>
                    <Stack spacing={3}>

                        {/* SUMMARY */}
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Base Course Fee"
                                    sx={{ backgroundColor: '#c6c6c677' }}
                                    value={`₹ ${formData.feeAmount}`}
                                    size="small"
                                    InputProps={{ readOnly: true }}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Total Fee (Incl. GST)"
                                    sx={{ backgroundColor: '#c6c6c677' }}
                                    value={`₹ ${formData.totalAmount}`}
                                    size="small"
                                    InputProps={{ readOnly: true }}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Discount Code</InputLabel>
                                    <Select
                                        value={formData.discountCode ?? ''}
                                        label="Discount Code"
                                        onChange={(e) =>
                                            handleDiscountChange(e.target.value)
                                        }
                                    >
                                        {discounts.map(d => (
                                            <MenuItem key={d.code} value={d.code}>
                                                {d.code}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Divider />

                        {/* PAYMENT */}
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Final Amount"
                                    sx={{ backgroundColor: '#c6c6c677' }}
                                    value={`₹ ${formData.finalAmount}`}
                                    size="small"
                                    InputProps={{ readOnly: true }}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Paid Amount"
                                    type="number"
                                    size="small"
                                    value={formData.paidAmount ?? ''}
                                    error={!!errors.paidAmount}
                                    helperText={errors.paidAmount}
                                    onChange={(e) =>
                                        handlePaidChange(
                                            e.target.value
                                                ? Number(e.target.value)
                                                : null
                                        )
                                    }
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <FormControl
                                    fullWidth
                                    size="small"
                                    error={!!errors.paymentMode}
                                    disabled={!formData.paidAmount || formData.paidAmount <= 0}

                                >
                                    <InputLabel>Payment Mode</InputLabel>
                                    <Select
                                        value={formData.paymentMode ?? ''}
                                        label="Payment Mode"
                                        onChange={(e) =>
                                            setFormData(prev => ({
                                                ...prev,
                                                paymentMode: e.target.value,
                                            }))
                                        }
                                    >
                                        {['Cash', 'UPI', 'Card'].map(m => (
                                            <MenuItem key={m} value={m}>
                                                {m}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.paymentMode && (
                                        <Typography variant="caption" color="error">
                                            {errors.paymentMode}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Installments</InputLabel>
                                    <Select
                                        value={formData.installmentCount}
                                        label="Installments"
                                        onChange={(e) =>
                                            setFormData(prev => ({
                                                ...prev,
                                                installmentCount: Number(e.target.value),
                                            }))
                                        }
                                    >
                                        {[1, 2, 3, 4, 5, 6].map(n => (
                                            <MenuItem key={n} value={n}>
                                                {n}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {formData.installmentCount > 1 && (
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <FormControl
                                        fullWidth
                                        size="small"
                                        error={!!errors.installmentCycle}
                                    >
                                        <InputLabel>Installment Cycle</InputLabel>
                                        <Select
                                            value={formData.installmentCycle ?? 'Monthly'}
                                            label="Installment Cycle"
                                            onChange={(e) =>
                                                setFormData(prev => ({
                                                    ...prev,
                                                    installmentCycle: e.target.value as InstallmentCycle,
                                                }))
                                            }
                                        >
                                            <MenuItem value="Weekly">Weekly</MenuItem>
                                            <MenuItem value="Monthly">Monthly</MenuItem>
                                            <MenuItem value="BiMonthly">Every 2 Months</MenuItem>
                                            <MenuItem value="Quarterly">Quarterly</MenuItem>
                                            <MenuItem value="FourMonthly">Every 4 Months</MenuItem>
                                        </Select>
                                        {errors.installmentCycle && (
                                            <Typography variant="caption" color="error">
                                                {errors.installmentCycle}
                                            </Typography>
                                        )}
                                    </FormControl>
                                </Grid>
                            )}

                        </Grid>

                        {/* INSTALLMENT TABLE */}
                        {formData.installments.length > 0 && (
                            <>
                                <Divider />
                                <Typography variant="subtitle2">
                                    Installment Schedule
                                </Typography>

                                <Paper variant="outlined">
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>#</TableCell>
                                                <TableCell>Amount</TableCell>
                                                <TableCell>Date</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {formData.installments.map((inst, idx) => (
                                                <TableRow key={idx}>
                                                    <TableCell>{inst.installmentCount}</TableCell>
                                                    <TableCell>₹ {inst.amount}</TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            type="date"
                                                            size="small"
                                                            value={inst.date}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    installments: prev.installments.map((i, iidx) =>
                                                                        iidx === idx
                                                                            ? { ...i, date: val }
                                                                            : i
                                                                    ),
                                                                }));
                                                            }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Paper>
                            </>
                        )}
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}
