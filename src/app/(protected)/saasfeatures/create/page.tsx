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
  FormControlLabel,
  Switch,
} from "@mui/material";

import { Save, Cancel } from "@mui/icons-material";
import Link from "next/link";

import useCreateSaaSFeatureViewModel from "@/lib/features/saasfeature/useCreateSaaSFeatureViewModel";

/* ===============================
   Page
================================ */

export default function CreateSaaSFeaturePage() {
  const {
    formData,
    handleChange,
    handleSubmit,
    isSubmitting,
  } = useCreateSaaSFeatureViewModel();

  /* Snackbar */
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  return (
    <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Create SaaS Feature
      </Typography>

      <Paper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0" }}>
        <form
          onSubmit={async (e) => {
            const result = await handleSubmit(e);

            if (result?.success) {
              setSnackbarMessage("Feature created successfully");
              setSnackbarOpen(true);

              setTimeout(() => {
                window.location.href = "/saasfeatures";
              }, 1200);
            }
          }}
        >
          <Grid container spacing={2}>
            {/* Feature Key */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                required
                label="Feature Key"
                name="featureKey"
                value={formData.featureKey}
                onChange={handleChange}
                size="small"
                disabled={isSubmitting}
                placeholder="e.g. EXAMS"
              />
            </Grid>

            {/* Feature Name */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                required
                label="Feature Name"
                name="featureName"
                value={formData.featureName}
                onChange={handleChange}
                size="small"
                disabled={isSubmitting}
                placeholder="e.g. Exams Management"
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
                disabled={isSubmitting}
              />
            </Grid>

            {/* Active Switch */}
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    name="isActive"
                    onChange={handleChange}
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
                  {isSubmitting ? "Creating..." : "Create Feature"}
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
        <Alert severity="success" variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
