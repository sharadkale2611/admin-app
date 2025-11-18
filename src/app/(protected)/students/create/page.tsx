    'use client'
    import React, { useState } from 'react';
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
        Snackbar
    } from '@mui/material';
    import { Save, Cancel } from '@mui/icons-material';
    import Link from 'next/link';
    import useCreateStudentViewModel from '@/lib/features/student/useCreateStudentViewModel';
    import { ApiError } from '@/lib/features/student/studentTypes';

    // Map field names to friendly labels
    const fieldLabels: Record<string, string> = {
        userName: "Username",
        password: "Password",
        email: "Email",
        mobileNumber: "Mobile Number",
        studentCode: "Student Code",
        firstName: "First Name",
        lastName: "Last Name",
        dateOfBirth: "Date of Birth",
        gender: "Gender",

        // API PascalCase
        UserName: "Username",
        Password: "Password",
        Email: "Email",
        MobileNumber: "Mobile Number",
        StudentCode: "Student Code",
        FirstName: "First Name",
        LastName: "Last Name",
        DateOfBirth: "Date of Birth",
        Gender: "Gender",
    };


    // Transform system or regex error messages to user-friendly ones
    function transformErrorMessage(field: string, message: string): string {



        if (field.toLowerCase() === "mobilenumber") {
            if (message.includes("regular expression")) {
                return "Mobile Number must be exactly 10 digits.";
            }
        }

        if (field.toLowerCase() === "email") {
            if (message.includes("not a valid email")) {
                return "Please enter a valid email address.";
            }
        }

        if (field.toLowerCase() === "password") {
            if (message.includes("required") || message.includes("length")) {
                return "Password must meet the required length and complexity.";
            }
        }
        return message;
    }

    // Render errors with heading + list
    function renderErrorContent(error: ApiError | null) {
        if (!error) return null;

        return (
            <div className="text-red-600">
                {error.error && <h4 className="font-semibold mb-2">{error.error}</h4>}
                
                {error.errors && (
                    <ul className="list-disc list-inside space-y-1">
                        {Object.entries(error.errors).map(([field, messages]) =>
                            messages.map((msg, i) => (
                                <li key={`${field}-${i}`}>
                                    <strong>{fieldLabels[field] || field}:</strong>{" "}
                                    {transformErrorMessage(field, msg)}
                                </li>
                            ))
                        )}
                    </ul>
                )}
            </div>
        );
    }

    export default function CreateStudent() {
        const {
            formData,
            isSubmitting,
            error,
            handleChange,
            handleSelectChange,
            handleSubmit
        } = useCreateStudentViewModel();

        

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<
      "success" | "error"
    >("success");

    const handleSnackbarClose = () => setSnackbarOpen(false);



        return (
            <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                    Create New Student
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {renderErrorContent(error)}
                    </Alert>
                )}

                <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0' }}>
                    <form onSubmit={async (e) => {
            const result = await handleSubmit(e);

            if (result?.success) {
              setSnackbarMessage(result.message);
              setSnackbarSeverity("success");
              setSnackbarOpen(true);

              setTimeout(() => {
                window.location.href = "/students";
              }, 1500);
            }
          }}>
                        <Grid container spacing={2}>
                            {/* User Account Section */}
                            <Grid  size={{xs:12}}>
                                <Typography variant="subtitle1" sx={{ mb: 1, color: 'text.secondary' }}>
                                    Account Information
                                </Typography>
                            </Grid>

                            <Grid size={{ xs: 12, sm:6 }}>
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

                            <Grid size={{ xs: 12, sm:6 }}>
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

                            <Grid size={{ xs: 12, sm:6 }}>
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

                            <Grid size={{ xs: 12, sm:6 }}>
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

                            {/* Student Information Section */}
                            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
                                <Typography variant="subtitle1" sx={{ mb: 1, color: 'text.secondary' }}>
                                    Student Details
                                </Typography>
                            </Grid>

                            <Grid size={{ xs: 12, sm:6 }}>
                                <TextField
                                    fullWidth
                                    label="Student Code"
                                    name="studentCode"
                                    value={formData.studentCode}
                                    onChange={handleChange}
                                    required
                                    size="small"
                                    disabled={isSubmitting}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm:6 }}>
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

                            <Grid size={{ xs: 12, sm:6 }}>
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

                            <Grid size={{ xs: 12, sm:6 }}>
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

                            <Grid size={{ xs: 12, sm:6 }}>
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
                                    <Link href="/students" passHref>
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
                                        {isSubmitting ? 'Creating...' : 'Create Student'}
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>

 {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

            </Container>
        );
    }
