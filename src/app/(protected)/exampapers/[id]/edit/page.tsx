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
  Switch,
  FormControlLabel,
} from "@mui/material";

import { Save, Cancel } from "@mui/icons-material";
import Link from "next/link";

import useEditExamPaperViewModel from "@/lib/features/exampaper/useEditExamPaperViewModel";

/* ===============================
   Page
================================ */

export default function EditExamPaperPage() {
  const {
    formData,
    loading,
    isSubmitting,
    handleChange,
    handleSubmit,
  } = useEditExamPaperViewModel();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  return (
    <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Edit Exam Paper
      </Typography>

      <Paper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0" }}>
        <form
          onSubmit={async (e) => {
            const result = await handleSubmit(e);

            if (result?.success) {
              setSnackbarMessage(result.message);
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
                disabled={loading || isSubmitting}
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
                size="small"
                type="number"
                disabled={loading || isSubmitting}
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
                size="small"
                type="number"
                disabled={loading || isSubmitting}
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
                    disabled={loading || isSubmitting}
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
                    disabled={loading || isSubmitting}
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
                  {isSubmitting ? "Updating..." : "Update Exam Paper"}
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
