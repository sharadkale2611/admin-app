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

import useCreateSubscriptionPlanViewModel from "@/lib/features/subscriptionPlan/useCreateSubscriptionPlanViewModel";

/* ===============================
   Page
================================ */

export default function CreateSubscriptionPlanPage() {
  const {
    formData,
    handleChange,
    handleSelectChange,
    handleSubmit,
    isSubmitting,
  } = useCreateSubscriptionPlanViewModel();

  /* Snackbar */
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  return (
    <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Create Subscription Plan
      </Typography>

      <Paper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0" }}>
        <form
          onSubmit={async (e) => {
            const result = await handleSubmit(e);

            if (result?.success) {
              setSnackbarMessage("Subscription Plan created successfully");
              setSnackbarOpen(true);

              setTimeout(() => {
                window.location.href = "/subscriptionplans";
              }, 1200);
            }
          }}
        >
          <Grid container spacing={2}>
            {/* Plan Code */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                required
                label="Plan Code"
                name="planCode"
                value={formData.planCode}
                onChange={handleChange}
                size="small"
                disabled={isSubmitting}
                placeholder="e.g. BASIC"
              />
            </Grid>

            {/* Plan Name */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                required
                label="Plan Name"
                name="planName"
                value={formData.planName}
                onChange={handleChange}
                size="small"
                disabled={isSubmitting}
                placeholder="e.g. Basic Plan"
              />
            </Grid>

            {/* Price */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                required
                type="number"
                label="Price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                size="small"
                disabled={isSubmitting}
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
              >
                <MenuItem value="Monthly">Monthly</MenuItem>
                <MenuItem value="Yearly">Yearly</MenuItem>
              </TextField>
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
                <Link href="/subscriptionplans">
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
                  {isSubmitting ? "Creating..." : "Create Plan"}
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
