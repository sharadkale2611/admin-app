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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
} from "@mui/material";

import type { SelectChangeEvent } from "@mui/material/Select";

import {
    Save,
    Cancel,
} from "@mui/icons-material";

import Link from "next/link";

import useCreateExamAttemptQuestionViewModel from "@/lib/features/examAttemptQuestion/useCreateExamAttemptQuestionViewModel";


/* ===============================
   Error Renderer
================================ */

function renderErrorContent(error: string | null) {

    if (!error) return null;

    return (
        <div className="text-red-600">
            <strong>Error:</strong> {error}
        </div>
    );

}


/* ===============================
   Page
================================ */

export default function CreateExamAttemptQuestionPage() {

    const {

        formData,

        isSubmitting,

        error,

        handleChange,

        handleSubmit,

        examAttempts,

        questions,

        questionTypes,

    } = useCreateExamAttemptQuestionViewModel();


    /* Snackbar */

    const [snackbarOpen, setSnackbarOpen] =
        useState(false);

    const [snackbarMessage, setSnackbarMessage] =
        useState("");

    const [snackbarSeverity, setSnackbarSeverity] =
        useState<"success" | "error">("success");



    /* Dropdown Handlers */

    const handleAttemptChange = (
        e: SelectChangeEvent
    ) => {

        const value = String(e.target.value);

        handleChange({
            target: { name: "examAttemptId", value },
        } as unknown as React.ChangeEvent<HTMLInputElement>);

    };


    const handleQuestionChange = (
        e: SelectChangeEvent
    ) => {

        const value = String(e.target.value);

        handleChange({
            target: { name: "questionId", value },
        } as unknown as React.ChangeEvent<HTMLInputElement>);

    };


    const handleQuestionTypeChange = (
        e: SelectChangeEvent
    ) => {

        const value = String(e.target.value);

        handleChange({
            target: { name: "questionTypeId", value },
        } as unknown as React.ChangeEvent<HTMLInputElement>);

    };


    return (

        <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>

            <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: 600 }}
            >
                Add Attempt Question
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
                                "Attempt question created successfully."
                            );

                            setSnackbarSeverity("success");

                            setSnackbarOpen(true);


                            setTimeout(() => {

                                window.location.href =
                                    "/examAttemptQuestions";

                            }, 1500);

                        }

                    }}

                >

                    <Grid container spacing={2}>


                        {/* Section Header */}

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






                        {/* Question Type Dropdown */}

                        <Grid size={{ xs: 12 }}>

                            <FormControl fullWidth size="small" required>

                                <InputLabel>
                                    Question Type
                                </InputLabel>

                                <Select
                                    name="questionTypeId"
                                    value={formData.questionTypeId}
                                    label="Question Type"
                                    onChange={handleQuestionTypeChange}
                                    disabled={isSubmitting}
                                >

                                    {questionTypes.length === 0 ? (

                                        <MenuItem disabled>
                                            No question types available
                                        </MenuItem>

                                    ) : (

                                        questionTypes.map((qt: any) => (

                                            <MenuItem
                                                key={qt.questionTypeId}
                                                value={String(qt.questionTypeId)}
                                            >

                                                #{qt.questionTypeId} — {qt.name}

                                            </MenuItem>

                                        ))

                                    )}

                                </Select>

                            </FormControl>

                        </Grid>




                        {/* Question Dropdown */}

                        <Grid size={{ xs: 12 }}>

                            <FormControl fullWidth size="small" required>

                                <InputLabel>
                                    Question
                                </InputLabel>

                                <Select
                                    name="questionId"
                                    value={formData.questionId}
                                    label="Question"
                                    onChange={handleQuestionChange}
                                    disabled={isSubmitting}
                                >

                                    {questions.length === 0 ? (

                                        <MenuItem disabled>
                                            No questions available
                                        </MenuItem>

                                    ) : (

                                        questions.map((q: any) => (

                                            <MenuItem
                                                key={q.questionId}
                                                value={String(q.questionId)}
                                            >

                                                #{q.questionId} — {q.title}

                                            </MenuItem>

                                        ))

                                    )}

                                </Select>

                            </FormControl>

                        </Grid>

                        {/* Exam Attempt Dropdown */}

                        <Grid size={{ xs: 12 }}>

                            <FormControl fullWidth size="small" required>

                                <InputLabel>
                                    Exam Attempt
                                </InputLabel>

                                <Select
                                    name="examAttemptId"
                                    value={formData.examAttemptId}
                                    label="Exam Attempt"
                                    onChange={handleAttemptChange}
                                    disabled={isSubmitting}
                                >

                                    {examAttempts.length === 0 ? (

                                        <MenuItem disabled>
                                            No attempts available
                                        </MenuItem>

                                    ) : (

                                        examAttempts.map((a: any) => (

                                            <MenuItem
                                                key={a.examAttemptId}
                                                value={String(a.examAttemptId)}
                                            >

                                                #{a.examAttemptId} — Attempt {a.attemptNo} - {a.studentName} - {a.examPaperName}

                                            </MenuItem>

                                        ))

                                    )}

                                </Select>

                            </FormControl>

                        </Grid>





                        {/* Max Marks */}

                        <Grid size={{ xs: 12 }}>

                            <TextField
                                fullWidth
                                size="small"
                                label="Max Marks"
                                name="maxMarks"
                                type="number"
                                value={formData.maxMarks}
                                onChange={handleChange}
                                required
                                disabled={isSubmitting}
                            />

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

                                    {isSubmitting
                                        ? "Saving..."
                                        : "Save Question"}

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
