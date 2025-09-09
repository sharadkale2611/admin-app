// src/app/(protected)/courses/[id]/page.tsx
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
    Paper,
    Grid,
    Skeleton,
    Alert,
    Divider,
    Stack,
    Avatar
} from '@mui/material';
import Link from 'next/link';
import {
    ArrowBack,
    Edit,
    Category,
    School,
    Description,
    TrendingUp,
    CalendarToday,
    Update,
    Business,
    CheckCircle,
    Cancel
} from '@mui/icons-material';
import { useCourseDetailsViewModel } from '@/lib/features/course/useCourseDetailsViewModel';

export default function CourseDetails() {
    const { id } = useParams();
    const { course, isLoading, error } = useCourseDetailsViewModel(id as string);

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return 'Not specified';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'Beginner': return 'success';
            case 'Intermediate': return 'warning';
            case 'Expert': return 'error';
            default: return 'default';
        }
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
                <Link href="/courses" passHref>
                    <Button startIcon={<ArrowBack />} variant="outlined">
                        Back to Courses List
                    </Button>
                </Link>
            </Container>
        );
    }

    if (!course) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Alert severity="warning" sx={{ mb: 2 }}>
                    Course not found
                </Alert>
                <Link href="/courses" passHref>
                    <Button startIcon={<ArrowBack />} variant="outlined">
                        Back to Courses List
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
                    <Link href="/courses" passHref>
                        <Button startIcon={<ArrowBack />} variant="outlined" size="small">
                            Back
                        </Button>
                    </Link>
                    <Typography variant="h4" component="h1">
                        Course Details
                    </Typography>
                </Box>
                <Chip
                    label={course.status ? 'Active' : 'Inactive'}
                    color={course.status ? 'success' : 'error'}
                    variant="filled"
                    icon={course.status ? <CheckCircle /> : <Cancel />}
                />
            </Box>

            <Grid container spacing={3}>
                {/* Course Info Card */}
                <Grid size={{xs:12, md:8}}>
                    <Paper sx={{ p: 3 }} elevation={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60 }}>
                                <School sx={{ fontSize: 30 }} />
                            </Avatar>
                            <Box>
                                <Typography variant="h4" gutterBottom>
                                    {course.courseName}
                                </Typography>
                                <Chip
                                    label={course.courseLevel}
                                    color={getLevelColor(course.courseLevel) as any}
                                    variant="outlined"
                                    size="small"
                                />
                            </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                            Description
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph>
                            {course.courseDescription || 'No description available'}
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Category color="primary" />
                                    <Typography variant="subtitle2">Category</Typography>
                                </Box>
                                <Typography variant="body1">
                                    {course.courseCategoryName || 'Not specified'}
                                </Typography>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <TrendingUp color="primary" />
                                    <Typography variant="subtitle2">Level</Typography>
                                </Box>
                                <Typography variant="body1">
                                    {course.courseLevel}
                                </Typography>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Description color="primary" />
                                    <Typography variant="subtitle2">Order</Typography>
                                </Box>
                                <Typography variant="body1">
                                    {course.courseOrder}
                                </Typography>
                            </Grid>

                            {course.firmName && (
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <Business color="primary" />
                                        <Typography variant="subtitle2">Firm</Typography>
                                    </Box>
                                    <Typography variant="body1">
                                        {course.firmName}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </Paper>
                </Grid>

                {/* Actions & Metadata Card */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 3, textAlign: 'center' }} elevation={2}>
                        <Typography variant="h6" gutterBottom>
                            Course Actions
                        </Typography>

                        <Stack spacing={2} sx={{ mb: 3 }}>
                            <Link href={`/courses/${id}/edit`} passHref>
                                <Button variant="contained" startIcon={<Edit />} fullWidth>
                                    Edit Course
                                </Button>
                            </Link>
                            <Button variant="outlined" color="secondary" fullWidth>
                                View Modules
                            </Button>
                            <Button variant="outlined" fullWidth>
                                Manage Content
                            </Button>
                        </Stack>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="h6" gutterBottom>
                            System Information
                        </Typography>

                        <Stack spacing={1} alignItems="flex-start">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CalendarToday fontSize="small" color="action" />
                                <Typography variant="body2">
                                    Created: {formatDate(course.createdAt)}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Update fontSize="small" color="action" />
                                <Typography variant="body2">
                                    Updated: {course.updatedAt ? formatDate(course.updatedAt) : 'Never'}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2">
                                    Course ID: {course.courseId}
                                </Typography>
                            </Box>

                            {course.firmId && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="body2">
                                        Firm ID: {course.firmId}
                                    </Typography>
                                </Box>
                            )}

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2">
                                    Category ID: {course.courseCategoryId}
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}