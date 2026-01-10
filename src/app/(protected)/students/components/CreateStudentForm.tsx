'use client';

import {
    Paper,
    Typography,
    Divider,
    Grid,
    TextField,
    Button,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    FormControlLabel,
    Alert
} from "@mui/material";
import { Save, Close } from "@mui/icons-material";

import useCreateStudentViewModel from "@/lib/features/student/useCreateStudentViewModel";
import { useRouter } from "next/navigation";

/* ---------------------------------------------
   Helper: get field error safely
---------------------------------------------- */
function getFieldError(
    error: any,
    fieldName: string
): string | undefined {
    if (!error?.errors) return undefined;

    // backend may send PascalCase
    const possibleKeys = [
        fieldName,
        fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
    ];

    for (const key of possibleKeys) {
        if (error.errors[key]?.length) {
            return error.errors[key][0];
        }
    }

    return undefined;
}

export default function CreateStudentForm({
    onCancel
}: {
    onCancel: () => void;
}) {
    const {
        formData,
        isSubmitting,
        error,
        handleChange,
        handleSelectChange,
        handleSubmit
    } = useCreateStudentViewModel();


    const router = useRouter();

    return (
        <Paper
            sx={{
                p: 3,
                position: "sticky",
                top: 80,
                border: "1px solid",
                borderColor: "divider"
            }}
        >
            <Typography variant="h6">Create Student</Typography>
            <Typography variant="body2" color="text.secondary">
                Add a new student to the system
            </Typography>

            {/* FORM LEVEL ERROR */}
            {error?.error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error.error}
                </Alert>
            )}

            <Divider sx={{ my: 2 }} />

            <form
                onSubmit={async (e) => {
                    const result = await handleSubmit(e);

                    if (result?.success && result.studentId) {
                        router.push(`/students/${result.studentId}`);
                    }
                }}
                noValidate
            >
                <Grid container spacing={2}>
                    {/* STUDENT DETAILS */}
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="subtitle2">Student Details</Typography>
                    </Grid>

                    <Grid size={{ xs: 6 }}>
                        <TextField
                            fullWidth
                            label="First Name"
                            name="firstName"
                            size="small"
                            required
                            value={formData.firstName}
                            onChange={handleChange}
                            error={!!getFieldError(error, "firstName")}
                            helperText={getFieldError(error, "firstName")}
                        />
                    </Grid>

                    <Grid size={{ xs: 6 }}>
                        <TextField
                            fullWidth
                            label="Last Name"
                            name="lastName"
                            size="small"
                            required
                            value={formData.lastName}
                            onChange={handleChange}
                            error={!!getFieldError(error, "lastName")}
                            helperText={getFieldError(error, "lastName")}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Mobile Number"
                            name="mobileNumber"
                            size="small"
                            required
                            inputProps={{ maxLength: 10 }}
                            value={formData.mobileNumber}
                            onChange={handleChange}
                            error={!!getFieldError(error, "mobileNumber")}
                            helperText={getFieldError(error, "mobileNumber")}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Email (optional)"
                            name="email"
                            size="small"
                            value={formData.email}
                            onChange={handleChange}
                            error={!!getFieldError(error, "email")}
                            helperText={getFieldError(error, "email")}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <FormControl
                            fullWidth
                            size="small"
                            error={!!getFieldError(error, "gender")}
                        >
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
                            {getFieldError(error, "gender") && (
                                <Typography
                                    variant="caption"
                                    color="error"
                                    sx={{ ml: 2, mt: 0.5 }}
                                >
                                    {getFieldError(error, "gender")}
                                </Typography>
                            )}
                        </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Date of Birth"
                            name="dateOfBirth"
                            type="date"
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            error={!!getFieldError(error, "dateOfBirth")}
                            helperText={getFieldError(error, "dateOfBirth")}
                        />
                    </Grid>

                    {/* INVITE OPTIONS */}
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="subtitle2">Login Access</Typography>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <FormControlLabel
                            control={<Checkbox defaultChecked />}
                            label="Send login details via SMS"
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <FormControlLabel
                            control={<Checkbox defaultChecked />}
                            label="Send login details via Email"
                        />
                    </Grid>

                    {/* ACTIONS */}
                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <Button
                                variant="outlined"
                                color="secondary"
                                startIcon={<Close />}
                                onClick={onCancel}
                                fullWidth
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={<Save />}
                                disabled={isSubmitting}
                                fullWidth
                            >
                                {isSubmitting ? "Creating..." : "Create Student"}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
}
