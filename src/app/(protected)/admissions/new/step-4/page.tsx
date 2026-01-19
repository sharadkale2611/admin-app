'use client';

import {
    Box,
    Card,
    CardContent,
    Typography,
    Divider,
    Stack,
    Grid,
    Chip,
    Avatar,
    Alert,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from '@mui/material';
import { ReactNode, useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useWizardNext } from '../components/wizard/WizardNextContext';
import { submitAdmissionFromDraft } from "@/lib/features/admission/admissionDraftThunks";
import { resetAdmissionDraft } from '@/lib/features/admission/admissionDraftSlice';



/* ---------- REUSABLE ---------- */


const LabelValueVertical = ({
    label,
    value,
}: {
    label: string;
    value?: ReactNode;
}) => (
    <Box>
        <Typography
            variant="caption"
            color="text.secondary"
            component="div"   // ✅
        >
            {label}
        </Typography>
        <Typography
            variant="body1"
            fontWeight={600}
            component="div"   // ✅
        >
            {value ?? '—'}
        </Typography>
    </Box>
);


const LabelValue = ({
    label,
    value,
}: {
    label: string;
    value?: ReactNode;
}) => (
    <Grid container spacing={1}>
        <Grid size={{ xs: 5, md: 4 }}>
            <Typography
                variant="body2"
                color="text.secondary"
                component="div"   // ✅ IMPORTANT
            >
                {label}
            </Typography>
        </Grid>
        <Grid size={{ xs: 7, md: 8 }}>
            <Box> {/* ✅ container, not Typography */}
                {value ?? '—'}
            </Box>
        </Grid>
    </Grid>
);


export default function AdmissionStep4ReviewPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const wizardNextRef = useWizardNext();

    const draft = useAppSelector(s => s.admissionDraft);
    const student = draft.student;
    const acad = draft.academicDetails;
    const pricing = draft.pricing;
    const [submitting, setSubmitting] = useState(false);


    type DraftAdmissionSubmitPayload = {
        student: typeof draft.student;
        courseId: number;
        enrollmentType: string;
        enrollmentDate: string;
        academicDetails: typeof draft.academicDetails;
        pricing: typeof draft.pricing;
    }; 

    /* ---------- GUARDS ---------- */
    useEffect(() => {
        if (!draft.studentConfirmed || !student) {
            router.replace('/admissions/new/step-1');
            return;
        }
        if (!draft.courseConfirmed || !draft.courseId) {
            router.replace('/admissions/new/step-2');
            return;
        }
        if (!pricing) {
            router.replace('/admissions/new/step-3');
        }
    }, [draft, student, pricing, router]);

    /* ---------- SUBMIT ---------- */


    const handleSubmit = useCallback((): boolean => {
        dispatch(submitAdmissionFromDraft())
            .unwrap()
            .then(res => {
                dispatch(resetAdmissionDraft());
                router.replace(`/students/${res.admission.studentId}`);
            })
            .catch(err => {
                console.error("Submit failed", err);
                alert(err.error ?? "Submission failed");
            });

        return false; // ⛔ stop wizard navigation
    }, [dispatch, router]);

    useEffect(() => {
        if (!wizardNextRef) {
            console.warn('❌ wizardNextRef is NULL in Step-4');
            return;
        }

        console.log('🟢 [Step-4] Registering submit handler');
        wizardNextRef.current = handleSubmit;

        return () => {
            console.log('🧹 [Step-4] Clearing submit handler');
            wizardNextRef.current = null;
        };
    }, [wizardNextRef, handleSubmit]);


    if (!student || !pricing) return null;

    return (
        <Box sx={{ backgroundColor: 'white', padding: 3, borderRadius: 2 }} >
            <Typography variant="h6" gutterBottom>
                Review & Confirm Admission
            </Typography>

            <Alert severity="info" sx={{ mb: 3 }}>
                Please review all details carefully before final submission.
            </Alert>

            <Stack spacing={3}>

                {/* ================= STUDENT ================= */}
                <Card variant="outlined">
                    <CardContent>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar
                                sx={{ width: 56, height: 56 }}
                                src={student.profileImagePath || undefined}
                            >
                                {student.firstName?.[0]}
                            </Avatar>

                            <Box>
                                <Typography variant="h6" fontWeight={600}>
                                    {student.firstName} {student.lastName}
                                </Typography>
                                <Stack direction="row" spacing={1} mt={0.5}>
                                    <Chip size="small" label={student.gender} />
                                    <Chip
                                        size="small"
                                        color="primary"
                                        label={student.reservationCategory}
                                    />
                                    <Chip
                                        size="small"
                                        variant="outlined"
                                        label={student.mobile}
                                    />
                                </Stack>
                            </Box>
                        </Stack>

                        <Divider sx={{ my: 2 }} />

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                <LabelValue label="Father Name" value={student.fatherName} />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                <LabelValue label="Mother Name" value={student.motherName} />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                <LabelValue label="Father Occupation" value={student.fatherOccupation} />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                <LabelValue label="Email" value={student.email} />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* ================= ADDRESS ================= */}
                <Card variant="outlined">
                    <CardContent>
                        <Typography fontWeight={600} gutterBottom sx={{ mb: 2 }} component="div">
                            Address Details 
                            <Chip
                                size="small"
                                color="secondary"
                                label={student.addressType}
                                sx={{ mx: 2 }}
                            />

                        </Typography>
        
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                <LabelValue label="Address" value={student.address} />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                <LabelValue label="Pincode" value={student.pincode} />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* ================= ACADEMIC ================= */}
                {acad && (
                    <Card variant="outlined">
                        <CardContent>
                            <Typography fontWeight={600} gutterBottom>
                                Academic Details
                            </Typography>

                            {/* CURRENT */}
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 1,
                                    bgcolor: '#e0e0e0',
                                    border: '0px solid',
                                    borderColor: 'primary.100',
                                }}
                            >
                                <Typography variant="subtitle2" gutterBottom>
                                    Current Academic
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: 12, md: 6 }}><LabelValue label="Year" value={acad.currentAcademicYear} /></Grid>
                                    <Grid size={{ xs: 12, sm: 12, md: 6 }}><LabelValue label="Class" value={acad.currentClass} /></Grid>
                                    <Grid size={{ xs: 12, sm: 12, md: 6 }}><LabelValue label="Stream" value={acad.stream} /></Grid>
                                    <Grid size={{ xs: 12, sm: 12, md: 6 }}><LabelValue label="Medium" value={acad.currentMedium} /></Grid>
                                    <Grid size={{ xs: 12, sm: 12, md: 6 }}><LabelValue label="Board" value={acad.currentBoard} /></Grid>
                                    <Grid size={{ xs: 12, sm: 12, md: 6 }}><LabelValue label="Institution" value={acad.currentInstitution} /></Grid>
                                </Grid>
                            </Box>

                            {/* PREVIOUS */}
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Previous Academic
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: 12, md: 6 }}><LabelValue label="Year" value={acad.prevAcademicYear} /></Grid>
                                    <Grid size={{ xs: 12, sm: 12, md: 6 }}><LabelValue label="Class" value={acad.prevClass} /></Grid>
                                    <Grid size={{ xs: 12, sm: 12, md: 6 }}><LabelValue label="Medium" value={acad.prevMedium} /></Grid>
                                    <Grid size={{ xs: 12, sm: 12, md: 6 }}><LabelValue label="Board" value={acad.prevBoard} /></Grid>
                                    <Grid size={{ xs: 12, sm: 12, md: 6 }}><LabelValue label="Institution" value={acad.prevInstitution} /></Grid>
                                    {acad.prevClass === '10th' && (
                                        <>
                                            <Grid size={{ xs: 12 }}>
                                                <Divider sx={{ my: 1 }} />
                                                <Typography variant="caption" color="text.secondary">
                                                    SSC Performance
                                                </Typography>
                                            </Grid>

                                            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
                                                <LabelValueVertical
                                                    label="English Marks"
                                                    value={acad.prevMarkEnglish}
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
                                                <LabelValueVertical
                                                    label="Math Marks"
                                                    value={acad.prevMarkMath}
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
                                                <LabelValueVertical
                                                    label="Science Marks"
                                                    value={acad.prevMarkScience}
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
                                                <LabelValueVertical
                                                    label="Percentage"
                                                    value={
                                                        acad.prevPercentage
                                                            ? `${acad.prevPercentage}%`
                                                            : '—'
                                                    }
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
                                                <LabelValueVertical
                                                    label="Grade"
                                                    value={acad.prevGrade}
                                                />
                                            </Grid>
                                        </>
                                    )}

                                </Grid>
                            </Box>
                        </CardContent>
                    </Card>
                )}

                {/* ================= FEES ================= */}
                <Card variant="outlined">
                    <CardContent>
                        <Typography fontWeight={600} gutterBottom sx={{mb:2}}>
                            Fee & Payment Summary
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <LabelValue
                                    label="Total Fee"
                                    value={`₹${pricing.totalAmount}`}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <LabelValue
                                    label="Discount"
                                    value={`₹${pricing.discountAmount ?? 0}`}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <LabelValue
                                    label="Final Amount"
                                    value={`₹${pricing.finalAmount}`}
                                />
                            </Grid>

                            {/* <Grid size={{ xs: 12 }}>
                                <Divider sx={{ my: 1 }} />
                            </Grid> */}


                            <Grid size={{ xs: 12, md: 3 }}>
                                <LabelValue
                                    label="Paid Amount"
                                    value={
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Typography fontWeight={600}>
                                                ₹{pricing.paidAmount ?? 0}
                                            </Typography>

                                            {(pricing.paidAmount ?? 0) > 0 && (
                                                <Chip
                                                    size="small"
                                                    color="primary"
                                                    label={pricing.paymentMode ?? '—'}
                                                    sx={{ textTransform: 'capitalize' }}
                                                />
                                            )}
                                        </Stack>
                                    }
                                />
                            </Grid>


                            {/* <Grid size={{ xs: 12, md: 4 }}>
                                <LabelValue
                                    label="Payment Mode"
                                    value={
                                        <Chip
                                            size="small"
                                            color="primary"
                                            label={pricing.paymentMode ?? '—'}
                                            sx={{ textTransform: 'capitalize' }}
                                        />
                                    }
                                />
                            </Grid> */}
                        </Grid>

                    </CardContent>
                </Card>

                {/* ================= INSTALLMENTS ================= */}
                {pricing.installments && pricing.installments.length > 0 && (
                    <Card variant="outlined">
                        <CardContent>
                            <Typography fontWeight={600} gutterBottom>
                                Installment Schedule
                            </Typography>

                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>Amount</TableCell>
                                        <TableCell>Due Date</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {pricing.installments.map(inst => (
                                        <TableRow key={inst.installmentCount}>
                                            <TableCell>{inst.installmentCount}</TableCell>
                                            <TableCell>₹{inst.amount}</TableCell>
                                            <TableCell>
                                                {new Intl.DateTimeFormat('en-GB', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                }).format(new Date(inst.date))}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}
            </Stack>
        </Box>
    );
}
