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
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import { Save, Cancel } from "@mui/icons-material";
import Link from "next/link";

import useEditExamPaperQuestionViewModel from "@/lib/features/examPaperQuestion/useEditExamPaperQuestionViewModel";

/* =====================================
   Edit ExamPaperQuestion Page
===================================== */

export default function EditExamPaperQuestionPage() {
  const {
    formData,
    examPapers,
    questions,
    loading,
    isSubmitting,
    handleChange,
    handleSubmit,
  } = useEditExamPaperQuestionViewModel();

  /* ✅ Snackbar state (same pattern as your reference page) */
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  /* SAFE ARRAYS */
  const safeExamPapers = examPapers || [];
  const safeQuestions = questions || [];

  return (
    <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Edit Question In Exam Paper
      </Typography>

      <Paper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0" }}>
        <form
          onSubmit={async (e) => {
            const result = await handleSubmit(e);

            if (result?.success) {
              setSnackbarMessage(result.message);
              setSnackbarOpen(true);

              setTimeout(() => {
                window.location.href = "/examPaperQuestions";
              }, 1500);
            }
          }}
        >
          <Grid container spacing={2}>
            {/* =======================
                Exam Paper Dropdown
            ======================== */}
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth size="small" required>
                <InputLabel>Exam Paper</InputLabel>

                <Select
                  name="examPaperId"
                  value={formData.examPaperId}
                  label="Exam Paper"
                  onChange={handleChange}
                  disabled={loading || isSubmitting}
                >
                  {safeExamPapers.map((paper: any) => (
                    <MenuItem
                      key={paper.examPaperId}
                      value={paper.examPaperId}
                    >
                      {paper.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* =======================
                Question Dropdown
            ======================== */}
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth size="small" required>
                <InputLabel>Question</InputLabel>

                <Select
                  name="questionId"
                  value={formData.questionId}
                  label="Question"
                  onChange={handleChange}
                  disabled={loading || isSubmitting}
                >
                  {safeQuestions.map((q: any) => (
                    <MenuItem key={q.questionId} value={q.questionId}>
                      {q.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* =======================
                Marks Override
            ======================== */}
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Marks Override"
                name="marksOverride"
                value={formData.marksOverride}
                onChange={handleChange}
                size="small"
                type="number"
                disabled={loading || isSubmitting}
              />
            </Grid>

            {/* =======================
                Question Order
            ======================== */}
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Question Order"
                name="questionOrder"
                value={formData.questionOrder}
                onChange={handleChange}
                size="small"
                type="number"
                disabled={loading || isSubmitting}
              />
            </Grid>

            {/* =======================
                ACTION BUTTONS
            ======================== */}
            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Link href="/examPaperQuestions">
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
                  {isSubmitting ? "Updating..." : "Update"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* =======================
          SUCCESS SNACKBAR
      ======================== */}
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
