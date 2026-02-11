'use client';

import {
    Box,
    Card,
    CardContent,
    TextField,
    Typography,
    Button,
    Grid,
    FormControlLabel,
    RadioGroup,
    Radio,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import useEditStudentViewModel from '@/lib/features/student/useEditStudentViewModel';

/* =========================================================
   EDIT STUDENT PAGE – FULL FORM (NO PROFILE IMAGE)
   Matches ASP.NET Core Student + UpdateStudentDto
========================================================= */

export default function EditStudentPage() {
    const { id } = useParams();

    const {
        formData,
        isSubmitting,
        loading,
        error,
        handleChange,
        handleSelectChange,
        handleCheckboxChange,
        handleSubmit,
    } = useEditStudentViewModel();

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{ backgroundColor: 'white', p: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
                Edit Student
            </Typography>

            <Card variant="outlined">
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        {/* ================= BASIC DETAILS ================= */}
                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                            Basic Details
                        </Typography>


                        <Grid container spacing={2} alignItems="center">
                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    label="First Name"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    fullWidth
                                    size="small"
                                    required
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    label="Last Name"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    fullWidth
                                    size="small"
                                    required
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    label="Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    fullWidth
                                    size="small"
                                    type="email"
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Gender *</InputLabel>
                                    <Select
                                        name="gender"
                                        value={formData.gender}
                                        label="Gender *"
                                        onChange={handleSelectChange}
                                    >
                                        {['Male', 'Female', 'Other'].map((g) => (
                                            <MenuItem key={g} value={g}>
                                                {g}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    label="Aadhar Number"
                                    name="aadharNumber"
                                    value={formData.aadharNumber}
                                    onChange={handleChange}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                        </Grid>



                        <Divider sx={{ my: 2 }} />

                        {/* ================= PARENT & CONTACT ================= */}
                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                            Parent & Contact Details
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    label="Father Name"
                                    name="fatherName"
                                    value={formData.fatherName}
                                    onChange={handleChange}
                                    fullWidth
                                    size="small"
                                    required
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    label="Mother Name"
                                    name="motherName"
                                    value={formData.motherName}
                                    onChange={handleChange}
                                    fullWidth
                                    size="small"
                                    required
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    label="Mobile Number"
                                    name="mobileNumber1"
                                    value={formData.mobileNumber1}
                                    onChange={handleChange}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    label="Alternate Mobile"
                                    name="mobileNumber2"
                                    value={formData.mobileNumber2}
                                    onChange={handleChange}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Father Occupation</InputLabel>
                                    <Select
                                        name="fathersOccupation"
                                        value={formData.fathersOccupation}
                                        label="Father Occupation"
                                        onChange={handleSelectChange}
                                    >
                                        {['Business', 'Service', 'Farmer', 'Other'].map((o) => (
                                            <MenuItem key={o} value={o}>
                                                {o}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 2 }} />

                        {/* ================= ACADEMIC / OTHER ================= */}
                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                            Other Details
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    label="Date of Birth"
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    fullWidth
                                    size="small"
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Reservation Category</InputLabel>
                                    <Select
                                        name="resevationCategory"
                                        value={formData.resevationCategory}
                                        label="Reservation Category"
                                        onChange={handleSelectChange}
                                    >
                                        {['Open', 'OBC', 'SC', 'ST', 'VJNT', 'EWS'].map((c) => (
                                            <MenuItem key={c} value={c}>
                                                {c}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    label="WhatsApp Number"
                                    name="whatsappNumber"
                                    value={formData.whatsappNumber}
                                    onChange={handleChange}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="isActive"
                                            checked={formData.isActive}
                                            onChange={handleCheckboxChange}
                                        />
                                    }
                                    label="Active"
                                />
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 3 }} />

                        {/* ================= ACTIONS ================= */}
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Link href={`/students/${id}`}>
                                <Button
                                    variant="outlined"
                                    startIcon={<Cancel />}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                            </Link>

                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={<Save />}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Updating...' : 'Update Student'}
                            </Button>
                        </Box>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
}
