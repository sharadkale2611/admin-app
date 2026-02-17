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
    FormGroup,
    FormControlLabel,
    Checkbox,
    FormLabel,
    CircularProgress,
} from "@mui/material";

import type { SelectChangeEvent } from "@mui/material/Select";

import {
    Save,
    Cancel,
} from "@mui/icons-material";

import Link from "next/link";

import useCreateStudentAnswerViewModel from "@/lib/features/studentAnswer/useCreateStudentAnswerViewModel";


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

export default function CreateStudentAnswerPage() {

    const {

        formData,

        isSubmitting,

        error,

        handleChange,

        handleSubmit,

        handleFileChange,

        attemptQuestions,

        questionOptions,

        optionsLoading,

        selectedOptions,

        handleOptionToggle,

        handleSelectAll,

        handleClearAll,

    } = useCreateStudentAnswerViewModel();


    /* Snackbar */

    const [snackbarOpen, setSnackbarOpen] =
        useState(false);

    const [snackbarMessage, setSnackbarMessage] =
        useState("");

    const [snackbarSeverity, setSnackbarSeverity] =
        useState<"success" | "error">("success");



    /* Dropdown Handler */

    const handleAttemptQuestionChange = (
        e: SelectChangeEvent
    ) => {

        const value = String(e.target.value);

        handleChange({
            target: { name: "attemptQuestionId", value },
        } as unknown as React.ChangeEvent<HTMLInputElement>);

    };


    return (

        <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>

            <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: 600 }}
            >
                Add Student Answer
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
                                "Student answer created successfully."
                            );

                            setSnackbarSeverity("success");

                            setSnackbarOpen(true);


                            setTimeout(() => {

                                window.location.href =
                                    "/studentAnswers";

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

                                Student Answer Information

                            </Typography>

                        </Grid>



                        {/* Attempt Question Dropdown */}

                        <Grid size={{ xs: 12 }}>

                            <FormControl fullWidth size="small" required>

                                <InputLabel>
                                    Attempt Question
                                </InputLabel>

                                <Select
                                    name="attemptQuestionId"
                                    value={formData.attemptQuestionId}
                                    label="Attempt Question"
                                    onChange={handleAttemptQuestionChange}
                                    disabled={isSubmitting}
                                >

                                    {attemptQuestions.length === 0 ? (

                                        <MenuItem disabled>
                                            No attempt questions available
                                        </MenuItem>

                                    ) : (

                                        attemptQuestions.map((aq: any) => (

                                            <MenuItem
                                                key={aq.attemptQuestionId}
                                                value={String(aq.attemptQuestionId)}
                                            >

                                                #{aq.attemptQuestionId} — Question #{aq.questionId}

                                            </MenuItem>

                                        ))

                                    )}

                                </Select>

                            </FormControl>

                        </Grid>



                        {/* Answer Text */}

                        <Grid size={{ xs: 12 }}>

                            <TextField
                                fullWidth
                                size="small"
                                label="Answer Text"
                                name="answerText"
                                multiline
                                minRows={3}
                                value={formData.answerText}
                                onChange={handleChange}
                                disabled={isSubmitting}
                            />

                        </Grid>



                        {/* Selected Option Ids */}

                        <Grid size={{ xs: 12 }}>

                            <FormLabel>

                                Select Options

                            </FormLabel>


                            {/* loading */}

                            {optionsLoading && (

                                <CircularProgress size={20} sx={{ ml: 2 }} />

                            )}


                            {/* no attempt question */}

                            {!formData.attemptQuestionId && (

                                <Typography color="text.secondary">

                                    Select attempt question first

                                </Typography>

                            )}


                            {/* options */}

                            {formData.attemptQuestionId && !optionsLoading && (

                                <>

                                    {/* actions */}

                                    <Box sx={{ mb: 1 }}>

                                        <Button
                                            size="small"
                                            onClick={handleSelectAll}
                                        >

                                            Select All

                                        </Button>

                                        <Button
                                            size="small"
                                            onClick={handleClearAll}
                                        >

                                            Clear

                                        </Button>

                                    </Box>


                                    <FormGroup>

                                        {questionOptions.map((option: any, index: number) => {
                                          const letter = String.fromCharCode(65 + index);

                                          const checked = selectedOptions.includes(option.optionId);

                                          return (
                                            <Box
                                              key={option.optionId}
                                              onClick={() => handleOptionToggle(option.optionId)}
                                              sx={{
                                                border: "1px solid",
                                                borderColor: checked ? "primary.main" : "grey.300",
                                                borderRadius: 2,
                                                px: 2,
                                                py: 1,
                                                mb: 1,
                                                cursor: "pointer",
                                                backgroundColor: checked ? "primary.50" : "transparent",
                                                transition: "all .2s",
                                                "&:hover": { backgroundColor: "grey.100" },
                                              }}
                                            >
                                              <FormControlLabel
                                                control={<Checkbox checked={checked} />}
                                                label={
                                                  <Box sx={{ display: "flex", gap: 1 }}>
                                                    <Typography fontWeight={600}>{letter}.</Typography>
                                                    <Typography>{option.optionText}</Typography>
                                                  </Box>
                                                }
                                              />
                                            </Box>
                                          );
                                        })}

                                    </FormGroup>


                                </>

                            )}

                        </Grid>




                        {/* File Upload */}

                        <Grid size={{ xs: 12 }}>

                            <Button
                                variant="outlined"
                                component="label"
                                size="small"
                                disabled={isSubmitting}
                            >

                                Upload File

                                <input
                                    type="file"
                                    hidden
                                    onChange={handleFileChange}
                                />

                            </Button>

                            {formData.file && (

                                <Typography
                                    variant="body2"
                                    sx={{ mt: 1 }}
                                >

                                    Selected: {formData.file.name}

                                </Typography>

                            )}

                        </Grid>



                        {/* Actions */}

                        <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>

                            <Box sx={{ display: "flex", gap: 2 }}>

                                <Link
                                    href="/studentAnswers"
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
                                        : "Save Answer"}

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
