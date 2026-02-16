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

import useCreateQuestionAttachmentsViewModel from "@/lib/features/questionAttachment/useCreateQuestionAttachmentsViewModel";

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

export default function CreateQuestionAttachmentPage() {
  const {
    formData,
    isSubmitting,
    error,
    handleChange,
    handleFileChange,
    handleSubmit,
    questions,
  } = useCreateQuestionAttachmentsViewModel();

  /* File Preview */
  const [preview, setPreview] = useState<string | null>(null);
  const [isPdf, setIsPdf] = useState(false);

  /* Snackbar */
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<"success" | "error">("success");

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

  const handleSelectChange = (e: SelectChangeEvent<any>) => {
    const value = e.target.value;
    handleChange({
      target: { name: "questionId", value },
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Create Question Attachment
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
              setSnackbarMessage("Attachment uploaded successfully.");
              setSnackbarSeverity("success");
              setSnackbarOpen(true);

              setTimeout(() => {
                window.location.href = "/questionAttachments";
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

            {/* Question Dropdown */}
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth size="small" required>
                <InputLabel>Question</InputLabel>
                <Select
                  name="questionId"
                  value={formData.questionId}
                  label="Question"
                  onChange={handleSelectChange}
                  disabled={isSubmitting}
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

            {/* File Upload */}
            <Grid size={{ xs: 12 }}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadFile />}
                disabled={isSubmitting}
              >
                Upload File (Image or PDF)
                <input
                  hidden
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileSelect}
                />
              </Button>

              {/* Image Preview */}
              {preview && (
                <Box sx={{ mt: 2 }}>
                  <Avatar
                    src={preview}
                    variant="rounded"
                    sx={{ width: 120, height: 120 }}
                  />
                </Box>
              )}

              {/* PDF Preview */}
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
                  {isSubmitting ? "Uploading..." : "Create Attachment"}
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
