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
  MenuItem,
} from "@mui/material";

import { Save, Cancel } from "@mui/icons-material";
import Link from "next/link";

import useCreatePlanSaaSFeatureViewModel from "@/lib/features/plansaasfeature/useCreatePlanSaaSFeatureViewModel";

/* ===============================
   Page
================================ */

export default function CreatePlanSaaSFeaturePage() {
  const {
    formData,
    handleChange,
    handleSelectChange,
    handleSubmit,
    isSubmitting,
    subscriptionPlans,
    saasFeatures,
  } = useCreatePlanSaaSFeatureViewModel();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  return (
    <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Create Plan Feature Mapping
      </Typography>

      <Paper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0" }}>
        <form
          onSubmit={async (e) => {
            const result = await handleSubmit(e);

            if (result?.success) {
              setSnackbarMessage("Mapping created successfully");
              setSnackbarOpen(true);

              setTimeout(() => {
                window.location.href = "/plansaasfeatures";
              }, 1200);
            }
          }}
        >
          <Grid container spacing={2}>
            {/* Plan Dropdown */}
            <Grid size={{ xs: 12 }}>
              <TextField
                select
                fullWidth
                label="Subscription Plan"
                name="planId"
                value={formData.planId}
                onChange={handleSelectChange}
                size="small"
              >
                {subscriptionPlans.map((p: any) => (
                  <MenuItem key={p.planId} value={p.planId}>
                    {p.planName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Feature Dropdown */}
            <Grid size={{ xs: 12 }}>
              <TextField
                select
                fullWidth
                label="SaaS Feature"
                name="saaSFeatureId"
                value={formData.saaSFeatureId}
                onChange={handleSelectChange}
                size="small"
              >
                {saasFeatures.map((f: any) => (
                  <MenuItem key={f.saaSFeatureId} value={f.saaSFeatureId}>
                    {f.featureName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Limit Type */}
            <Grid size={{ xs: 12 }}>
              <TextField
                select
                fullWidth
                label="Limit Type"
                name="limitType"
                value={formData.limitType}
                onChange={handleSelectChange}
                size="small"
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="COUNT">COUNT</MenuItem>
                <MenuItem value="STAFF">STAFF</MenuItem>
                <MenuItem value="SMS">SMS</MenuItem>
                <MenuItem value="STORAGE_MB">STORAGE_MB</MenuItem>
              </TextField>
            </Grid>

            {/* Limit Value */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                type="number"
                label="Limit Value"
                name="limitValue"
                value={formData.limitValue}
                onChange={handleChange}
                size="small"
                placeholder="Leave empty for Unlimited"
              />
            </Grid>

            {/* Enabled Switch */}
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isEnabled}
                    name="isEnabled"
                    onChange={handleChange}
                  />
                }
                label="Enabled"
              />
            </Grid>

            {/* Buttons */}
            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Link href="/plansaasfeatures">
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
                  {isSubmitting ? "Creating..." : "Create Mapping"}
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
