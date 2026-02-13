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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Save, Cancel } from "@mui/icons-material";
import Link from "next/link";

import useEditQuestionViewModel from "@/lib/features/question/useEditQuestionViewModel";
import { useQuestionTypeViewModel } from "@/lib/features/questionType/useQuestionTypeViewModel";
import { ApiError } from "@/lib/features/question/questionTypes";

/* ===============================
   Field Labels
================================ */

const fieldLabels: Record<string, string> = {
  questionTypeId: "Question Type",
  courseId: "Course",
  moduleId: "Module",
  title: "Title",
  description: "Description",
  marks: "Marks",
  difficultyLevel: "Difficulty Level",
  negativeMarks: "Negative Marks",
  isActive: "Status",
};

/* ===============================
   Error Renderer
================================ */

function renderErrorContent(error: ApiError | null) {
  if (!error) return null;

  return (
    <div className="text-red-600">
      {error.error && (
        <h4 className="font-semibold mb-2">{error.error}</h4>
      )}

      {error.errors && (
        <ul className="list-disc list-inside space-y-1">
          {Object.entries(error.errors).map(([field, messages]) =>
            messages.map((msg, i) => (
              <li key={`${field}-${i}`}>
                <strong>{fieldLabels[field] || field}:</strong>{" "}
                {msg}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

export default function EditQuestionPage() {
  const {
    formData,
    courses,
    modules,
    loading,
    isSubmitting,
    error,
    handleChange,
    handleBooleanChange,
    handleSubmit,
  } = useEditQuestionViewModel();

  const { questionTypes } = useQuestionTypeViewModel();

  /* Snackbar */
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<"success" | "error">("success");

  return (
    <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Edit Question
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
              setSnackbarSeverity("success");
              setSnackbarOpen(true);

              setTimeout(() => {
                window.location.href = "/questions";
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
                Question Information
              </Typography>
            </Grid>

            {/* Question Type */}
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth size="small" required>
                <InputLabel>Question Type</InputLabel>
                <Select
                  name="questionTypeId"
                  value={formData.questionTypeId}
                  label="Question Type"
                  onChange={handleChange}
                  disabled={loading || isSubmitting}
                >
                  {questionTypes.map((qt) => (
                    <MenuItem
                      key={qt.questionTypeId}
                      value={qt.questionTypeId}
                    >
                      {qt.name} ({qt.code})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Course */}
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Course</InputLabel>
                <Select
                  name="courseId"
                  value={formData.courseId}
                  label="Course"
                  onChange={handleChange}
                  disabled={loading || isSubmitting}
                >
                  <MenuItem value="">None</MenuItem>
                  {courses.map((course: any) => (
                    <MenuItem
                      key={course.courseId}
                      value={course.courseId}
                    >
                      {course.courseName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Module (Cascading) */}
            <Grid size={{ xs: 12 }}>
              <FormControl
                fullWidth
                size="small"
                disabled={
                  loading ||
                  isSubmitting ||
                  !formData.courseId
                }
              >
                <InputLabel>Module</InputLabel>
                <Select
                  name="moduleId"
                  value={formData.moduleId}
                  label="Module"
                  onChange={handleChange}
                >
                  <MenuItem value="">None</MenuItem>
                  {modules.map((module: any) => (
                    <MenuItem
                      key={module.moduleId}
                      value={module.moduleId}
                    >
                      {module.moduleName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Title */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                required
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                size="small"
                disabled={loading || isSubmitting}
              />
            </Grid>

            {/* Description */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                size="small"
                disabled={loading || isSubmitting}
              />
            </Grid>

            {/* Marks */}
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                required
                label="Marks"
                name="marks"
                value={formData.marks}
                onChange={handleChange}
                size="small"
                disabled={loading || isSubmitting}
                type="number"
              />
            </Grid>

            {/* Negative Marks */}
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Negative Marks"
                name="negativeMarks"
                value={formData.negativeMarks}
                onChange={handleChange}
                size="small"
                disabled={loading || isSubmitting}
                type="number"
              />
            </Grid>

            {/* Difficulty */}
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth size="small" required>
                <InputLabel>Difficulty Level</InputLabel>
                <Select
                  name="difficultyLevel"
                  value={formData.difficultyLevel}
                  label="Difficulty Level"
                  onChange={handleChange}
                  disabled={loading || isSubmitting}
                >
                  <MenuItem value="EASY">EASY</MenuItem>
                  <MenuItem value="MEDIUM">MEDIUM</MenuItem>
                  <MenuItem value="HARD">HARD</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Status */}
            <Grid size={{ xs: 12 }} sx={{ mt: 1 }}>
              <Typography
                variant="subtitle1"
                sx={{ color: "text.secondary" }}
              >
                Status
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={handleBooleanChange}
                    disabled={loading || isSubmitting}
                  />
                }
                label={
                  formData.isActive
                    ? "Active"
                    : "Inactive"
                }
              />
            </Grid>

            {/* Actions */}
            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Link href="/questions">
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
                    ? "Updating..."
                    : "Update Question"}
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
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert
          severity={snackbarSeverity}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
