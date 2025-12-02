    "use client";

    import React, { useState, useEffect } from "react";
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
    Snackbar,
    CircularProgress,
    } from "@mui/material";

    import { Save, Cancel } from "@mui/icons-material";
    import Link from "next/link";

    import useCreateStudentBatchAssignmentViewModel from "@/lib/features/studentBatchAssignment/useCreateStudentBatchAssignmentViewModel";
    import { ApiError } from "@/lib/features/studentBatchAssignment/studentBatchAssignmentTypes";

    import api from "@/lib/services/apiService";


    // ------------------------------------------------------------
    // Error helpers (REUSED from your student form)
    // ------------------------------------------------------------

    const fieldLabels: Record<string, string> = {
    studentEnrollmentId: "Enrollment",
    batchId: "Batch",
    assignmentDate: "Assignment Date",
    assignmentType: "Assignment Type",
    remark: "Remark",
    isActive: "Status",
    };

    function transformErrorMessage(field: string, message: string): string {
    return message;
    }

    function renderErrorContent(error: ApiError | null) {
    if (!error) return null;

    return (
        <div className="text-red-600">
        {error.error && <h4 className="font-semibold mb-2">{error.error}</h4>}

        {Array.isArray(error.errors) && (
            <ul className="list-disc list-inside space-y-1">
            {error.errors.map((msg, i) => (
                <li key={i}>{msg}</li>
            ))}
            </ul>
        )}
        </div>
    );
    }


    // ------------------------------------------------------------
    // MAIN COMPONENT — Create Student Batch Assignment Page
    // ------------------------------------------------------------
    export default function CreateStudentBatchAssignment() {
    const {
        formData,
        isSubmitting,
        error,
        handleChange,
        handleSelectChange,
        handleNumberChange,
        handleSubmit,
    } = useCreateStudentBatchAssignmentViewModel();

    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [batches, setBatches] = useState<any[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] =
        useState<"success" | "error">("success");

    const handleSnackbarClose = () => setSnackbarOpen(false);


    // ------------------------------------------------------------
    // FETCH DROPDOWN DATA
    // ------------------------------------------------------------
    useEffect(() => {
        async function fetchDropdowns() {
        try {
            const [enrollmentRes, batchRes] = await Promise.all([
            api.get("/Enrollments"),
            api.get("/Batches"),
            
            ]);

                
            setEnrollments(enrollmentRes.data || []);
            setBatches(batchRes.data || []);
        } catch (err) {
            console.error("Dropdown load failed:", err);
        } finally {
            setLoadingData(false);
        }
        }

        fetchDropdowns();
    }, []);


    // ------------------------------------------------------------
    // SUBMIT HANDLER WITH SNACKBAR
    // ------------------------------------------------------------
    const onSubmit = async (e: React.FormEvent) => {
        const result = await handleSubmit(e);

        if (result?.success) {
        setSnackbarMessage(result.message);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        setTimeout(() => {
            window.location.href = "/studentBatchAssignments";
        }, 1500);
        }
    };


    return (
        <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            Create Student Batch Assignment
        </Typography>

        {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
            {renderErrorContent(error)}
            </Alert>
        )}

        <Paper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0" }}>
            <form onSubmit={onSubmit}>
            <Grid container spacing={2}>
                {/* ---------------------------------------------------------------- */}
                {/* Enrollment Dropdown */}
                {/* ---------------------------------------------------------------- */}
                <Grid size={{xs:12, sm:6}}>
                <FormControl fullWidth size="small" disabled={isSubmitting || loadingData}>
                    <InputLabel>Enrollment</InputLabel>
                    <Select
                    label="Enrollment"
                    name="studentEnrollmentId"
                    value={formData.studentEnrollmentId}
                    onChange={(e) =>
                        handleNumberChange("studentEnrollmentId", Number(e.target.value))
                    }
                    >
                    {loadingData ? (
                        <MenuItem disabled>
                        <CircularProgress size={20} />
                        </MenuItem>
                    ) : (
                        enrollments.map((enr) => (
                        <MenuItem
                            key={enr.studentEnrollmentId}
                            value={enr.studentEnrollmentId}
                        >
                            {enr.studentName}
                        </MenuItem>
                        ))
                    )}
                    </Select>
                </FormControl>
                </Grid>

                {/* ---------------------------------------------------------------- */}
                {/* Batch Dropdown */}
                {/* ---------------------------------------------------------------- */}
                <Grid size={{xs:12, sm:6}}>
                <FormControl fullWidth size="small" disabled={isSubmitting || loadingData}>
                    <InputLabel>Batch</InputLabel>
                    <Select
                    label="Batch"
                    name="batchId"
                    value={formData.batchId}
                    onChange={(e) =>
                        handleNumberChange("batchId", Number(e.target.value))
                    }
                    >
                    {loadingData ? (
                        <MenuItem disabled>
                        <CircularProgress size={20} />
                        </MenuItem>
                    ) : (
                        batches.map((batch) => (
                        <MenuItem key={batch.batchId} value={batch.batchId}>
                            {batch.batchCode}
                        </MenuItem>
                        ))
                    )}
                    </Select>
                </FormControl>
                </Grid>

                {/* ---------------------------------------------------------------- */}
                {/* Assignment Date */}
                {/* ---------------------------------------------------------------- */}
                <Grid size={{xs:12, sm:6}}>
                <TextField
                    fullWidth
                    label="Assignment Date"
                    name="assignmentDate"
                    type="date"
                    value={formData.assignmentDate}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                    disabled={isSubmitting}
                />
                </Grid>

                {/* ---------------------------------------------------------------- */}
                {/* Assignment Type */}
                {/* ---------------------------------------------------------------- */}
                <Grid size={{xs:12, sm:6}}>
                <FormControl fullWidth size="small" disabled={isSubmitting}>
                    <InputLabel>Assignment Type</InputLabel>
                    <Select
                    label="Assignment Type"
                    name="assignmentType"
                    value={formData.assignmentType}
                    onChange={handleSelectChange}
                    >
                    <MenuItem value="fresh">Fresh</MenuItem>
                    <MenuItem value="merged">Merged</MenuItem>
                    </Select>
                </FormControl>
                </Grid>

                {/* ---------------------------------------------------------------- */}
                {/* Remark */}
                {/* ---------------------------------------------------------------- */}
                <Grid size={{xs:12}}>
                <TextField
                    fullWidth
                    label="Remark"
                    name="remark"
                    value={formData.remark || ""}
                    onChange={handleChange}
                    size="small"
                    multiline
                />
                </Grid>


                {/* ---------------------------------------------------------------- */}
                {/* Action Buttons */}
                {/* ---------------------------------------------------------------- */}
                <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
                <Box sx={{ display: "flex", gap: 2 }}>
                    <Link href="/studentBatchAssignments" passHref>
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
                    {isSubmitting ? "Creating..." : "Create Assignment"}
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
            <Alert severity={snackbarSeverity} variant="filled" sx={{ width: "100%" }}>
            {snackbarMessage}
            </Alert>
        </Snackbar>
        </Container>
    );
    }
