'use client';

import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Stack,
    Divider,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useWizardNext } from '../components/wizard/WizardNextContext';

export default function AdmissionSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const wizardNextRef = useWizardNext();

    const admissionId = searchParams.get('id');

    /* -------------------------------------------------------
       🧹 CLEAN UP WIZARD (no Next on success page)
    ------------------------------------------------------- */
    useEffect(() => {
        if (!wizardNextRef) return;

        wizardNextRef.current = null;
        return () => {
            wizardNextRef.current = null;
        };
    }, [wizardNextRef]);

    /* -------------------------------------------------------
       🔒 SAFETY GUARD
    ------------------------------------------------------- */
    useEffect(() => {
        if (!admissionId) {
            router.replace('/admissions');
        }
    }, [admissionId, router]);

    if (!admissionId) return null;

    return (
        <Box maxWidth={700} mx="auto" mt={6} textAlign="center">
            <Card variant="outlined">
                <CardContent>
                    <Stack spacing={3} alignItems="center">
                        <CheckCircleIcon
                            color="success"
                            sx={{ fontSize: 72 }}
                        />

                        <Typography variant="h5" fontWeight={600}>
                            Admission Created Successfully
                        </Typography>

                        <Typography color="text.secondary">
                            The student has been successfully enrolled.
                        </Typography>

                        <Divider sx={{ width: '100%' }} />

                        <Typography>
                            <strong>Admission ID:</strong> #{admissionId}
                        </Typography>

                        <Typography color="text.secondary">
                            You can now manage batches, payments, and attendance
                            for this student.
                        </Typography>

                        <Divider sx={{ width: '100%' }} />

                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                            width="100%"
                            justifyContent="center"
                        >
                            <Button
                                variant="contained"
                                onClick={() =>
                                    router.push(`/admissions/${admissionId}`)
                                }
                            >
                                View Admission
                            </Button>

                            <Button
                                variant="outlined"
                                onClick={() => router.push('/admissions')}
                            >
                                Go to Admissions List
                            </Button>

                            <Button
                                variant="text"
                                onClick={() => router.push('/admissions/new')}
                            >
                                Add Another Admission
                            </Button>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}
