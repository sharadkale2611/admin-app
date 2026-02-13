"use client";

import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Grid,
  Alert,
  Snackbar,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Save, Cancel } from "@mui/icons-material";
import Link from "next/link";

import useCreateQuestionTypeViewModel from "@/lib/features/questionType/useCreateQuestionTypeViewModel";
import { ApiError } from "@/lib/features/questionType/questionTypeTypes";

/* ===============================
   Field Labels (for errors)
================================ */

const fieldLabels: Record<string, string> = {
  code: "Code",
  name: "Name",
  evaluationMode: "Evaluation Mode",
  supportsOptions: "Supports Options",
  supportsAttachments: "Supports Attachments",

  // API PascalCase safety
  Code: "Code",
  Name: "Name",
  EvaluationMode: "Evaluation Mode",
  SupportsOptions: "Supports Options",
  SupportsAttachments: "Supports Attachments",
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

export default function CreateQuestionTypePage() {
  const {
    formData,
    isSubmitting,
    error,
    handleChange,
    handleSelectChange,
    handleSubmit,
  } = useCreateQuestionTypeViewModel();

  /* Snackbar */
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error"
  >("success");

  const handleSnackbarClose = () => setSnackbarOpen(false);

  return (
    <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Create New Question Type
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
                window.location.href = "/questionTypes";
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
                Question Type Information
              </Typography>
            </Grid>

            {/* Code */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                size="small"
                disabled={isSubmitting}
                placeholder="e.g. MCQ"
              />
            </Grid>

            {/* Name */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                size="small"
                disabled={isSubmitting}
                placeholder="e.g. Multiple Choice Question"
              />
            </Grid>

            {/* Evaluation Mode */}
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Evaluation Mode</InputLabel>
                <Select
                  name="evaluationMode"
                  value={formData.evaluationMode}
                  label="Evaluation Mode"
                  onChange={handleSelectChange}
                  disabled={isSubmitting}
                >
                  <MenuItem value="AUTO">AUTO</MenuItem>
                  <MenuItem value="MANUAL">MANUAL</MenuItem>
                  <MenuItem value="HYBRID">HYBRID</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Supports Options */}
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.supportsOptions}
                    onChange={(e) =>
                      handleSelectChange({
                        target: {
                          name: "supportsOptions",
                          value: String(e.target.checked),
                        },
                      } as any)
                    }
                    color="primary"
                  />
                }
                label="Supports Options"
              />
            </Grid>

            {/* Supports Attachments */}
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.supportsAttachments}
                    onChange={(e) =>
                      handleSelectChange({
                        target: {
                          name: "supportsAttachments",
                          value: String(e.target.checked),
                        },
                      } as any)
                    }
                    color="primary"
                  />
                }
                label="Supports Attachments"
              />
            </Grid>

            {/* Actions */}
            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Link href="/questionTypes" passHref>
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
                    ? "Creating..."
                    : "Create Question Type"}
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
        onClose={handleSnackbarClose}
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
