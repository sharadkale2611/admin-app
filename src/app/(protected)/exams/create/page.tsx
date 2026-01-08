"use client";

import React from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Grid,
  Alert,
  FormControlLabel,
  Switch
} from "@mui/material";

import { Save, Cancel } from "@mui/icons-material";
import Link from "next/link";

import useCreateExamViewModel from "@/lib/features/exam/createExamViewModel";

export default function CreateExam() {

  const {
    formData,
    isSubmitting,
    error,
    handleChange,
    handleStatusChange,
    handleSubmit
  } = useCreateExamViewModel();

  return (
    <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>

      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Create New Exam
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0" }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>

            {/* Section Header */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, color: "text.secondary" }}>
                Exam Details
              </Typography>
            </Grid>

            {/* Exam Name */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Exam Name"
                name="examName"
                value={formData.examName}
                onChange={handleChange}
                required
                size="small"
                disabled={isSubmitting}
              />
            </Grid>

            {/* Duration */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Exam Duration (Hrs)"
                name="examDurationHrs"
                type="number"
                value={formData.examDurationHrs}
                onChange={handleChange}
                required
                size="small"
                disabled={isSubmitting}
              />
            </Grid>

            {/* Description */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Exam Description"
                name="examDescription"
                multiline
                rows={3}
                value={formData.examDescription}
                onChange={handleChange}
                size="small"
                disabled={isSubmitting}
              />
            </Grid>

            {/* Total Marks */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Total Marks"
                name="examTotalMarks"
                type="number"
                value={formData.examTotalMarks}
                onChange={handleChange}
                required
                size="small"
                disabled={isSubmitting}
              />
            </Grid>

            {/* Passing Marks */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Passing Marks"
                name="examPassingMarks"
                type="number"
                value={formData.examPassingMarks}
                onChange={handleChange}
                size="small"
                disabled={isSubmitting}
              />
            </Grid>

            {/* Course ID */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Course ID"
                name="courseId"
                type="number"
                value={formData.courseId}
                onChange={handleChange}
                size="small"
                disabled={isSubmitting}
              />
            </Grid>

            {/* Module ID */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Module ID"
                name="moduleId"
                type="number"
                value={formData.moduleId}
                onChange={handleChange}
                required
                size="small"
                disabled={isSubmitting}
              />
            </Grid>

            {/* ⭐ STATUS SWITCH — (same as Module UI) */}
            <Grid size={{ xs: 12 }} sx={{ mt: 1 }}>
              <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
                Status
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={handleStatusChange}
                    disabled={isSubmitting}
                  />
                }
                label={formData.isActive ? "Active" : "Inactive"}
              />
            </Grid>

            {/* Buttons */}
            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Link href="/exams" passHref>
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
                  {isSubmitting ? "Saving..." : "Create Exam"}
                </Button>
              </Box>
            </Grid>

          </Grid>
        </form>
      </Paper>
    </Container>
  );
}
