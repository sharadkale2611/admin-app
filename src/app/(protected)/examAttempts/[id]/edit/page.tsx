"use client";

import React, { useState } from "react";

import {
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    Box,
    Grid,
    Alert,
    Snackbar,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Skeleton,
} from "@mui/material";

import type { SelectChangeEvent } from "@mui/material/Select";

import {
    Save,
    Cancel,
} from "@mui/icons-material";

import Link from "next/link";

import useEditExamAttemptViewModel from "@/lib/features/examAttempt/useEditExamAttemptViewModel";


/* ===============================
   Error Renderer
================================ */

function renderErrorContent(error: any) {

    if (!error) return null;

    if (error.error) {

        return (
            <div>
                {error.error}
            </div>
        );

    }

    return null;

}


/* ===============================
   Page
================================ */

export default function EditExamAttemptPage() {

    const {

        formData,

        students,

        examPapers,

        loading,

        isSubmitting,

        error,

        handleChange,

        handleSubmit,

    } = useEditExamAttemptViewModel();


    /* Snackbar */

    const [snackbarOpen, setSnackbarOpen] =
        useState(false);

    const [snackbarMessage, setSnackbarMessage] =
        useState("");

    const [snackbarSeverity, setSnackbarSeverity] =
        useState<"success" | "error">("success");



    const handleStatusChange = (
        e: SelectChangeEvent
    ) => {

        const value = e.target.value;

        handleChange({
            target: {
                name: "status",
                value,
            },
        } as unknown as React.ChangeEvent<HTMLInputElement>);

    };


    if (loading) {

        return (

            <Container maxWidth="md" sx={{ mt: 3 }}>

                <Skeleton height={40} />

                <Skeleton height={200} />

            </Container>

        );

    }


    return (

        <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>


            <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: 600 }}
            >

                Edit Exam Attempt

            </Typography>


            {error && (

                <Alert severity="error" sx={{ mb: 2 }}>

                    {renderErrorContent(error)}

                </Alert>

            )}


            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    border: "1px solid #e0e0e0",
                }}
            >

                <form

                    onSubmit={async (e) => {

                        const result =
                            await handleSubmit(e);

                        if (result?.success) {

                            setSnackbarMessage(
                                result.message
                            );

                            setSnackbarSeverity(
                                "success"
                            );

                            setSnackbarOpen(true);


                            setTimeout(() => {

                                window.location.href =
                                    "/examAttempts";

                            }, 1500);

                        }

                    }}

                >

                    <Grid container spacing={2}>


                        {/* Section */}

                        <Grid size={{ xs: 12 }}>

                            <Typography
                                variant="subtitle1"
                                sx={{
                                    mb: 1,
                                    color: "text.secondary",
                                }}
                            >

                                Attempt Information

                            </Typography>

                        </Grid>



                        <Grid size={{ xs: 12 }}>

                            <FormControl fullWidth size="small">

                                <InputLabel>
                                    Student
                                </InputLabel>

                                <Select

                                    value={formData.studentId}

                                    label="Student"

                                    disabled

                                >

                                    {students.map((s: any) => (

                                        <MenuItem
                                            key={s.studentId}
                                            value={s.studentId}
                                        >

                                            #{s.studentId} — {s.firstName}

                                        </MenuItem>

                                    ))}

                                </Select>

                            </FormControl>

                        </Grid>



                        <Grid size={{ xs: 12 }}>

                            <FormControl fullWidth size="small">

                                <InputLabel>
                                    Exam Paper
                                </InputLabel>

                                <Select

                                    value={formData.examPaperId}

                                    label="Exam Paper"

                                    disabled

                                >

                                    {examPapers.map((e: any) => (

                                        <MenuItem
                                            key={e.examPaperId}
                                            value={e.examPaperId}
                                        >

                                            #{e.examPaperId} — {e.name}

                                        </MenuItem>

                                    ))}

                                </Select>

                            </FormControl>

                        </Grid>





                        {/* Status */}

                        <Grid size={{ xs: 12 }}>

                            <FormControl
                                fullWidth
                                size="small"
                            >

                                <InputLabel>
                                    Status
                                </InputLabel>

                                <Select

                                    name="status"

                                    value={formData.status}

                                    label="Status"

                                    onChange={
                                        handleStatusChange
                                    }

                                    disabled={
                                        isSubmitting
                                    }

                                >

                                    <MenuItem value="IN_PROGRESS">
                                        In Progress
                                    </MenuItem>

                                    <MenuItem value="SUBMITTED">
                                        Submitted
                                    </MenuItem>

                                    <MenuItem value="EVALUATED">
                                        Evaluated
                                    </MenuItem>

                                </Select>

                            </FormControl>

                        </Grid>



                        {/* Score */}

                        <Grid size={{ xs: 12 }}>

                            <TextField

                                label="Total Score"

                                name="totalScore"

                                type="number"

                                value={
                                    formData.totalScore
                                }

                                onChange={
                                    handleChange
                                }

                                fullWidth

                                size="small"

                                disabled={
                                    isSubmitting
                                }

                            />

                        </Grid>



                        {/* SubmittedAt */}

                        <Grid size={{ xs: 12 }}>

                            <TextField

                                label="Submitted At"

                                name="submittedAt"

                                type="datetime-local"

                                value={
                                    formData.submittedAt
                                }

                                onChange={
                                    handleChange
                                }

                                fullWidth

                                size="small"

                                InputLabelProps={{
                                    shrink: true,
                                }}

                                disabled={
                                    isSubmitting
                                }

                            />

                        </Grid>



                        {/* Actions */}

                        <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>

                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 2,
                                }}
                            >

                                <Link
                                    href="/examAttempts"
                                    passHref
                                >

                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        startIcon={<Cancel />}
                                        size="small"
                                        disabled={
                                            isSubmitting
                                        }
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

                                    disabled={
                                        isSubmitting
                                    }

                                >

                                    {isSubmitting
                                        ? "Saving..."
                                        : "Save Changes"}

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

                onClose={() =>
                    setSnackbarOpen(false)
                }

                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}

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
