// src/app/(protected)/courses/[id]/edit/page.tsx
'use client'
import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Container,
    Typography,
    Button,
    Box,
    Paper,
    Grid,
    Skeleton,
    Alert,
    Divider,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    FormControlLabel,
    FormHelperText,
    Snackbar
} from '@mui/material';
import Link from 'next/link';
import {
    ArrowBack,
    Save,
    School,
    Category,
    TrendingUp,
    Description,
    Numbers
} from '@mui/icons-material';
import { useCourseEditViewModel } from '@/lib/features/course/useCourseEditViewModel';
import { CourseLevel } from '@/lib/features/course/courseTypes';

export default function CourseEdit() {
    const { id } = useParams();
    const router = useRouter();
    const {
        course,
        formData,
        isLoading,
        error,
        isSubmitting,
        submitError,
        submitSuccess,
        isFormValid,
        handleInputChange,
        handleSubmit
    } = useCourseEditViewModel(id as string);

    // Redirect if course doesn't exist and we're not loading
    useEffect(() => {
        if (!isLoading && !course && !error) {
            router.push('/courses');
        }
    }, [isLoading, course, error, router]);

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
                        Back to Courses
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
                        Back to Courses
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
                    <Link href={`/courses/${id}`} passHref>
                        <Button startIcon={<ArrowBack />} variant="outlined" size="small">
                            Back to Details
                        </Button>
                    </Link>
                    <Typography variant="h4" component="h1">
                        Edit Course
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                    ID: {course.courseId}
                </Typography>
            </Box>

            {/* Success Snackbar */}
            <Snackbar
                open={submitSuccess}
                autoHideDuration={3000}
                message="Course updated successfully!"
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            />

            <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                    <Paper sx={{ p: 3 }} elevation={2}>
                        <form onSubmit={handleSubmit}>
                            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                                Course Information
                            </Typography>

                            {submitError && (
                                <Alert severity="error" sx={{ mb: 3 }}>
                                    {submitError}
                                </Alert>
                            )}

                            <Grid container spacing={3}>
                                {/* Course Name */}
                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        fullWidth
                                        label="Course Name"
                                        value={formData.courseName}
                                        onChange={(e) => handleInputChange('courseName', e.target.value)}
                                        required
                                        disabled={isSubmitting}
                                        InputProps={{
                                            startAdornment: <School sx={{ mr: 1, color: 'action.active' }} />
                                        }}
                                        error={!formData.courseName}
                                        helperText={!formData.courseName ? 'Course name is required' : ''}
                                    />
                                </Grid>

                                {/* Course Description */}
                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        fullWidth
                                        label="Course Description"
                                        value={formData.courseDescription}
                                        onChange={(e) => handleInputChange('courseDescription', e.target.value)}
                                        multiline
                                        rows={4}
                                        disabled={isSubmitting}
                                        InputProps={{
                                            startAdornment: <Description sx={{ mr: 1, color: 'action.active' }} />
                                        }}
                                    />
                                </Grid>

                                {/* Course Category ID */}
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Category ID"
                                        type="number"
                                        value={formData.courseCategoryId}
                                        onChange={(e) => handleInputChange('courseCategoryId', parseInt(e.target.value) || 0)}
                                        required
                                        disabled={isSubmitting}
                                        InputProps={{
                                            startAdornment: <Category sx={{ mr: 1, color: 'action.active' }} />,
                                            inputProps: { min: 1 }
                                        }}
                                        error={formData.courseCategoryId <= 0}
                                        helperText={formData.courseCategoryId <= 0 ? 'Valid category ID is required' : ''}
                                    />
                                </Grid>

                                {/* Course Level */}
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <FormControl fullWidth disabled={isSubmitting}>
                                        <InputLabel>Course Level</InputLabel>
                                        <Select
                                            value={formData.courseLevel}
                                            label="Course Level"
                                            onChange={(e) => handleInputChange('courseLevel', e.target.value as CourseLevel)}
                                        >
                                            <MenuItem value={CourseLevel.Beginner}>Beginner</MenuItem>
                                            <MenuItem value={CourseLevel.Intermediate}>Intermediate</MenuItem>
                                            <MenuItem value={CourseLevel.Expert}>Expert</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* Course Order */}
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Course Order"
                                        type="number"
                                        value={formData.courseOrder}
                                        onChange={(e) => handleInputChange('courseOrder', parseInt(e.target.value) || 1)}
                                        required
                                        disabled={isSubmitting}
                                        InputProps={{
                                            startAdornment: <Numbers sx={{ mr: 1, color: 'action.active' }} />,
                                            inputProps: { min: 1 }
                                        }}
                                        error={formData.courseOrder <= 0}
                                        helperText={formData.courseOrder <= 0 ? 'Valid order number is required' : ''}
                                    />
                                </Grid>

                                {/* Status */}
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={formData.status}
                                                onChange={(e) => handleInputChange('status', e.target.checked)}
                                                disabled={isSubmitting}
                                            />
                                        }
                                        label={formData.status ? 'Active' : 'Inactive'}
                                        sx={{
                                            mt: 2,
                                            '& .MuiFormControlLabel-label': {
                                                color: formData.status ? 'success.main' : 'text.secondary'
                                            }
                                        }}
                                    />
                                    <FormHelperText>
                                        {formData.status ? 'Course is visible to users' : 'Course is hidden from users'}
                                    </FormHelperText>
                                </Grid>

                                {/* Firm ID (if applicable) */}
                                {formData.firmId && (
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            fullWidth
                                            label="Firm ID"
                                            type="number"
                                            value={formData.firmId}
                                            onChange={(e) => handleInputChange('firmId', parseInt(e.target.value) || 0)}
                                            disabled={isSubmitting}
                                            InputProps={{
                                                inputProps: { min: 1 }
                                            }}
                                        />
                                    </Grid>
                                )}
                            </Grid>

                            <Divider sx={{ my: 3 }} />

                            {/* Action Buttons */}
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Link href={`/courses/${id}`} passHref>
                                    <Button variant="outlined" disabled={isSubmitting}>
                                        Cancel
                                    </Button>
                                </Link>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={isSubmitting || !isFormValid()}
                                    startIcon={<Save />}
                                >
                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </Box>
                        </form>
                    </Paper>
                </Grid>

                {/* Course Metadata */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 3 }} elevation={2}>
                        <Typography variant="h6" gutterBottom>
                            System Information
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 6 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Course ID
                                </Typography>
                                <Typography variant="body2">
                                    {course.courseId}
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Created
                                </Typography>
                                <Typography variant="body2">
                                    {new Date(course.createdAt).toLocaleDateString()}
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Last Updated
                                </Typography>
                                <Typography variant="body2">
                                    {course.updatedAt
                                        ? new Date(course.updatedAt).toLocaleDateString()
                                        : 'Never'
                                    }
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Category
                                </Typography>
                                <Typography variant="body2">
                                    {course.courseCategoryName}
                                </Typography>
                            </Grid>
                            {course.firmName && (
                                <Grid size={{ xs: 12 }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Firm
                                    </Typography>
                                    <Typography variant="body2">
                                        {course.firmName}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}