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

import useEditQuestionTypeRuleViewModel from "@/lib/features/questionTypeRule/useEditQuestionTypeRuleViewModel";
import { useQuestionTypeViewModel } from "@/lib/features/questionType/useQuestionTypeViewModel";
import { ApiError } from "@/lib/features/questionTypeRule/questionTypeRuleTypes";

/* ===============================
   Field Labels
================================ */

const fieldLabels: Record<string, string> = {
  questionTypeId: "Question Type",
  minOptions: "Minimum Options",
  maxOptions: "Maximum Options",
  maxSelections: "Maximum Selections",
  maxTextLength: "Maximum Text Length",
  isRegexAnswerAllowed: "Regex Allowed",
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

export default function EditQuestionTypeRulePage() {
  const {
    formData,
    isSubmitting,
    error,
    loading,
    handleChange,
    handleBooleanChange,
    handleSelectChange,
    handleSubmit,
  } = useEditQuestionTypeRuleViewModel();

  /* 🔹 Load Question Types */
  const {
    questionTypes,
    isLoading: isLoadingQuestionTypes,
  } = useQuestionTypeViewModel();

  /* Snackbar */
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<"success" | "error">("success");

  return (
    <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Edit Question Type Rule
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
                  "/questionTypeRules";
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
                Rule Configuration
              </Typography>
            </Grid>

            {/* 🔹 Question Type Dropdown */}
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth size="small" required>
                <InputLabel>Question Type</InputLabel>
                <Select
                  name="questionTypeId"
                  value={formData.questionTypeId}
                  label="Question Type"
                  onChange={handleSelectChange}
                  disabled={
                    loading ||
                    isSubmitting ||
                    isLoadingQuestionTypes
                  }
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

            {/* Min Options */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Minimum Options"
                name="minOptions"
                value={formData.minOptions}
                onChange={handleChange}
                size="small"
                disabled={loading || isSubmitting}
                type="number"
              />
            </Grid>

            {/* Max Options */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Maximum Options"
                name="maxOptions"
                value={formData.maxOptions}
                onChange={handleChange}
                size="small"
                disabled={loading || isSubmitting}
                type="number"
              />
            </Grid>

            {/* Max Selections */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Maximum Selections"
                name="maxSelections"
                value={formData.maxSelections}
                onChange={handleChange}
                size="small"
                disabled={loading || isSubmitting}
                type="number"
              />
            </Grid>

            {/* Max Text Length */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Maximum Text Length"
                name="maxTextLength"
                value={formData.maxTextLength}
                onChange={handleChange}
                size="small"
                disabled={loading || isSubmitting}
                type="number"
              />
            </Grid>

            {/* Regex Allowed */}
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isRegexAnswerAllowed}
                    onChange={handleBooleanChange}
                    name="isRegexAnswerAllowed"
                    color="primary"
                    disabled={loading || isSubmitting}
                  />
                }
                label="Allow Regex Answers"
              />
            </Grid>

            {/* Actions */}
            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Link href="/questionTypeRules">
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
                    : "Update Rule"}
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
        <Alert severity={snackbarSeverity} variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
