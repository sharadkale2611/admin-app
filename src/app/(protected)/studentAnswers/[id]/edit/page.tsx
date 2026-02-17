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

  CircularProgress,

  Checkbox,

  FormControlLabel,

  FormLabel,

} from "@mui/material";

import {

  Save,

  Cancel,

} from "@mui/icons-material";

import Link from "next/link";

import { useParams } from "next/navigation";

import useEditStudentAnswerViewModel
from "@/lib/features/studentAnswer/useEditStudentAnswerViewModel";


/* ===============================
   Page
================================ */

export default function EditStudentAnswerPage() {

  const params = useParams();

  const studentAnswerId =
    Number(params.id);


  const {

    formData,

    questionOptions,

    selectedOptions,

    optionsLoading,

    isSubmitting,

    isLoading,

    error,

    handleChange,

    handleFileChange,

    handleOptionToggle,

    handleSubmit,

  } =
    useEditStudentAnswerViewModel(
      studentAnswerId
    );


  /* Snackbar */

  const [snackbarOpen, setSnackbarOpen] =
    useState(false);


  if (isLoading)

    return (

      <Container sx={{ mt: 4 }}>

        <CircularProgress />

      </Container>

    );


  return (

    <Container
      maxWidth="md"
      sx={{ mt: 3, mb: 4 }}
    >

      <Typography
        variant="h5"
        sx={{ fontWeight: 600 }}
      >

        Edit Student Answer

      </Typography>



      {/* Error */}

      {error && (

        <Alert severity="error">

          {error}

        </Alert>

      )}



      <Paper
        sx={{
          p: 3,
          mt: 2,
          border: "1px solid #e0e0e0",
        }}
      >

        <form

          onSubmit={async (e) => {

            const result =
              await handleSubmit(e);

            if (result?.success) {

              setSnackbarOpen(true);

              setTimeout(() => {

                window.location.href =
                  "/studentAnswers";

              }, 1500);

            }

          }}

        >

          <Grid container spacing={2}>



            {/* Answer */}

            <Grid size={{ xs: 12 }}>

              <TextField

                fullWidth

                label="Answer Text"

                name="answerText"

                value={
                  formData.answerText
                }

                onChange={handleChange}

                multiline

                minRows={3}

              />

            </Grid>



            {/* Options */}

            <Grid size={{ xs: 12 }}>

              <FormLabel>

                Select Options

              </FormLabel>


              {optionsLoading ? (

                <CircularProgress />

              ) : (

                <>

                  {questionOptions.map(
                    (option, index) => {

                      const letter =
                        String.fromCharCode(
                          65 + index
                        );

                      const checked =
                        selectedOptions.includes(
                          option.optionId
                        );

                      return (

                        <Box

                          key={
                            option.optionId
                          }

                          onClick={() =>
                            handleOptionToggle(
                              option.optionId
                            )
                          }

                          sx={{

                            border:
                              "1px solid",

                            borderColor:
                              checked
                                ? "primary.main"
                                : "grey.300",

                            borderRadius: 2,

                            px: 2,

                            py: 1,

                            mb: 1,

                            cursor:
                              "pointer",

                            backgroundColor:
                              checked
                                ? "primary.50"
                                : "transparent",

                          }}

                        >

                          <FormControlLabel

                            control={

                              <Checkbox

                                checked={
                                  checked
                                }

                              />

                            }

                            label={

                              <Box
                                sx={{
                                  display:
                                    "flex",
                                  gap: 1,
                                }}
                              >

                                <Typography
                                  fontWeight={
                                    600
                                  }
                                >

                                  {letter}.

                                </Typography>

                                <Typography>

                                  {
                                    option.optionText
                                  }

                                </Typography>

                              </Box>

                            }

                          />

                        </Box>

                      );

                    }
                  )}

                </>

              )}

            </Grid>



            {/* Score */}

            <Grid size={{ xs: 12 }}>

              <TextField

                fullWidth

                label="Score"

                name="score"

                value={formData.score}

                onChange={handleChange}

              />

            </Grid>



            {/* Correct */}

            <Grid size={{ xs: 12 }}>

              <FormControlLabel

                control={

                  <Checkbox

                    name="isCorrect"

                    checked={
                      formData.isCorrect
                    }

                    onChange={
                      handleChange
                    }

                  />

                }

                label="Correct Answer"

              />

            </Grid>



            {/* File */}

            <Grid size={{ xs: 12 }}>

              <Button
                variant="outlined"
                component="label"
              >

                Replace File

                <input

                  hidden

                  type="file"

                  onChange={
                    handleFileChange
                  }

                />

              </Button>


              {formData.file && (

                <Typography>

                  Selected:

                  {formData.file.name}

                </Typography>

              )}

            </Grid>



            {/* Actions */}

            <Grid size={{ xs: 12 }}>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                }}
              >

                <Link href="/studentAnswers">

                  <Button
                    startIcon={
                      <Cancel />
                    }
                  >

                    Cancel

                  </Button>

                </Link>


                <Button

                  type="submit"

                  variant="contained"

                  startIcon={<Save />}

                  disabled={
                    isSubmitting
                  }

                >

                  Save Changes

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

      >

        <Alert severity="success">

          Updated successfully

        </Alert>

      </Snackbar>



    </Container>

  );

}
