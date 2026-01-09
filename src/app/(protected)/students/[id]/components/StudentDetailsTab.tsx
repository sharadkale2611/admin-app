'use client';

import React from 'react';
import {
    Grid,
    Paper,
    Avatar,
    Typography,
    Divider,
    Stack,
    Box,
    Button,
    Skeleton,
    Alert,
} from '@mui/material';

import {
    Edit,
    Email,
    Phone,
    Person,
    Cake,
    School,
    Code,
} from '@mui/icons-material';

import { ApiError } from "@/lib/features/student/studentTypes";

import Link from 'next/link';

interface Props {
    student: any;
    isLoading: boolean;
    error: ApiError | null;
}

export default function StudentDetailsTab({
    student,
    isLoading,
    error,
}: Props) {
    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Not specified';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    /* ---------- LOADING ---------- */
    if (isLoading) {
        return <Skeleton variant="rectangular" height={350} />;
    }

    /* ---------- ERROR ---------- */
    if (error) {
        return <Alert severity="error">Failed to load student details</Alert>;
    }

    if (!student) return null;

    return (
        <Grid container spacing={3}>
            {/* =====================================================
          LEFT COLUMN — PROFILE CARD
      ====================================================== */}
            <Grid size={{ xs: 12, md: 4 }} >
                <Paper sx={{ p: 3, textAlign: 'center' }} elevation={2}>
                    <Avatar
                        sx={{
                            width: 96,
                            height: 96,
                            mx: 'auto',
                            mb: 2,
                            fontSize: '2rem',
                            bgcolor: 'secondary.main',
                        }}
                    >
                        {student.firstName?.charAt(0)}
                        {student.lastName?.charAt(0)}
                    </Avatar>

                    <Typography variant="h6">
                        {student.firstName} {student.lastName}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        {student.studentCode || 'No student code'}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Stack spacing={1} alignItems="flex-start">
                        <Box display="flex" alignItems="center" gap={1}>
                            <Email fontSize="small" />
                            <Typography variant="body2">
                                {student.email || 'No email'}
                            </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" gap={1}>
                            <Phone fontSize="small" />
                            <Typography variant="body2">
                                {student.mobileNumber || 'No phone'}
                            </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" gap={1}>
                            <Person fontSize="small" />
                            <Typography variant="body2">
                                @{student.userName}
                            </Typography>
                        </Box>
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    <Link href={`/students/${student.studentId}/edit`}>
                        <Button
                            variant="contained"
                            startIcon={<Edit />}
                            fullWidth
                            size="small"
                        >
                            Edit Student
                        </Button>
                    </Link>
                </Paper>
            </Grid>

            {/* =====================================================
          RIGHT COLUMN — DETAILS (LIKE BATCH DETAILS)
      ====================================================== */}
            <Grid  size={{ xs: 12, md: 8 }}>
                <Paper sx={{ p: 3 }} elevation={2}>
                    {/* ---------- PERSONAL INFO ---------- */}
                    <Typography variant="h6" gutterBottom>
                        Personal Information
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <InfoItem
                                icon={<Code fontSize="small" />}
                                label="Student Code"
                                value={student.studentCode}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InfoItem
                                icon={<Cake fontSize="small" />}
                                label="Date of Birth"
                                value={formatDate(student.dateOfBirth)}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InfoItem
                                icon={<Person fontSize="small" />}
                                label="Gender"
                                value={
                                    student.gender === 'M'
                                        ? 'Male'
                                        : student.gender === 'F'
                                            ? 'Female'
                                            : student.gender || 'Not specified'
                                }
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InfoItem
                                icon={<School fontSize="small" />}
                                label="Status"
                                value={student.isActive ? 'Active Student' : 'Inactive Student'}
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    {/* ---------- SYSTEM INFO ---------- */}
                    <Typography variant="h6" gutterBottom>
                        System Information
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <InfoItem label="Student ID" value={student.studentId} />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InfoItem label="User ID" value={student.userId} />
                        </Grid>

                        {student.firmId && (
                            <Grid size={{ xs: 12, md: 6 }}>
                                <InfoItem
                                    label="Firm"
                                    value={`${student.firmName} (${student.firmCode})`}
                                />
                            </Grid>
                        )}

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InfoItem
                                label="Created On"
                                value={formatDate(student.createdAt)}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InfoItem
                                label="Last Updated"
                                value={
                                    student.updatedAt
                                        ? formatDate(student.updatedAt)
                                        : 'Never'
                                }
                            />
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    );
}

/* =====================================================
   SMALL REUSABLE INFO ITEM (LIKE BATCH DETAILS)
===================================================== */
function InfoItem({
    label,
    value,
    icon,
}: {
    label: string;
    value?: any;
    icon?: React.ReactNode;
}) {
    return (
        <Box>
            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                {icon}
                <Typography variant="subtitle2" color="text.secondary">
                    {label}
                </Typography>
            </Box>
            <Typography variant="body1">
                {value || 'Not specified'}
            </Typography>
        </Box>
    );
}
