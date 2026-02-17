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
} from "@mui/material";

import type { SelectChangeEvent } from "@mui/material/Select";

import {
  Save,
  Cancel,
} from "@mui/icons-material";

import Link from "next/link";

import useCreateExamAttemptViewModel from "@/lib/features/examAttempt/useCreateExamAttemptViewModel";


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

export default function CreateExamAttemptPage() {

  const {

    formData,

    isSubmitting,

    error,

    handleChange,

    handleSubmit,

    examPapers,

    students,

  } = useCreateExamAttemptViewModel();


  /* Snackbar */

  const [snackbarOpen, setSnackbarOpen] =
    useState(false);

  const [snackbarMessage, setSnackbarMessage] =
    useState("");

  const [snackbarSeverity, setSnackbarSeverity] =
    useState<"success" | "error">("success");



  /* Dropdown Handlers */

  const handleExamPaperChange = (
    e: SelectChangeEvent
  ) => {

    const value = String(e.target.value);

    handleChange({
      target: { name: "examPaperId", value },
    } as unknown as React.ChangeEvent<HTMLInputElement>);

  };


  const handleStudentChange = (
    e: SelectChangeEvent
  ) => {

    const value = String(e.target.value);

    handleChange({
      target: { name: "studentId", value },
    } as unknown as React.ChangeEvent<HTMLInputElement>);

  };


  return (

    <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>

      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontWeight: 600 }}
      >
        Start Exam Attempt
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
                "Exam attempt started successfully."
              );

              setSnackbarSeverity("success");

              setSnackbarOpen(true);


              setTimeout(() => {

                window.location.href =
                  "/examAttempts";

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

                Exam Information

              </Typography>

            </Grid>



            {/* Student Dropdown */}

            <Grid size={{ xs: 12 }}>

              <FormControl
                fullWidth
                size="small"
                required
              >

                <InputLabel>
                  Student
                </InputLabel>

                <Select
                  name="studentId"
                  value={formData.studentId}
                  label="Student"
                  onChange={handleStudentChange}
                  disabled={isSubmitting}
                >

                  {students.length === 0 ? (

                    <MenuItem disabled>
                      No students available
                    </MenuItem>

                  ) : (

                    students.map((s: any) => (

                      <MenuItem
                        key={s.studentId}
                        value={String(s.studentId)}
                      >

                        #{s.studentId} — {s.firstName}

                      </MenuItem>

                    ))

                  )}

                </Select>

              </FormControl>

            </Grid>



            {/* Exam Paper Dropdown */}

            <Grid size={{ xs: 12 }}>

              <FormControl
                fullWidth
                size="small"
                required
              >

                <InputLabel>
                  Exam Paper
                </InputLabel>

                <Select
                  name="examPaperId"
                  value={formData.examPaperId}
                  label="Exam Paper"
                  onChange={handleExamPaperChange}
                  disabled={isSubmitting}
                >

                  {examPapers.length === 0 ? (

                    <MenuItem disabled>
                      No exam papers available
                    </MenuItem>

                  ) : (

                    examPapers.map((e: any) => (

                      <MenuItem
                        key={e.examPaperId}
                        value={String(e.examPaperId)}
                      >

                        #{e.examPaperId} — {e.name}

                      </MenuItem>

                    ))

                  )}

                </Select>

              </FormControl>

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
                    ? "Starting..."
                    : "Start Exam"}

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
