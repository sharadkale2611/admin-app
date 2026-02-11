'use client';

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
    Skeleton,
    Snackbar,
    InputAdornment
} from '@mui/material';
import { Save, Cancel, Lock } from '@mui/icons-material';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import useEditStaffViewModel from '@/lib/features/staff/useEditStaffViewModel';

export default function EditStaff() {
    const { id } = useParams();

    const {
        formData,
        errors,
        isSubmitting,
        error,
        loading,
        snackbar,
        setSnackbar,
        handleChange,
        handleSelectChange,
        handleCheckboxChange,
        handleSubmit
    } = useEditStaffViewModel();

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
                <Skeleton variant="text" width={300} height={40} />
                <Skeleton variant="rectangular" width="100%" height={420} sx={{ mt: 2 }} />
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Edit Staff Member
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0' }}>
                <form onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={2}>

                        {/* ================= Account Information ================= */}
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="subtitle1" color="text.secondary">
                                Account Information
                            </Typography>
                        </Grid>

                        {/* Username (READONLY) */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Username"
                                name="userName"
                                value={formData.userName}
                                size="small"
                                InputProps={{
                                    readOnly: true,
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Lock fontSize="small" color="disabled" />
                                        </InputAdornment>
                                    )
                                }}
                                sx={{
                                    backgroundColor: '#f5f5f5',
                                    cursor: 'not-allowed'
                                }}
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
                                error={!!errors.email}
                                helperText={errors.email}
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
                                error={!!errors.mobileNumber}
                                helperText={errors.mobileNumber}
                                required
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

                        {/* ================= Staff Details ================= */}
                        <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
                            <Typography variant="subtitle1" color="text.secondary">
                                Staff Details
                            </Typography>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="First Name"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                error={!!errors.firstName}
                                helperText={errors.firstName}
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
                                error={!!errors.lastName}
                                helperText={errors.lastName}
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
                                error={!!errors.dateOfBirth}
                                helperText={errors.dateOfBirth}
                                InputLabelProps={{ shrink: true }}
                                required
                                size="small"
                                disabled={isSubmitting}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth size="small" error={!!errors.gender}>
                                <InputLabel>Gender</InputLabel>
                                <Select
                                    label="Gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleSelectChange}
                                    disabled={isSubmitting}
                                >
                                    <MenuItem value="M">Male</MenuItem>
                                    <MenuItem value="F">Female</MenuItem>
                                    <MenuItem value="O">Other</MenuItem>
                                </Select>
                                {errors.gender && (
                                    <Typography variant="caption" color="error">
                                        {errors.gender}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>

                        {/* Position (READONLY) */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Position"
                                name="position"
                                value={formData.position}
                                size="small"
                                InputProps={{ readOnly: true }}
                                sx={{ backgroundColor: '#f0f0f0' }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Department"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                error={!!errors.department}
                                helperText={errors.department}
                                required
                                size="small"
                                disabled={isSubmitting}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Hire Date"
                                name="hireDate"
                                type="date"
                                value={formData.hireDate}
                                onChange={handleChange}
                                error={!!errors.hireDate}
                                helperText={errors.hireDate}
                                InputLabelProps={{ shrink: true }}
                                required
                                size="small"
                                disabled={isSubmitting}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Salary"
                                name="salary"
                                type="number"
                                value={formData.salary}
                                onChange={handleChange}
                                error={!!errors.salary}
                                helperText={errors.salary}
                                InputProps={{ inputProps: { min: 0 } }}
                                required
                                size="small"
                                disabled={isSubmitting}
                            />
                        </Grid>

                        {/* ================= Actions ================= */}
                        <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Link href={`/staff/${id}`}>
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
                                    startIcon={<Save />}
                                    size="small"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Updating...' : 'Update Staff'}
                                </Button>
                            </Box>
                        </Grid>

                    </Grid>
                </form>
            </Paper>

            {/* ================= Snackbar ================= */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}   // ⏱ auto close after 4s
                onClose={() =>
                    setSnackbar(prev => ({ ...prev, open: false }))
                }
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
            >
                <Alert
                    severity={snackbar.severity}
                    variant="filled"
                    onClose={() =>
                        setSnackbar(prev => ({ ...prev, open: false }))
                    }
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}