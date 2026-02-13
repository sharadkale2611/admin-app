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
  Checkbox,
  Avatar,
} from "@mui/material";
import { Save, Cancel, Image as ImageIcon } from "@mui/icons-material";
import Link from "next/link";

import useEditQuestionOptionViewModel from "@/lib/features/questionOption/useEditQuestionOptionViewModel";
import { ApiError } from "@/lib/features/questionOption/questionOptionTypes";

/* ===============================
   Error Renderer
================================ */

function renderErrorContent(error: ApiError | null) {
  if (!error) return null;

  return (
    <div>
      {error.error && <div>{error.error}</div>}
    </div>
  );
}

export default function EditQuestionOptionPage() {
  const {
    formData,
    questions,
    existingImage,
    loading,
    isSubmitting,
    error,
    handleChange,
    handleFileChange,
    handleSubmit,
  } = useEditQuestionOptionViewModel();

  const [preview, setPreview] = useState<string | null>(null);

  /* Snackbar */
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<"success" | "error">("success");

  const handleImageSelect = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Edit Question Option
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
                window.location.href =
                  "/questionOptions";
              }, 1500);
            }
          }}
        >
          <Grid container spacing={2}>
            {/* Question Dropdown */}
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth size="small" required>
                <InputLabel>Question</InputLabel>
                <Select
                  name="questionId"
                  value={formData.questionId}
                  label="Question"
                  onChange={(e) =>
                    handleChange({
                      target: {
                        name: "questionId",
                        value: (e.target as HTMLInputElement).value,
                      },
                    } as unknown as React.ChangeEvent<HTMLInputElement>)
                  }
                  disabled
                >
                  {questions.map((q: any) => (
                    <MenuItem
                      key={q.questionId}
                      value={q.questionId}
                    >
                      #{q.questionId} — {q.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Option Text */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                required
                label="Option Text"
                name="optionText"
                value={formData.optionText}
                onChange={handleChange}
                size="small"
                disabled={isSubmitting}
              />
            </Grid>

            {/* Option Order */}
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                required
                label="Option Order"
                name="optionOrder"
                value={formData.optionOrder}
                onChange={handleChange}
                size="small"
                type="number"
                disabled={isSubmitting}
              />
            </Grid>

            {/* Is Correct */}
            <Grid size={{ xs: 6 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isCorrect}
                    onChange={handleChange}
                    name="isCorrect"
                  />
                }
                label="Is Correct Option?"
              />
            </Grid>

            {/* Is Active */}
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isActive}
                    onChange={handleChange}
                    name="isActive"
                  />
                }
                label="Active"
              />
            </Grid>

            {/* Image Upload */}
            <Grid size={{ xs: 12 }}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<ImageIcon />}
                disabled={isSubmitting}
              >
                Replace Option Image
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                />
              </Button>

              {/* Preview Priority: New > Existing */}
              <Box sx={{ mt: 2 }}>
                {preview ? (
                  <Avatar
                    src={preview}
                    variant="rounded"
                    sx={{ width: 120, height: 120 }}
                  />
                ) : existingImage ? (
                  <Avatar
                    src={existingImage}
                    variant="rounded"
                    sx={{ width: 120, height: 120 }}
                  />
                ) : null}
              </Box>
            </Grid>

            {/* Actions */}
            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Link href="/questionOptions" passHref>
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
                    : "Update Option"}
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
