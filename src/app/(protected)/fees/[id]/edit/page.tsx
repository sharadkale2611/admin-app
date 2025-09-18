// src/app/(protected)/fees/[id]/edit/page.tsx
'use client';
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
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Snackbar,
    Card,
    CardContent,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import Link from 'next/link';
import { useCourseFeesEditViewModel } from '@/lib/features/fees/useCourseFeesEditViewModel';

export default function CourseFeeEdit() {
    const { id } = useParams();
    const router = useRouter();

    const {
        currentCourseFee,
        formData,
        totalFee,
        isLoading,
        error,
        isSubmitting,
        submitError,
        submitSuccess,
        courses,
        coursesLoading,
        handleSelectChange,
        handleNumberChange,
        handleFetchCourseFeeById,
        handleUpdateCourseFee,
    } = useCourseFeesEditViewModel(id as string);

    // Load data on mount
    useEffect(() => {
        if (id) {
            handleFetchCourseFeeById(Number(id));
        }
    }, [id, handleFetchCourseFeeById]);

    // Redirect if not found
    useEffect(() => {
        if (!isLoading && !currentCourseFee && !error) {
            router.push('/fees');
        }
    }, [isLoading, currentCourseFee, error, router]);

    if (isLoading) {
        return (
            <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
                <Skeleton variant="rectangular" width="100%" height={400} />
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
                <Link href="/fees" passHref>
                    <Button startIcon={<ArrowBack />} variant="outlined">
                        Back to Fees
                    </Button>
                </Link>
            </Container>
        );
    }

    if (!currentCourseFee) {
        return (
            <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
                <Alert severity="warning" sx={{ mb: 2 }}>
                    Course fee not found
                </Alert>
                <Link href="/fees" passHref>
                    <Button startIcon={<ArrowBack />} variant="outlined">
                        Back to Fees
                    </Button>
                </Link>
            </Container>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleUpdateCourseFee(formData);
    };

    return (
        <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
            {/* Header Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Link href={`/fees/${id}`} passHref>
                        <Button startIcon={<ArrowBack />} variant="outlined" size="small">
                            Back to Details
                        </Button>
                    </Link>
                    <Typography variant="h5" component="h1">
                        Edit Course Fee
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                    ID: {currentCourseFee.courseFeeId}
                </Typography>
            </Box>

            {/* Success Snackbar */}
            <Snackbar
                open={submitSuccess}
                autoHideDuration={3000}
                message="Course fee updated successfully!"
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            />

            <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0' }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/* Course Selection */}
                        <Grid size={{xs:12}}>
                            <FormControl fullWidth size="small" disabled={isSubmitting || coursesLoading}>
                                <InputLabel>Course *</InputLabel>
                                <Select
                                    label="Course *"
                                    name="courseId"
                                    value={formData.courseId}
                                    onChange={handleSelectChange}
                                    required
                                    endAdornment={
                                        coursesLoading ? (
                                            <Box sx={{ display: 'flex', justifyContent: 'center', pr: 2 }}>
                                                <CircularProgress size={20} />
                                            </Box>
                                        ) : null
                                    }
                                >
                                    <MenuItem value={0}>
                                        <em>Select a course</em>
                                    </MenuItem>
                                    {courses.map((course) => (
                                        <MenuItem key={course.courseId} value={course.courseId}>
                                            {course.courseName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Fee Amount */}
                        <Grid size={{ xs: 12, sm:6 }}>
                            <TextField
                                fullWidth
                                label="Fee Amount (₹)"
                                name="feeAmount"
                                type="number"
                                value={formData.feeAmount}
                                onChange={handleNumberChange}
                                required
                                size="small"
                                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                                disabled={isSubmitting}
                            />
                        </Grid>

                        {/* GST Percentage */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="GST Percentage (%)"
                                name="gstPercentage"
                                type="number"
                                value={formData.gstPercentage}
                                onChange={handleNumberChange}
                                required
                                size="small"
                                InputProps={{ inputProps: { min: 0, max: 100, step: 0.01 } }}
                                disabled={isSubmitting}
                            />
                        </Grid>

                        {/* Total Installments */}
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Total Installments"
                                name="totalInstallments"
                                type="number"
                                value={formData.totalInstallments}
                                onChange={handleNumberChange}
                                required
                                size="small"
                                InputProps={{ inputProps: { min: 1, max: 12 } }}
                                disabled={isSubmitting}
                            />
                        </Grid>

                        {/* Optional Branch */}
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Branch ID (Optional)"
                                name="branchId"
                                type="number"
                                value={formData.branchId ?? ''}
                                onChange={handleNumberChange}
                                size="small"
                                InputProps={{ inputProps: { min: 0 } }}
                                disabled={isSubmitting}
                            />
                        </Grid>

                        {/* Summary Card */}
                        <Grid size={{ xs: 12 }}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Fee Summary
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 6 }}>
                                            <Typography variant="body2">Base Fee:</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6 }} sx={{ textAlign: 'right' }}>
                                            <Typography variant="body2">
                                                ₹{(formData.feeAmount ?? 0).toLocaleString('en-IN')}
                                            </Typography>
                                        </Grid>

                                        <Grid size={{ xs: 6 }}>
                                            <Typography variant="body2">GST ({formData.gstPercentage}%)</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6 }} sx={{ textAlign: 'right' }}>
                                            <Typography variant="body2">
                                                ₹{(((formData.feeAmount ?? 0) * (formData.gstPercentage ?? 0)) / 100).toLocaleString('en-IN')}
                                            </Typography>
                                        </Grid>

                                        <Grid size={{ xs: 6 }}>
                                            <Typography variant="body2" fontWeight="bold">
                                                Total Fee:
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6 }} sx={{ textAlign: 'right' }}>
                                            <Typography variant="body2" fontWeight="bold">
                                                ₹{totalFee.toLocaleString('en-IN')}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Buttons */}
                        <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <CircularProgress size={20} /> : 'Save'}
                            </Button>
                            <Link href="/fees" passHref>
                                <Button variant="outlined" disabled={isSubmitting}>
                                    Cancel
                                </Button>
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
}
