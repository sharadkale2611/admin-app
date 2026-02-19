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
  MenuItem,
} from "@mui/material";

import { Save, Cancel } from "@mui/icons-material";
import Link from "next/link";

import useEditPlanSaaSFeatureViewModel from "@/lib/features/plansaasfeature/useEditPlanSaaSFeatureViewModel";
import { ApiError } from "@/lib/features/plansaasfeature/planSaaSFeatureTypes";

/* ===============================
   Field Labels
================================ */

const fieldLabels: Record<string, string> = {
  planId: "Subscription Plan",
  saaSFeatureId: "SaaS Feature",
  isEnabled: "Enabled",
  limitType: "Limit Type",
  limitValue: "Limit Value",
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

export default function EditPlanSaaSFeaturePage() {
  const {
    formData,
    isSubmitting,
    error,
    loading,
    handleChange,
    handleSelectChange,
    handleSubmit,
    subscriptionPlans,
    saasFeatures,
  } = useEditPlanSaaSFeatureViewModel();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<"success" | "error">("success");

  const handleSnackbarClose = () => setSnackbarOpen(false);

  return (
    <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Edit Plan Feature Mapping
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
                window.location.href = "/plansaasfeatures";
              }, 1200);
            }
          }}
        >
          <Grid container spacing={2}>
            {/* Plan Dropdown (Disabled) */}
            <Grid size={{ xs: 12 }}>
              <TextField
                select
                fullWidth
                label="Subscription Plan"
                name="planId"
                value={formData.planId}
                size="small"
                disabled
              >
                {subscriptionPlans.map((p: any) => (
                  <MenuItem key={p.planId} value={p.planId}>
                    {p.planName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Feature Dropdown (Disabled) */}
            <Grid size={{ xs: 12 }}>
              <TextField
                select
                fullWidth
                label="SaaS Feature"
                name="saaSFeatureId"
                value={formData.saaSFeatureId}
                size="small"
                disabled
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
                value={formData.limitType ?? ""}
                onChange={handleSelectChange}
                size="small"
                disabled={loading || isSubmitting}
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
                value={formData.limitValue ?? ""}
                onChange={handleChange}
                size="small"
                disabled={loading || isSubmitting}
              />
            </Grid>

            {/* Enabled */}
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isEnabled}
                    onChange={handleChange}
                    name="isEnabled"
                    color="primary"
                    disabled={loading || isSubmitting}
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
                  {isSubmitting ? "Updating..." : "Update Mapping"}
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
