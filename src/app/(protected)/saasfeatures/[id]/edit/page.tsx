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
} from "@mui/material";

import { Save, Cancel } from "@mui/icons-material";
import Link from "next/link";

import useEditSaaSFeatureViewModel from "@/lib/features/saasfeature/useEditSaaSFeatureViewModel";
import { ApiError } from "@/lib/features/saasfeature/saasFeatureTypes";

/* ===============================
   Field Labels
================================ */

const fieldLabels: Record<string, string> = {
  featureKey: "Feature Key",
  featureName: "Feature Name",
  description: "Description",
  isActive: "Status",

  FeatureKey: "Feature Key",
  FeatureName: "Feature Name",
  Description: "Description",
  IsActive: "Status",
};

/* ===============================
   Error Renderer
================================ */

function renderErrorContent(error: ApiError | null) {
  if (!error) return null;

  return (
    <div>
      {error.error && <div>{error.error}</div>}

      {error.errors &&
        Object.entries(error.errors).map(([field, messages]) =>
          messages.map((msg, i) => (
            <div key={`${field}-${i}`}>
              <strong>{fieldLabels[field] || field}:</strong> {msg}
            </div>
          ))
        )}
    </div>
  );
}

/* ===============================
   Page
================================ */

export default function EditSaaSFeaturePage() {
  const {
    formData,
    isSubmitting,
    error,
    loading,
    handleChange,
    handleSubmit,
  } = useEditSaaSFeatureViewModel();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<"success" | "error">("success");

  const handleSnackbarClose = () => setSnackbarOpen(false);

  return (
    <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Edit SaaS Feature
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {renderErrorContent(error)}
        </Alert>
      )}

      <Paper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0" }}>
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            const result = await handleSubmit();

            if (result?.success) {
              setSnackbarMessage(result.message ?? "");
              setSnackbarSeverity("success");
              setSnackbarOpen(true);

              setTimeout(() => {
                window.location.href = "/saasfeatures";
              }, 1200);
            }
          }}
        >
          <Grid container spacing={2}>
            {/* Header */}
            <Grid size={{ xs: 12 }}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 1, color: "text.secondary" }}
              >
                SaaS Feature Information
              </Typography>
            </Grid>

            {/* Feature Key */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Feature Key"
                name="featureKey"
                value={formData.featureKey}
                size="small"
                disabled
              />
            </Grid>

            {/* Feature Name */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Feature Name"
                name="featureName"
                value={formData.featureName}
                onChange={handleChange}
                required
                size="small"
                disabled={loading || isSubmitting}
              />
            </Grid>

            {/* Description */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                size="small"
                multiline
                rows={3}
                disabled={loading || isSubmitting}
              />
            </Grid>

            {/* Active */}
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={handleChange}
                    name="isActive"
                    color="primary"
                    disabled={loading || isSubmitting}
                  />
                }
                label="Active"
              />
            </Grid>

            {/* Buttons */}
            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Link href="/saasfeatures">
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
                  {isSubmitting ? "Updating..." : "Update Feature"}
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
        <Alert severity={snackbarSeverity} variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
