'use client';

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
  Checkbox,
  Skeleton
} from "@mui/material";

import { Save, Cancel } from "@mui/icons-material";
import Link from "next/link";
import { useParams } from "next/navigation";

import useEditExamViewModel from "@/lib/features/exam/useEditExamViewModel";

export default function EditExam() {

  const { id } = useParams();

  const {
    formData,
    loading,
    isSubmitting,
    error,
    handleChange,
    handleCheckboxChange,
    handleSubmit
  } = useEditExamViewModel();

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
        <Skeleton variant="text" width={300} height={40} />
        <Skeleton variant="rectangular" width="100%" height={400} sx={{ mt: 2 }} />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>

      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Edit Exam
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0" }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>

            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, color: "text.secondary" }}>
                Exam Details
              </Typography>
            </Grid>

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

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Duration (Hrs)"
                name="examDurationHrs"
                type="number"
                value={formData.examDurationHrs}
                onChange={handleChange}
                size="small"
                disabled={isSubmitting}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Description"
                name="examDescription"
                multiline
                rows={3}
                value={formData.examDescription}
                onChange={handleChange}
                size="small"
                disabled={isSubmitting}
              />
            </Grid>

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

            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isActive}
                    onChange={handleCheckboxChange}
                    disabled={isSubmitting}
                  />
                }
                label="Active"
              />
            </Grid>

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
                  startIcon={<Save />}
                  size="small"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update Exam"}
                </Button>
              </Box>
            </Grid>

          </Grid>
        </form>
      </Paper>

    </Container>
  );
}
