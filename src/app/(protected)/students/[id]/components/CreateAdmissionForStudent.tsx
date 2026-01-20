'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Grid,
    Alert,
    Divider,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Slide,
    Snackbar,
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import MuiAlert from '@mui/material/Alert';
import { useRouter } from 'next/navigation';

import { EnrollmentType } from '@/lib/features/admission/admissionTypes';
import useCreateAdmissionViewModel, {
    Installment,
} from '@/lib/features/admission/useCreateAdmissionViewModel';

import { useAppDispatch } from '@/lib/hooks';
import { fetchCoursesList } from '@/lib/features/course/courseThunks';
import { fetchCourseFees } from '@/lib/features/fees/feesThunks';
import { fetchDiscountCodes } from '@/lib/features/discountCode/discountCodeThunks';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { RootState } from '@/lib/store';

/* =====================================================
   PROPS
===================================================== */
type Props = {
    studentId: number;
    onCancel: () => void;
    onSuccess: () => void;
};

/* =====================================================
   COMPONENT
===================================================== */
export default function CreateAdmissionForStudent({
    studentId,
    onCancel,
    onSuccess,
}: Props) {
    const {
        formData,
        setFormData,
        isSubmitting,
        error,
        handleChange,
        handleSelectChange,
        handleDiscountChange,
        handleSubmit,
    } = useCreateAdmissionViewModel();

    const dispatch: ThunkDispatch<RootState, unknown, AnyAction> =
        useAppDispatch();

    const router = useRouter();
    const submitRef = useRef(false); // 🔐 guard

    const installmentOptions = [1, 2, 3, 4, 5, 6];

    const [courses, setCourses] = useState<{ id: number; name: string }[]>([]);
    const [discounts, setDiscounts] = useState<
        { code: string; discountType: string; discountValue: number }[]
    >([]);

    const [levelOne, setLevelOne] = useState(false);
    const [levelTwo, setLevelTwo] = useState(false);
    const [levelThree, setLevelThree] = useState(false);

    const [showSuccess, setShowSuccess] = useState(false);

    /* ================= AUTO SET STUDENT ================= */
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            studentId,
        }));
    }, [studentId, setFormData]);

    /* ================= LEVEL LOGIC ================= */
    useEffect(() => {
        setLevelOne(!!formData.enrollmentDate && !!formData.enrollmentType);
        setLevelTwo(levelOne && !!formData.courseId);
        setLevelThree(
            levelTwo &&
            formData.paidAmount !== null &&
            formData.paidAmount >= 0
        );
    }, [formData, levelOne, levelTwo]);

    /* ================= FETCH COURSES + DISCOUNTS ================= */
    useEffect(() => {
        async function loadData() {
            const [coursesRes, discountsRes] = await Promise.all([
                dispatch(fetchCoursesList()).unwrap(),
                dispatch(fetchDiscountCodes()).unwrap(),
            ]);

            setCourses(
                coursesRes.map(c => ({
                    id: Number(c.courseId),
                    name: c.courseName,
                }))
            );

            setDiscounts(discountsRes);
        }

        loadData();
    }, [dispatch]);

    /* ================= AUTO COURSE FEE ================= */
    useEffect(() => {
        async function loadCourseFee() {
            if (!formData.courseId) return;

            const fees = await dispatch(
                fetchCourseFees({ courseId: formData.courseId })
            ).unwrap();

            if (fees?.length) {
                const fee = fees[0];
                setFormData(prev => ({
                    ...prev,
                    totalAmount: fee.totalFee,
                    finalAmount: fee.totalFee,
                    courseFeeId: fee.courseFeeId,
                }));
            }
        }

        loadCourseFee();
    }, [formData.courseId, dispatch, setFormData]);

    /* ================= INSTALLMENT CALC ================= */
    useEffect(() => {
        if (
            !formData.installmentCount ||
            !formData.finalAmount ||
            !formData.enrollmentDate
        )
            return;

        const count = Number(formData.installmentCount);
        const finalAmount = Number(formData.finalAmount);

        const base = Math.floor(finalAmount / count);
        const remainder = finalAmount - base * count;

        const start = new Date(formData.enrollmentDate);
        start.setDate(start.getDate() + 10);

        const installments: Installment[] = Array.from(
            { length: count },
            (_, i) => {
                const date = new Date(start);
                date.setMonth(start.getMonth() + i);

                return {
                    installmentCount: i + 1,
                    amount: i === count - 1 ? base + remainder : base,
                    date: date.toISOString().split('T')[0],
                };
            }
        );

        setFormData(prev => ({ ...prev, installments }));
    }, [
        formData.installmentCount,
        formData.finalAmount,
        formData.enrollmentDate,
        setFormData,
    ]);

    /* ================= SUCCESS HANDLER ================= */
    useEffect(() => {
        if (!submitRef.current) return;

        if (!isSubmitting && !error) {
            setShowSuccess(true);

            const timer = setTimeout(() => {
                onSuccess(); // ✅ trigger same behavior as Cancel
                router.push(`/students/${studentId}`); // optional, if still needed
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [isSubmitting, error, router, studentId]);

    /* ================= RENDER ================= */
    return (
        <Slide direction="left" in mountOnEnter unmountOnExit>
            <Container maxWidth="lg" sx={{ mt: 2, mb: 3 }}>
                {/* SUCCESS TOAST */}
                <Snackbar
                    open={showSuccess}
                    autoHideDuration={1500}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <MuiAlert severity="success" variant="filled">
                        Admission created successfully 🎉
                    </MuiAlert>
                </Snackbar>

                {/* HEADER */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                    }}
                >
                    <Box>
                        <Typography variant="h5" fontWeight={600}>
                            Create Admission
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Student ID : {studentId}
                        </Typography>
                    </Box>

                    <Button
                        variant="outlined"
                        startIcon={<Cancel />}
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box
                    component="form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        submitRef.current = true;
                        handleSubmit();
                    }}
                >
                    <Grid container spacing={2}>
                        {/* ADMISSION DETAILS */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography fontWeight={600}>
                                        Admission Details
                                    </Typography>
                                    <Divider sx={{ my: 2 }} />

                                    <TextField
                                        fullWidth
                                        label="Admission Date"
                                        type="date"
                                        name="enrollmentDate"
                                        value={formData.enrollmentDate ?? ''}
                                        onChange={handleChange}
                                        InputLabelProps={{ shrink: true }}
                                        size="small"
                                        required
                                    />

                                    <FormControl fullWidth size="small" sx={{ mt: 2 }}>
                                        <InputLabel>Enrollment Type</InputLabel>
                                        <Select
                                            name="enrollmentType"
                                            value={formData.enrollmentType ?? ''}
                                            onChange={handleSelectChange}
                                        >
                                            {Object.values(EnrollmentType).map(t => (
                                                <MenuItem key={t} value={t}>
                                                    {t}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* COURSE */}
                        {levelOne && (
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography fontWeight={600}>
                                            Course Selection
                                        </Typography>
                                        <Divider sx={{ my: 2 }} />

                                        <FormControl fullWidth size="small">
                                            <InputLabel>Course</InputLabel>
                                            <Select
                                                name="courseId"
                                                value={formData.courseId ?? ''}
                                                onChange={handleSelectChange}
                                            >
                                                {courses.map(c => (
                                                    <MenuItem key={c.id} value={c.id}>
                                                        {c.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                        <Box
                                            sx={{
                                                mt: 2,
                                                p: 2,
                                                bgcolor: 'grey.50',
                                                border: '1px solid',
                                                borderColor: 'grey.300',
                                                borderRadius: 1,
                                            }}
                                        >
                                            <Typography variant="body2">
                                                Course Fee
                                            </Typography>
                                            <Typography fontWeight={600}>
                                                ₹{formData.totalAmount ?? 0}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )}

                        {/* PAYMENT */}
                        {levelTwo && (
                            <Grid size={{ xs: 12 }}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography fontWeight={600}>
                                            Payment & Pricing
                                        </Typography>
                                        <Divider sx={{ my: 2 }} />

                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 12, md: 3 }}>
                                                <FormControl fullWidth size="small">
                                                    <InputLabel>Discount</InputLabel>
                                                    <Select
                                                        value={formData.discountCode ?? ''}
                                                        onChange={e =>
                                                            handleDiscountChange(e.target.value)
                                                        }
                                                    >
                                                        {discounts.map(d => (
                                                            <MenuItem key={d.code} value={d.code}>
                                                                {d.code} ({d.discountType} - {d.discountValue})
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>

                                            <Grid size={{ xs: 12, md: 3 }}>
                                                <TextField
                                                    fullWidth
                                                    label="Paid Amount"
                                                    name="paidAmount"
                                                    type="number"
                                                    value={formData.paidAmount ?? ''}
                                                    onChange={handleChange}
                                                    size="small"
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12, md: 3 }}>
                                                <TextField
                                                    fullWidth
                                                    label="Remarks"
                                                    name="remarks"
                                                    value={formData.remarks ?? ''}
                                                    onChange={handleChange}
                                                    size="small"
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12, md: 3 }}>
                                                <Box
                                                    sx={{
                                                        p: 2,
                                                        bgcolor: 'grey.50',
                                                        border: '1px solid',
                                                        borderColor: 'grey.300',
                                                        borderRadius: 1,
                                                        height: '100%',
                                                    }}
                                                >
                                                    <Typography variant="body2">
                                                        Final Amount
                                                    </Typography>
                                                    <Typography fontWeight={600}>
                                                        ₹{formData.finalAmount ?? 0}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )}

                        {/* INSTALLMENTS */}
                        {levelThree && (
                            <>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Installments</InputLabel>
                                        <Select
                                            value={formData.installmentCount ?? ''}
                                            onChange={e =>
                                                setFormData(prev => ({
                                                    ...prev,
                                                    installmentCount: Number(e.target.value),
                                                }))
                                            }
                                        >
                                            {installmentOptions.map(n => (
                                                <MenuItem key={n} value={n}>
                                                    {n}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <TableContainer component={Card} variant="outlined">
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>#</TableCell>
                                                    <TableCell>Amount</TableCell>
                                                    <TableCell>Date</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {formData.installments?.map((i, idx) => (
                                                    <TableRow key={idx}>
                                                        <TableCell>{i.installmentCount}</TableCell>
                                                        <TableCell>₹{i.amount}</TableCell>
                                                        <TableCell>{i.date}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            startIcon={<Save />}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Creating...' : 'Create Admission'}
                                        </Button>
                                    </Box>
                                </Grid>
                            </>
                        )}
                    </Grid>
                </Box>                
            </Container>
        </Slide>
    );
}
