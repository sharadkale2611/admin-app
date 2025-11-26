'use client';

import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Stack,
    Divider,
    Button,
    Chip,
    CircularProgress
} from "@mui/material";
import { ArrowBack, Edit } from "@mui/icons-material";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchAdmissionById } from "@/lib/features/admission/admissionThunks";
import { clearCurrentAdmission } from "@/lib/features/admission/admissionSlice";

interface Props {
    params: { id: string } | Promise<{ id: string }>;
}

const ViewAdmissionPage: React.FC<Props> = ({ params }) => {
    const [id, setId] = useState<number | null>(null);
    const dispatch = useDispatch<AppDispatch>();
    const { currentAdmission, loading } = useSelector(
        (state: RootState) => state.admissions
    );

    // Log for debugging
    useEffect(() => {
        console.log('currentAdmission', currentAdmission);
    }, [currentAdmission]);
        
    // Handle async params safely
    useEffect(() => {
        const resolveParams = async () => {
            const resolvedParams = await params;
            setId(Number(resolvedParams.id));
        };
        resolveParams();
    }, [params]);

    // Fetch admission once ID is available
    useEffect(() => {
        if (id !== null && !isNaN(id)) {
            dispatch(fetchAdmissionById(id));
        }
        return () => {
            dispatch(clearCurrentAdmission());
        };
    }, [id, dispatch]);

    const formatDate = (dateStr: string | null) =>
        dateStr ? dateStr.split("T")[0] : "—";

    if (loading || id === null) {
        return (
            <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!currentAdmission) {
        return (
            <Box sx={{ p: 4 }}>
                <Typography>No admission found.</Typography>
            </Box>
        );
    }

    const adm = currentAdmission;

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Button
                        startIcon={<ArrowBack />}
                        component={Link}
                        href="/admissions"
                        variant="outlined"
                    >
                        Back
                    </Button>
                    <Typography variant="h4" component="div">Admission Details</Typography>
                </Stack>

                <Button
                    startIcon={<Edit />}
                    variant="contained"
                    component={Link}
                    href={`/admissions/${adm.studentEnrollmentId}/edit`}
                >
                    Edit
                </Button>
            </Stack>

            {/* Details Section */}
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" component="div" sx={{ mb: 2 }}>Basic Information</Typography>

                <Stack spacing={1}>
                    <Typography component="div"><strong>ID:</strong> {adm.studentEnrollmentId}</Typography>
                    <Typography component="div"><strong>Student Name:</strong> {adm.studentName}</Typography>
                    <Typography component="div"><strong>Course:</strong> {adm.courseName}</Typography>
                    <Typography component="div"><strong>Enrollment Type:</strong> {adm.enrollmentType}</Typography>

                    <Typography
                        component="div"
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                        <strong>Payment Status:</strong>
                        <Chip
                            label={adm.paymentStatus}
                            size="small"
                            color={
                                adm.paymentStatus === "Paid"
                                    ? "success"
                                    : adm.paymentStatus === "Pending"
                                        ? "warning"
                                        : "error"
                            }
                        />
                    </Typography>

                    <Typography component="div"><strong>Final Amount:</strong> ₹{adm.finalAmount}</Typography>
                    <Typography component="div"><strong>Paid Amount:</strong> ₹{adm.paidAmount}</Typography>

                    <Typography
                        component="div"
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                        <strong>Status:</strong>
                        <Chip
                            label={adm.status ? "Active" : "Inactive"}
                            size="small"
                            color={adm.status ? "success" : "error"}
                        />
                    </Typography>

                    <Typography component="div"><strong>Enrollment Date:</strong> {formatDate(adm.enrollmentDate)}</Typography>
                </Stack>
            </Paper>
        </Box>
    );
};

export default ViewAdmissionPage;
