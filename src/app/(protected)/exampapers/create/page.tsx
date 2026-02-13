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
  FormControlLabel,
  Switch,
} from "@mui/material";

import { Save, Cancel } from "@mui/icons-material";
import Link from "next/link";

import useCreateExamPaperViewModel from "@/lib/features/exampaper/useCreateExamPaperViewModel";

/* ===============================
   Page
================================ */

export default function CreateExamPaperPage() {
  const {
    formData,
    isSubmitting,
    error,
    handleChange,
    handleSubmit,
  } = useCreateExamPaperViewModel();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  return (
    <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Create Exam Paper
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0" }}>
        <form
          onSubmit={async (e) => {
            const result = await handleSubmit(e);

            if (result?.success) {
              setSnackbarMessage("Exam paper created successfully.");
              setSnackbarOpen(true);

              setTimeout(() => {
                window.location.href = "/exampapers";
              }, 1500);
            }
          }}
        >
          <Grid container spacing={2}>
            {/* Name */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                required
                label="Exam Paper Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                size="small"
                disabled={isSubmitting}
              />
            </Grid>

            {/* Total Marks */}
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                required
                label="Total Marks"
                name="totalMarks"
                value={formData.totalMarks}
                onChange={handleChange}
                type="number"
                size="small"
                disabled={isSubmitting}
              />
            </Grid>

            {/* Duration */}
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                required
                label="Duration (Minutes)"
                name="durationMinutes"
                value={formData.durationMinutes}
                onChange={handleChange}
                type="number"
                size="small"
                disabled={isSubmitting}
              />
            </Grid>

            {/* Shuffle Questions */}
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    name="shuffleQuestions"
                    checked={formData.shuffleQuestions}
                    onChange={handleChange}
                  />
                }
                label="Shuffle Questions"
              />
            </Grid>

            {/* Shuffle Options */}
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    name="shuffleOptions"
                    checked={formData.shuffleOptions}
                    onChange={handleChange}
                  />
                }
                label="Shuffle Options"
              />
            </Grid>

            {/* Actions */}
            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Link href="/exampapers">
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
                  startIcon={<Save />}
                  size="small"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Exam Paper"}
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
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
