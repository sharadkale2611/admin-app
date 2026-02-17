"use client";

import React, { useState } from "react";

import {
    Container,
    Typography,
    Button,
    Paper,
    Box,
    Grid,
    Alert,
    Snackbar,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";

import type { SelectChangeEvent } from "@mui/material/Select";

import {
    Save,
    Cancel,
} from "@mui/icons-material";

import Link from "next/link";

import useEditExamAttemptQuestionViewModel
    from "@/lib/features/examAttemptQuestion/useEditExamAttemptQuestionViewModel";


/* ===============================
   Error Renderer
================================ */

function renderErrorContent(error: any) {

    if (!error) return null;

    if (error.error)
        return <div>{error.error}</div>;

    return null;

}


/* ===============================
   Page
================================ */

export default function EditExamAttemptQuestionPage() {

    const {

        formData,

        loading,

        isSubmitting,

        error,

        handleChange,

        handleSubmit,

        examAttempts,

        questions,

        questionTypes,

    } = useEditExamAttemptQuestionViewModel();


    /* Snackbar */

    const [snackbarOpen, setSnackbarOpen] =
        useState(false);

    const [snackbarMessage, setSnackbarMessage] =
        useState("");

    const [snackbarSeverity, setSnackbarSeverity] =
        useState<"success" | "error">("success");



    /* Dropdown change */

    const handleEvaluatedChange =
        (e: SelectChangeEvent) => {

            handleChange({
                target: {
                    name: "isEvaluated",
                    value: String(e.target.value),
                },
            } as any);

        };


    return (

        <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>


            {/* Title */}

            <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: 600 }}
            >

                Edit Attempt Question

            </Typography>



            {/* Error */}

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
                                    "/examAttemptQuestions";

                            }, 1500);

                        }

                    }}

                >

                    <Grid container spacing={2}>


                        {/* Header */}

                        <Grid size={{ xs: 12 }}>

                            <Typography
                                variant="subtitle1"
                                sx={{
                                    mb: 1,
                                    color: "text.secondary",
                                }}
                            >

                                Attempt Question Information

                            </Typography>

                        </Grid>



                        {/* Question Type READ ONLY */}

                        <Grid size={{ xs: 12 }}>

                            <FormControl fullWidth size="small">

                                <InputLabel>
                                    Question Type
                                </InputLabel>

                                <Select
                                    value={formData.questionTypeId}
                                    label="Question Type"
                                    disabled
                                >

                                    {questionTypes.map((qt: any) => (

                                        <MenuItem
                                            key={qt.questionTypeId}
                                            value={String(qt.questionTypeId)}
                                        >

                                            #{qt.questionTypeId} — {qt.name}

                                        </MenuItem>

                                    ))}

                                </Select>

                            </FormControl>

                        </Grid>



                        {/* Question READ ONLY */}

                        <Grid size={{ xs: 12 }}>

                            <FormControl fullWidth size="small">

                                <InputLabel>
                                    Question
                                </InputLabel>

                                <Select
                                    value={formData.questionId}
                                    label="Question"
                                    disabled
                                >

                                    {questions.map((q: any) => (

                                        <MenuItem
                                            key={q.questionId}
                                            value={String(q.questionId)}
                                        >

                                            #{q.questionId} — {q.title}

                                        </MenuItem>

                                    ))}

                                </Select>

                            </FormControl>

                        </Grid>



                        {/* Attempt READ ONLY */}

                        <Grid size={{ xs: 12 }}>

                            <FormControl fullWidth size="small">

                                <InputLabel>
                                    Exam Attempt
                                </InputLabel>

                                <Select
                                    value={formData.examAttemptId}
                                    label="Exam Attempt"
                                    disabled
                                >

                                    {examAttempts.map((a: any) => (

                                        <MenuItem
                                            key={a.examAttemptId}
                                            value={String(a.examAttemptId)}
                                        >

                                            #{a.examAttemptId}
                                            — Attempt {a.attemptNo}
                                            — {a.studentName}
                                            — {a.examPaperName}

                                        </MenuItem>

                                    ))}

                                </Select>

                            </FormControl>

                        </Grid>



                        {/* Marks */}

                        <Grid size={{ xs: 12 }}>

                            <TextField
                                fullWidth
                                size="small"
                                label="Marks Assigned"
                                name="marksAssigned"
                                type="number"
                                value={formData.marksAssigned}
                                onChange={handleChange}
                                disabled={loading || isSubmitting}
                            />

                        </Grid>



                        {/* Status */}

                        <Grid size={{ xs: 12 }}>

                            <FormControl fullWidth size="small">

                                <InputLabel>
                                    Evaluation Status
                                </InputLabel>

                                <Select
                                    value={formData.isEvaluated}
                                    label="Evaluation Status"
                                    onChange={handleEvaluatedChange}
                                    disabled={loading || isSubmitting}
                                >

                                    <MenuItem value="false">
                                        Pending
                                    </MenuItem>

                                    <MenuItem value="true">
                                        Evaluated
                                    </MenuItem>

                                </Select>

                            </FormControl>

                        </Grid>



                        {/* Actions */}

                        <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>

                            <Box sx={{ display: "flex", gap: 2 }}>

                                <Link
                                    href="/examAttemptQuestions"
                                    passHref
                                >

                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        startIcon={<Cancel />}
                                        size="small"
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

                                    {isSubmitting
                                        ? "Updating..."
                                        : "Update"}

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
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
            >

                <Alert
                    severity={snackbarSeverity}
                    variant="filled"
                >

                    {snackbarMessage}

                </Alert>

            </Snackbar>


        </Container>

    );

}
