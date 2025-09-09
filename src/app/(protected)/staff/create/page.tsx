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
    Alert
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import Link from 'next/link';
import useCreateStaffViewModel from '@/lib/features/staff/createStaffViewModel';

export default function CreateStaff() {
    const {
        formData,
        isSubmitting,
        error,
        handleChange,
        handleSelectChange,
        handleSubmit
    } = useCreateStaffViewModel();

    return (
        <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Create New Staff Member
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
                        <Grid  size={{ xs: 12 }}>
                            <Typography variant="subtitle1" sx={{ mb: 1, color: 'text.secondary' }}>
                                Account Information
                            </Typography>
                        </Grid>

                        <Grid  size={{ xs: 12, sm: 6 }}>
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

                        <Grid  size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                size="small"
                                disabled={isSubmitting}
                            />
                        </Grid>

                        <Grid  size={{ xs: 12, sm: 6 }}>
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

                        <Grid  size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Mobile Number"
                                name="mobileNumber"
                                value={formData.mobileNumber}
                                onChange={handleChange}
                                required
                                size="small"
                                disabled={isSubmitting}
                            />
                        </Grid>

                        {/* Staff Information Section */}
                        <Grid  size={{ xs: 12 }} sx={{ mt: 2 }}>
                            <Typography variant="subtitle1" sx={{ mb: 1, color: 'text.secondary' }}>
                                Staff Details
                            </Typography>
                        </Grid>

                        <Grid  size={{ xs: 12, sm: 6 }}>
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

                        <Grid  size={{ xs: 12, sm: 6 }}>
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

                        <Grid  size={{ xs: 12, sm: 6 }}>
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

                        <Grid  size={{ xs: 12, sm: 6 }}>
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

                        <Grid  size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Position"
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                required
                                size="small"
                                disabled={isSubmitting}
                            />
                        </Grid>

                        <Grid  size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Department"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                size="small"
                                disabled={isSubmitting}
                            />
                        </Grid>

                        <Grid  size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Hire Date"
                                name="hireDate"
                                type="date"
                                value={formData.hireDate}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                required
                                size="small"
                                disabled={isSubmitting}
                            />
                        </Grid>

                        <Grid  size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Salary"
                                name="salary"
                                type="number"
                                value={formData.salary}
                                onChange={handleChange}
                                size="small"
                                InputProps={{ inputProps: { min: 0 } }}
                                disabled={isSubmitting}
                            />
                        </Grid>

                        <Grid  size={{ xs: 12 }} sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Link href="/staff" passHref>
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
                                    {isSubmitting ? 'Creating...' : 'Create Staff'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
}