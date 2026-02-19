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

import useEditSubscriptionPlanViewModel from "@/lib/features/subscriptionPlan/useEditSubscriptionPlanViewModel";
import { ApiError } from "@/lib/features/subscriptionPlan/subscriptionPlanTypes";

/* ===============================
   Field Labels
================================ */

const fieldLabels: Record<string, string> = {
  planCode: "Plan Code",
  planName: "Plan Name",
  price: "Price",
  billingCycle: "Billing Cycle",
  isActive: "Status",
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

export default function EditSubscriptionPlanPage() {
  const {
    formData,
    isSubmitting,
    error,
    loading,
    handleChange,
    handleSelectChange,
    handleSubmit,
  } = useEditSubscriptionPlanViewModel();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<"success" | "error">("success");

  const handleSnackbarClose = () => setSnackbarOpen(false);

  return (
    <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Edit Subscription Plan
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

            const result = await handleSubmit(e);

            if (result?.success) {
              setSnackbarMessage(result.message ?? "");
              setSnackbarSeverity("success");
              setSnackbarOpen(true);

              setTimeout(() => {
                window.location.href = "/subscriptionplans";
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
                Subscription Plan Information
              </Typography>
            </Grid>

            {/* Plan Code */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Plan Code"
                name="planCode"
                value={formData.planCode}
                size="small"
                disabled
              />
            </Grid>

            {/* Plan Name */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Plan Name"
                name="planName"
                value={formData.planName}
                onChange={handleChange}
                required
                size="small"
                disabled={loading || isSubmitting}
              />
            </Grid>

            {/* Price */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                type="number"
                label="Price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                size="small"
                disabled={loading || isSubmitting}
              />
            </Grid>

            {/* Billing Cycle */}
            <Grid size={{ xs: 12 }}>
              <TextField
                select
                fullWidth
                label="Billing Cycle"
                name="billingCycle"
                value={formData.billingCycle}
                onChange={handleSelectChange}
                size="small"
                disabled={loading || isSubmitting}
              >
                <MenuItem value="Monthly">Monthly</MenuItem>
                <MenuItem value="Yearly">Yearly</MenuItem>
              </TextField>
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
                <Link href="/subscriptionplans">
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
                  {isSubmitting ? "Updating..." : "Update Plan"}
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
