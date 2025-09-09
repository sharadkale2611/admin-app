// src/app/(protected)/staff/[id]/page.tsx
'use client'
import React from 'react';
import { useParams } from 'next/navigation';
import {
    Container,
    Typography,
    Card,
    CardContent,
    Chip,
    Button,
    Box,
    Avatar,
    Paper,
    Grid,
    Skeleton,
    Alert,
    Divider,
    Stack
} from '@mui/material';
import Link from 'next/link';
import { ArrowBack, Edit, Email, Phone, Person, Cake, Work, Event, AttachMoney } from '@mui/icons-material';
import { useStaffDetailsViewModel } from '@/lib/features/staff/useStaffDetailsViewModel';

export default function StaffDetails() {
    const { id } = useParams();
    const { staff, isLoading, error } = useStaffDetailsViewModel(id as string);

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Not specified';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    if (isLoading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Skeleton variant="rectangular" width="100%" height={400} />
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
                <Link href="/staff" passHref>
                    <Button startIcon={<ArrowBack />} variant="outlined">
                        Back to Staff List
                    </Button>
                </Link>
            </Container>
        );
    }

    if (!staff) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Alert severity="warning" sx={{ mb: 2 }}>
                    Staff member not found
                </Alert>
                <Link href="/staff" passHref>
                    <Button startIcon={<ArrowBack />} variant="outlined">
                        Back to Staff List
                    </Button>
                </Link>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Header Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Link href="/staff" passHref>
                        <Button startIcon={<ArrowBack />} variant="outlined" size="small">
                            Back
                        </Button>
                    </Link>
                    <Typography variant="h4" component="h1">
                        Staff Details
                    </Typography>
                </Box>
                <Chip
                    label={staff.isActive ? 'Active' : 'Inactive'}
                    color={staff.isActive ? 'success' : 'error'}
                    variant="filled"
                />
            </Box>

            <Grid container spacing={3}>
                {/* Profile Card */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 3, textAlign: 'center' }} elevation={2}>
                        <Avatar
                            sx={{
                                width: 100,
                                height: 100,
                                margin: 'auto',
                                mb: 2,
                                fontSize: '2rem',
                                bgcolor: 'primary.main'
                            }}
                        >
                            {staff.firstName?.charAt(0)}{staff.lastName?.charAt(0)}
                        </Avatar>

                        <Typography variant="h5" gutterBottom>
                            {staff.firstName} {staff.lastName}
                        </Typography>

                        <Typography variant="body1" color="primary" gutterBottom>
                            {staff.position || 'No position specified'}
                        </Typography>

                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            {staff.department || 'No department specified'}
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <Stack spacing={1} alignItems="flex-start">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Email fontSize="small" color="action" />
                                <Typography variant="body2">{staff.email}</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Phone fontSize="small" color="action" />
                                <Typography variant="body2">{staff.mobileNumber}</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Person fontSize="small" color="action" />
                                <Typography variant="body2">@{staff.userName}</Typography>
                            </Box>
                        </Stack>

                        <Box sx={{ mt: 3 }}>
                            <Link href={`/staff/${id}/edit`} passHref>
                                <Button variant="contained" startIcon={<Edit />} fullWidth>
                                    Edit Profile
                                </Button>
                            </Link>
                        </Box>
                    </Paper>
                </Grid>

                {/* Details Card */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Card elevation={2}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                                Professional Information
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <Work fontSize="small" color="primary" />
                                        <Typography variant="subtitle2">Position</Typography>
                                    </Box>
                                    <Typography variant="body1">
                                        {staff.position || 'Not specified'}
                                    </Typography>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <Work fontSize="small" color="primary" />
                                        <Typography variant="subtitle2">Department</Typography>
                                    </Box>
                                    <Typography variant="body1">
                                        {staff.department || 'Not specified'}
                                    </Typography>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <AttachMoney fontSize="small" color="primary" />
                                        <Typography variant="subtitle2">Salary</Typography>
                                    </Box>
                                    <Typography variant="body1">
                                        {staff.salary ? formatCurrency(staff.salary) : 'Not specified'}
                                    </Typography>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <Event fontSize="small" color="primary" />
                                        <Typography variant="subtitle2">Hire Date</Typography>
                                    </Box>
                                    <Typography variant="body1">
                                        {formatDate(staff.hireDate)}
                                    </Typography>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <Cake fontSize="small" color="primary" />
                                        <Typography variant="subtitle2">Date of Birth</Typography>
                                    </Box>
                                    <Typography variant="body1">
                                        {formatDate(staff.dateOfBirth)}
                                    </Typography>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <Person fontSize="small" color="primary" />
                                        <Typography variant="subtitle2">Gender</Typography>
                                    </Box>
                                    <Typography variant="body1">
                                        {staff.gender === 'M' ? 'Male' : staff.gender === 'F' ? 'Female' : 'Other'}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 3 }} />

                            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                                System Information
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Staff ID
                                    </Typography>
                                    <Typography variant="body2">{staff.staffId}</Typography>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        User ID
                                    </Typography>
                                    <Typography variant="body2">{staff.userId}</Typography>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Created
                                    </Typography>
                                    <Typography variant="body2">{formatDate(staff.createdAt)}</Typography>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Last Updated
                                    </Typography>
                                    <Typography variant="body2">
                                        {staff.updatedAt ? formatDate(staff.updatedAt) : 'Never'}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}