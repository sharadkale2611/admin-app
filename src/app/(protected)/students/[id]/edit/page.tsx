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
    FormControlLabel,
    Checkbox,
    Skeleton
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import useEditStudentViewModel from '@/lib/features/student/useEditStudentViewModel';

export default function EditStudent() {
    const { id } = useParams();
    const {
        formData,
        isSubmitting,
        error,
        loading,
        handleChange,
        handleSelectChange,
        handleCheckboxChange,
        handleSubmit
    } = useEditStudentViewModel();

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
                <Skeleton variant="text" width={300} height={40} />
                <Skeleton variant="rectangular" width="100%" height={400} sx={{ mt: 2 }} />
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Edit Student
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0' }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {/* User Account Section */}
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="subtitle1" sx={{ mb: 1, color: 'text.secondary' }}>
                                Account Information
                            </Typography>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Username"
                                name="userName"
                                value={formData.userName}
                                onChange={handleChange}
                                required
                                size="small"
                                disabled={isSubmitting}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                size="small"
                                disabled={isSubmitting}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Mobile Number"
                                name="mobileNumber"
                                value={formData.mobileNumber}
                                onChange={handleChange}
                                size="small"
                                disabled={isSubmitting}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="isActive"
                                        checked={formData.isActive}
                                        onChange={handleCheckboxChange}
                                        disabled={isSubmitting}
                                    />
                                }
                                label="Active Status"
                            />
                        </Grid>

                        {/* Student Information Section */}
                        <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
                            <Typography variant="subtitle1" sx={{ mb: 1, color: 'text.secondary' }}>
                                Student Details
                            </Typography>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="First Name"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                size="small"
                                disabled={isSubmitting}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Last Name"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                size="small"
                                disabled={isSubmitting}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Date of Birth"
                                name="dateOfBirth"
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                size="small"
                                disabled={isSubmitting}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth size="small" disabled={isSubmitting}>
                                <InputLabel>Gender</InputLabel>
                                <Select
                                    label="Gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleSelectChange}
                                >
                                    <MenuItem value="M">Male</MenuItem>
                                    <MenuItem value="F">Female</MenuItem>
                                    <MenuItem value="O">Other</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Link href={`/students/${id}`} passHref>
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
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Updating...' : 'Update Student'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
}