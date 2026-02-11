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
    FamilyRestroom,
    Work,
    Category,
    WhatsApp,
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
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (isLoading) {
        return <Skeleton variant="rectangular" height={350} />;
    }

    if (error) {
        return <Alert severity="error">Failed to load student details</Alert>;
    }

    if (!student) return null;

    return (
        <Grid container spacing={3}>
            {/* ================= LEFT : PROFILE ================= */}
            <Grid size={{ xs: 12, md: 4 }}>
                <Paper sx={{ p: 3, textAlign: 'center' }} elevation={2}>
                    <Avatar
                        src={student.profileImagePath || undefined}
                        sx={{
                            width: 96,
                            height: 96,
                            mx: 'auto',
                            mb: 2,
                            fontSize: '2rem',
                            bgcolor: 'secondary.main',
                        }}
                    >
                        {!student.profileImagePath &&
                            `${student.firstName?.[0] ?? ''}${student.lastName?.[0] ?? ''}`}
                    </Avatar>

                    <Typography variant="h6">
                        {student.firstName} {student.lastName}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        {student.studentCode}
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
                                {student.mobileNumber1 || 'No mobile'}
                            </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" gap={1}>
                            <WhatsApp fontSize="small" />
                            <Typography variant="body2">
                                {student.whatsappNumber || 'Not specified'}
                            </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" gap={1}>
                            <Person fontSize="small" />
                            <Typography variant="body2">
                                @{student.userName}
                            </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" gap={1}>
                            <Code fontSize="small" />
                            <Typography variant="body2">
                                <b>Aadhar No:</b> {student.aadharNumber || 'Not specified'}
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

            {/* ================= RIGHT : DETAILS ================= */}
            <Grid size={{ xs: 12, md: 8 }}>
                <Paper sx={{ p: 3 }} elevation={2}>
                    {/* ---------- PERSONAL ---------- */}
                    <Typography variant="h6" gutterBottom>
                        Personal Information
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <InfoItem icon={<Code fontSize="small" />} label="Student Code" value={student.studentCode} />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InfoItem icon={<Cake fontSize="small" />} label="Date of Birth" value={formatDate(student.dateOfBirth)} />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InfoItem icon={<Person fontSize="small" />} label="Gender" value={student.gender || 'Not specified'} />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InfoItem icon={<School fontSize="small" />} label="Status" value={student.isActive ? 'Active' : 'Inactive'} />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InfoItem icon={<FamilyRestroom fontSize="small" />} label="Father Name" value={student.fatherName} />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InfoItem icon={<FamilyRestroom fontSize="small" />} label="Mother Name" value={student.motherName} />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InfoItem icon={<Work fontSize="small" />} label="Father Occupation" value={student.fathersOccupation} />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InfoItem icon={<Category fontSize="small" />} label="Reservation Category" value={student.resevationCategory} />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InfoItem label="Alternate Mobile" value={student.mobileNumber2} />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InfoItem label="Age" value={student.age} />
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    {/* ---------- SYSTEM ---------- */}
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
                            <InfoItem label="Created On" value={formatDate(student.createdAt)} />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <InfoItem label="Last Updated" value={student.updatedAt ? formatDate(student.updatedAt) : 'Never'} />
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    );
}

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
                {value ?? 'Not specified'}
            </Typography>
        </Box>
    );
}
