'use client';

import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Grid,
    Alert,
    Autocomplete,
    Divider,
    Card,
    CardContent,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow

} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { EnrollmentType, PaymentStatus } from '@/lib/features/admission/admissionTypes';
import useCreateAdmissionViewModel, { Installment } from '@/lib/features/admission/useCreateAdmissionViewModel';
import { ApiError } from '@/lib/features/admission/admissionThunks';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { RootState } from '@/lib/store';
import { useAppDispatch } from '@/lib/hooks';
import { fetchCoursesList } from '@/lib/features/course/courseThunks';
import { fetchStudentList } from '@/lib/features/student/studentThunks';
import { fetchCourseFees } from '@/lib/features/fees/feesThunks';
import { fetchDiscountCodes } from '@/lib/features/discountCode/discountCodeThunks';
import { isNumber } from '@mui/x-data-grid/internals';

export default function CreateAdmission() {
    const {
        formData,
        setFormData,
        isSubmitting,
        error,
        handleChange,
        handleSelectChange,
        handleDiscountChange,
        handleSubmit
    } = useCreateAdmissionViewModel();

    const router = useRouter();
    const searchParams = useSearchParams();
    const installmentOptions = [1, 2, 3, 4, 5, 6];

    const [students, setStudents] = useState<{ id: number; name: string }[]>([]); ``
    const [courses, setCourses] = useState<{ id: number; name: string }[]>([]);
    const [discounts, setDiscounts] = useState<{ code: string; discountType: string; discountValue: number }[]>([]);    
    const [levelOne, setLevelOne] = useState<boolean>(false);
    const [levelTwo, setLevelTwo] = useState<boolean>(false);
    const [levelThree, setLevelThree] = useState<boolean>(false);

    const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useAppDispatch();

    useEffect(()=>{
        setLevelOne(formData.studentId && formData.enrollmentDate && formData.enrollmentType ? true: false)
        setLevelTwo(levelOne && !!formData.courseId)
        setLevelThree(
            levelOne && 
            !!levelTwo &&
            !!formData.discountCode &&
            formData.paidAmount !== null &&
            formData.paidAmount > 0
        );
    },[formData])

    // Fetch initial data
    useEffect(() => {
        async function fetchData() {
            try {
                const [studentsRes, coursesRes, discountsRes] = await Promise.all([
                    dispatch(fetchStudentList()).unwrap(),
                    dispatch(fetchCoursesList()).unwrap(),
                    dispatch(fetchDiscountCodes()).unwrap()
                ]);
                setStudents(studentsRes.map((s) => ({ id: Number(s.studentId), name: s.userName })));
                setCourses(coursesRes.map((c) => ({ id: Number(c.courseId), name: c.courseName })));
                setDiscounts(discountsRes);
            } catch (err) {
                console.error("Failed to fetch dropdown data", err);
            }
        }
        fetchData();
    }, [dispatch]);

    // Auto-fill course fee
    useEffect(() => {
        async function loadCourseFee() {
            if (!formData.courseId) return;
            try {
                const fees = await dispatch(fetchCourseFees({ courseId: formData.courseId })).unwrap();
                if (fees && fees.length > 0) {
                    const selectedFee = fees[0];
                    // Update formData directly
                    setFormData(prev => ({
                        ...prev,
                        totalAmount: selectedFee.totalFee,
                        finalAmount: selectedFee.totalFee, // initially same as total
                        courseFeeId: selectedFee.courseFeeId
                    }));

                    handleSelectChange({ target: { name: 'totalAmount', value: String(fees[0].totalFee) } });
                }
            } catch (err) {
                console.error("Failed to fetch course fee", err);
            }
        }
        loadCourseFee();
    }, [formData.courseId, dispatch]);

    useEffect(() => {
        const count = Number(formData.installmentCount) || 1;
        const finalAmount = Number(formData.finalAmount) || 0;
        const paidAmount = Number(formData.paidAmount) || 0;

        if (count <= 0) return;

        // Calculate base amount per installment as integer
        const baseAmount = Math.floor(finalAmount / count);
        const remainder = finalAmount - baseAmount * count; // carry remainder to last installment

        const today = new Date(formData.enrollmentDate);
        today.setDate(today.getDate() + 10); // first installment 10 days after enrollment

        const installments: Installment[] = Array.from({ length: count }, (_, i) => {
            let amount = baseAmount;
            if (i === count - 1) amount += remainder; // last installment gets remainder

            // Deduct paid amount from first installment
            // if (i === 0 && paidAmount > 0) {
            //     amount = Math.max(0, amount - paidAmount);
            // }

            const installmentDate = new Date(today);
            installmentDate.setMonth(today.getMonth() + i);

            return {
                installmentCount: i + 1,
                amount,
                date: installmentDate.toISOString().split('T')[0],
            };
        });

        setFormData(prev => ({ ...prev, installments }));
    }, [formData.installmentCount, formData.finalAmount, formData.paidAmount, formData.enrollmentDate]);

    return (
        <Container maxWidth="lg" sx={{ mt: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Create New Admission
                </Typography>
                <Link href="/admissions" passHref>
                    <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<Cancel />}
                        size="small"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                </Link>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error.error}
                </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    {/* Student & Admission Details */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card variant="outlined" sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                                    Student & Admission Details
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12 }}>
                                        <Autocomplete
                                            options={students}
                                            getOptionLabel={(option) => option.name}
                                            onChange={(_, value) =>
                                                handleSelectChange({
                                                    target: {
                                                        name: 'studentId',
                                                        value: value ? value.id : null   // reset to null
                                                    }
                                                })}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Student"
                                                    required
                                                    size="small"
                                                    disabled={isSubmitting}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            fullWidth
                                            label="Admission Date"
                                            name="enrollmentDate"
                                            type="date"
                                            value={formData.enrollmentDate??''}
                                            onChange={handleChange}
                                            InputLabelProps={{ shrink: true }}
                                            required
                                            size="small"
                                            disabled={isSubmitting}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <FormControl fullWidth size="small" disabled={isSubmitting}>
                                            <InputLabel>Enrollment Type</InputLabel>
                                            <Select
                                                label="Enrollment Type"
                                                name="enrollmentType"
                                                value={formData.enrollmentType??''}
                                                onChange={handleSelectChange}
                                            >
                                                {Object.values(EnrollmentType).map((type) => (
                                                    <MenuItem key={type} value={type??''}>{type}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Course Selection */}
                    <Grid size={{ xs: 12, md: 6 }} sx={{ display: levelOne ? '' : 'none' }}   >
                        <Card variant="outlined" sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                                    Course Selection
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12 }}>
                                        <Autocomplete
                                            options={courses}
                                            getOptionLabel={(option) => option.name}
                                            onChange={(_, value) =>
                                                handleSelectChange({ target: { name: 'courseId', value: value ? String(value.id) : '' } })
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Course"
                                                    required
                                                    size="small"
                                                    disabled={isSubmitting}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12 }}>
                                        <Box sx={{
                                            p: 2,
                                            bgcolor: 'grey.50',
                                            borderRadius: 1,
                                            border: '1px solid',
                                            borderColor: 'grey.300'
                                        }}>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Course Fee
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                {formData.totalAmount ? `₹${formData.totalAmount}` : 'Select a course'}
                                            </Typography>
                                        </Box>
                                        <TextField
                                            fullWidth
                                            name="courseFeeId"
                                            value={formData.courseFeeId || ''}
                                            sx={{ display: 'none' }}

                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Payment & Pricing */}
                    <Grid size={{ xs: 12 }} sx={{ display: levelTwo ? '' : 'none' }}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                                    Payment & Pricing
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <FormControl fullWidth size="small" disabled={isSubmitting || discounts.length === 0}>
                                            <InputLabel>Discount Code</InputLabel>
                                            <Select
                                                name="discountCode"
                                                value={formData.discountCode ?? ''}
                                                onChange={(e) => handleDiscountChange(e.target.value)}
                                                label="Discount Code"
                                            >
                                                {discounts.map((d) => (
                                                    <MenuItem key={d.code} value={d.code??''}>
                                                        {d.code} ({d.discountType} - {d.discountValue})
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <TextField
                                            fullWidth
                                            label="Paid Amount"
                                            name="paidAmount"
                                            type="number"
                                            value={formData.paidAmount ?? ''}
                                            onChange={handleChange}
                                            size="small"
                                            disabled={isSubmitting}
                                            InputProps={{ startAdornment: '₹' }}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <TextField
                                            fullWidth
                                            label="Payment Remark"
                                            name="remarks"
                                            type="text"
                                            value={formData.remarks ?? 'Registration Fee'}
                                            onChange={handleChange}
                                            size="small"
                                            disabled={isSubmitting}
                                        />
                                    </Grid>


                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <Box sx={{
                                            p: 2,
                                            bgcolor: 'grey.50',
                                            borderRadius: 1,
                                            border: '1px solid',
                                            borderColor: 'grey.300',
                                            height: '100%'
                                        }}>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Final Amount
                                            </Typography>
                                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                                {formData.finalAmount ? `₹${formData.finalAmount}` : 'Calculate...'}
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <Box sx={{
                                            p: 2,
                                            bgcolor: formData.paymentStatus ?
                                                (formData.paymentStatus === PaymentStatus.Paid ? 'success.light' :
                                                    formData.paymentStatus === PaymentStatus.PartiallyPaid ? 'warning.light' : 'error.light') : 'grey.50',
                                            borderRadius: 1,
                                            border: '1px solid',
                                            borderColor: 'grey.300',
                                            height: '100%'
                                        }}>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Payment Status
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                {formData.paymentStatus || 'Pending calculation'}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Installment */}
                    <Grid size={{ xs: 12, sm: 4 }} sx={{ display: levelThree ? '' : 'none' }}>
                        <FormControl fullWidth size="small" disabled={isSubmitting}>
                            <InputLabel>Installment Count</InputLabel>
                            <Select
                                label="Installment Count"
                                name="installmentCount"
                                value={formData.installmentCount || ''}
                                onChange={(e) =>
                                    setFormData(prev => ({
                                        ...prev,
                                        installmentCount: Number(e.target.value)
                                    }))
                                }
                            >
                                {installmentOptions.map((num) => (
                                    <MenuItem key={num} value={num}>
                                        {num}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <TableContainer component={Paper} sx={{ display: levelThree ? '' : 'none' }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Installment #</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {formData.installments?.map((inst, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{inst.installmentCount}</TableCell>

                                        {/* Amount Input */}
                                        <TableCell>
                                            <TextField
                                                type="number"
                                                size="small"
                                                value={inst.amount??''}
                                                onChange={(e) => {
                                                    const newInstallments = [...formData.installments];
                                                    newInstallments[index].amount = parseFloat(e.target.value) || 0;
                                                    setFormData((prev) => ({ ...prev, installments: newInstallments }));
                                                }}
                                            />
                                        </TableCell>

                                        {/* Date Input */}
                                        <TableCell>
                                            <TextField
                                                type="date"
                                                size="small"
                                                value={inst.date}
                                                onChange={(e) => {
                                                    const newInstallments = [...formData.installments];
                                                    newInstallments[index].date = e.target.value;
                                                    setFormData((prev) => ({ ...prev, installments: newInstallments }));
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Submit Button */}
                    <Grid size={{ xs: 12 }} sx={{ display: levelThree ? '' : 'none' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 1 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                startIcon={<Save />}
                                size="medium"
                                disabled={isSubmitting}
                                sx={{ minWidth: 160 }}
                            >
                                {isSubmitting ? 'Creating...' : 'Create Admission'}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>

            </Box>


        </Container>
    );
}