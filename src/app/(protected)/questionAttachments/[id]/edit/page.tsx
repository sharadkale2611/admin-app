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
  FormControlLabel,
  Checkbox,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import {
  Save,
  Cancel,
  UploadFile,
  PictureAsPdf,
} from "@mui/icons-material";
import Link from "next/link";

import useEditQuestionAttachmentViewModel from "@/lib/features/questionAttachment/useEditQuestionAttachmentViewModel";

/* ===============================
   Error Renderer
================================ */

function renderErrorContent(error: any) {
  if (!error) return null;

  if (error.error) {
    return <div>{error.error}</div>;
  }

  return <div>Something went wrong</div>;
}

export default function EditQuestionAttachmentPage() {
  const {
    formData,
    questions,
    existingFile,
    loading,
    isSubmitting,
    error,
    handleChange,
    handleFileChange,
    handleSubmit,
  } = useEditQuestionAttachmentViewModel();

  /* Preview State */
  const [preview, setPreview] = useState<string | null>(null);
  const [isPdf, setIsPdf] = useState(false);

  /* Snackbar */
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);

    if (file) {
      const isImage = file.type.startsWith("image/");
      const isPdfFile = file.type === "application/pdf";

      setIsPdf(isPdfFile);

      if (isImage) {
        setPreview(URL.createObjectURL(file));
      } else {
        setPreview(null);
      }
    } else {
      setPreview(null);
      setIsPdf(false);
    }
  };

  const isExistingImage =
    existingFile &&
    /\.(jpg|jpeg|png|webp)$/i.test(existingFile);

  return (
    <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Edit Question Attachment
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
              setSnackbarOpen(true);

              setTimeout(() => {
                window.location.href =
                  "/questionAttachments";
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
                Attachment Information
              </Typography>
            </Grid>

            {/* 🔥 Question Dropdown (Readonly) */}
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Question</InputLabel>
                <Select
                  name="questionId"
                  value={formData.questionId}
                  label="Question"
                  disabled
                >
                  {questions.map((q: any) => (
                    <MenuItem key={q.questionId} value={q.questionId}>
                      #{q.questionId} — {q.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Existing File Preview */}
            {existingFile && !preview && (
              <Grid size={{ xs: 12 }}>
                <Typography
                  variant="body2"
                  sx={{ mb: 1, color: "text.secondary" }}
                >
                  Current File:
                </Typography>

                {isExistingImage ? (
                  <Avatar
                    src={existingFile}
                    variant="rounded"
                    sx={{ width: 120, height: 120 }}
                  />
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <PictureAsPdf color="error" />
                    <Typography variant="body2">
                      PDF File
                    </Typography>
                  </Box>
                )}
              </Grid>
            )}

            {/* Replace File */}
            <Grid size={{ xs: 12 }}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadFile />}
                disabled={isSubmitting}
              >
                Replace File (Optional)
                <input
                  hidden
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileSelect}
                />
              </Button>

              {preview && (
                <Box sx={{ mt: 2 }}>
                  <Avatar
                    src={preview}
                    variant="rounded"
                    sx={{ width: 120, height: 120 }}
                  />
                </Box>
              )}

              {isPdf && (
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <PictureAsPdf color="error" />
                  <Typography variant="body2">
                    PDF file selected
                  </Typography>
                </Box>
              )}
            </Grid>

            {/* Active Toggle */}
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isActive}
                    onChange={handleChange}
                    name="isActive"
                  />
                }
                label="Is Active?"
              />
            </Grid>

            {/* Actions */}
            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Link href="/questionAttachments" passHref>
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
                    : "Update Attachment"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert severity="success" variant="filled">
          Attachment updated successfully.
        </Alert>
      </Snackbar>
    </Container>
  );
}
