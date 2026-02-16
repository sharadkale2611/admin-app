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
  FormControlLabel,
  Switch,
  CircularProgress,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import { Save, Cancel } from "@mui/icons-material";
import Link from "next/link";

import useEditQuestionAnswerViewModel from "@/lib/features/questionAnswer/useEditQuestionAnswerViewModel";

/* ===============================
   Error Renderer
================================ */

function renderErrorContent(error: any) {
  if (!error) return null;

  if (error.error) {
    return <div>{error.error}</div>;
  }

  if (error.errors && typeof error.errors === "object") {
    return Object.entries(error.errors).map(([key, value]: [string, any], i) => (
      <div key={i}>
        <strong>{key}:</strong>{" "}
        {(Array.isArray(value) ? (value as any).join(", ") : value) as React.ReactNode}
      </div>
    ));
  }

  return null;
}

export default function EditQuestionAnswerPage() {
  const {
    formData,
    questions,
    loading,
    isSubmitting,
    error,
    handleChange,
    handleSubmit,
  } = useEditQuestionAnswerViewModel();

  /* Snackbar */
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSelectChange = (e: SelectChangeEvent<any>) => {
    const value = e.target.value;
    handleChange({
      target: { name: "questionId", value },
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Edit Question Answer
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {renderErrorContent(error)}
        </Alert>
      )}

      <Paper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0" }}>
        <form
          onSubmit={async (e) => {
            const result = await handleSubmit(e);

            if (result?.success) {
              setSnackbarMessage(result.message);
              setSnackbarOpen(true);

              setTimeout(() => {
                window.location.href = "/questionAnswers";
              }, 1500);
            }
          }}
        >
          <Grid container spacing={2}>
            {/* Section Header */}
            <Grid size={{ xs: 12 }}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 1, color: "text.secondary" }}
              >
                Answer Information
              </Typography>
            </Grid>

            {/* Question Dropdown */}
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth size="small" required>
                <InputLabel>Question</InputLabel>
                <Select
                  name="questionId"
                  value={formData.questionId}
                  label="Question"
                  onChange={handleSelectChange}
                  disabled
                >
                  {questions.length === 0 ? (
                    <MenuItem disabled>No questions available</MenuItem>
                  ) : (
                    questions.map((q: any) => (
                      <MenuItem key={q.questionId} value={q.questionId}>
                        #{q.questionId} — {q.title}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Grid>

            {/* Answer Text */}
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Answer Text"
                name="answerText"
                value={formData.answerText}
                onChange={handleChange}
                fullWidth
                size="small"
                multiline
                minRows={2}
                disabled={isSubmitting}
              />
            </Grid>

            {/* Answer Regex */}
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Answer Regex"
                name="answerRegex"
                value={formData.answerRegex}
                onChange={handleChange}
                fullWidth
                size="small"
                disabled={isSubmitting}
              />
            </Grid>

            {/* Max Score */}
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Max Score"
                name="maxScore"
                type="number"
                value={formData.maxScore}
                onChange={handleChange}
                fullWidth
                size="small"
                required
                disabled={isSubmitting}
              />
            </Grid>

            {/* Active Switch */}
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={handleChange}
                    name="isActive"
                    color="primary"
                    disabled={isSubmitting}
                  />
                }
                label="Active"
              />
            </Grid>

            {/* Actions */}
            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Link href="/questionAnswers" passHref>
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
                  {isSubmitting ? "Updating..." : "Update Answer"}
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
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
