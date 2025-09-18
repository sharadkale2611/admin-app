'use client'
import React from 'react';
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
    CircularProgress,
    Card,
    CardContent
} from '@mui/material';
import { Save, Cancel, AttachMoney } from '@mui/icons-material';
import Link from 'next/link';
import { useCreateCourseFeeViewModel } from '@/lib/features/fees/useCreateCourseFeeViewModel';

export default function CreateCourseFee() {
    const {
        formData,
        totalFee,
        isSubmitting,
        error,
        courses,
        coursesLoading,
        coursesError,
        handleChange, 
        handleSelectChange,
        handleNumberChange,
        handleSubmit
    } = useCreateCourseFeeViewModel();

    return (
        <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Create Course Fee Structure
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {coursesError && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    Failed to load courses: {coursesError}
                </Alert>
            )}

            <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0' }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/* Course Selection */}
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="subtitle1" sx={{ mb: 1, color: 'text.secondary' }}>
                                Course Information
                            </Typography>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <FormControl fullWidth size="small" disabled={isSubmitting || coursesLoading}>
                                <InputLabel>Course *</InputLabel>
                                <Select
                                    label="Course *"
                                    name="courseId"
                                    value={formData.courseId}
                                    onChange={handleSelectChange}
                                    required
                                    disabled={coursesLoading}
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
                            {coursesLoading && (
                                <Typography variant="caption" sx={{ mt: 0.5, color: 'text.secondary' }}>
                                    Loading courses...
                                </Typography>
                            )}
                        </Grid>

                        {/* Fee Details */}
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="subtitle1" sx={{ mb: 1, color: 'text.secondary' }}>
                                Fee Structure
                            </Typography>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
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
                                placeholder="0.00"
                            />
                        </Grid>

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
                                placeholder="0.00"
                            />
                        </Grid>

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
                                helperText="Number of installments (1-12)"
                            />
                        </Grid>

                        {/* Optional Branch Selection */}
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Branch ID (Optional)"
                                name="branchId"
                                type="number"
                                value={formData.branchId || ''}
                                onChange={handleNumberChange}
                                size="small"
                                InputProps={{ inputProps: { min: 0 } }}
                                disabled={isSubmitting}
                                placeholder="Leave empty for all branches"
                                helperText="Specific branch ID or leave empty for all branches"
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
                                                ₹{formData.feeAmount.toLocaleString('en-IN')}
                                            </Typography>
                                        </Grid>

                                        <Grid size={{ xs: 6 }}>
                                            <Typography variant="body2">GST ({formData.gstPercentage}%):</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6 }} sx={{ textAlign: 'right' }}>
                                            <Typography variant="body2">
                                                ₹{(formData.feeAmount * formData.gstPercentage / 100).toLocaleString('en-IN')}
                                            </Typography>
                                        </Grid>

                                        <Grid size={{ xs: 6 }}>
                                            <Typography variant="body1" fontWeight="bold">
                                                Total Fee:
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6 }} sx={{ textAlign: 'right' }}>
                                            <Typography variant="body1" fontWeight="bold" color="primary">
                                                ₹{totalFee.toLocaleString('en-IN')}
                                            </Typography>
                                        </Grid>

                                        <Grid size={{ xs: 6 }}>
                                            <Typography variant="body2">Installments:</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6 }} sx={{ textAlign: 'right' }}>
                                            <Typography variant="body2">
                                                {formData.totalInstallments}
                                            </Typography>
                                        </Grid>

                                        {formData.totalInstallments > 1 && (
                                            <>
                                                <Grid size={{ xs: 6 }}>
                                                    <Typography variant="body2">Per Installment:</Typography>
                                                </Grid>
                                                <Grid size={{ xs: 6 }} sx={{ textAlign: 'right' }}>
                                                    <Typography variant="body2">
                                                        ₹{(totalFee / formData.totalInstallments).toLocaleString('en-IN')}
                                                    </Typography>
                                                </Grid>
                                            </>
                                        )}
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Action Buttons */}
                        <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Link href="/fees" passHref>
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
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    startIcon={<Save />}
                                    size="small"
                                    disabled={isSubmitting || formData.courseId <= 0 || formData.feeAmount <= 0 || coursesLoading}
                                >
                                    {isSubmitting ? 'Creating...' : 'Create Fee Structure'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
}