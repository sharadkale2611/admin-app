"use client";

import React, { useEffect, useMemo, useState } from "react";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import { Save, Cancel } from "@mui/icons-material";
import Link from "next/link";

import useCreateFirmSaaSFeatureViewModel from "@/lib/features/firmSaaSFeature/useCreateFirmSaaSFeatureViewModel";
import { useSaaSFeatureViewModel } from "@/lib/features/saasfeature/useSaaSFeatureViewModel";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import type { RootState } from "@/lib/store";
import { fetchFirms } from "@/lib/features/firm/firmThunks";

export default function CreateFirmSaaSFeaturePage() {
  const dispatch = useAppDispatch();

  const { formData, handleChange, handleSubmit, isSubmitting } =
    useCreateFirmSaaSFeatureViewModel();

  // SaaS Features dropdown data
  const { saasFeatures } = useSaaSFeatureViewModel();

  // Firms dropdown data
  const { firms, loading: firmsLoading } = useAppSelector(
    (state: RootState) => state.firms
  );

  // Firm search (server-side search via fetchFirms)
  const [firmSearch, setFirmSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      dispatch(
        fetchFirms({
          page: 1,
          searchTerm: firmSearch,
          activeOnly: true,
        })
      );
    }, 350);

    return () => clearTimeout(t);
  }, [dispatch, firmSearch]);

  const firmOptions = useMemo(() => firms ?? [], [firms]);

  const getFirmLabel = (f: any) =>
    f?.firmName ??
    f?.name ??
    f?.companyName ??
    f?.firmCompanyName ??
    `Firm #${f?.firmId ?? ""}`;

  /* Snackbar */
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  return (
    <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Create Firm SaaS Feature
      </Typography>

      <Paper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0" }}>
        <form
          onSubmit={async (e) => {
            const result = await handleSubmit(e);

            if (result?.success) {
              setSnackbarMessage("Firm SaaS Feature created successfully");
              setSnackbarOpen(true);

              setTimeout(() => {
                window.location.href = "/firmSaaSFeatures";
              }, 1200);
            }
          }}
        >
          <Grid container spacing={2}>
            {/* Firm Search */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Search Firm"
                value={firmSearch}
                onChange={(e) => setFirmSearch(e.target.value)}
                size="small"
                disabled={isSubmitting}
                placeholder="Type firm name..."
              />
            </Grid>

            {/* Firm Dropdown */}
            <Grid size={{ xs: 12 }}>
              <FormControl
                fullWidth
                size="small"
                required
                disabled={isSubmitting || firmsLoading}
              >
                <InputLabel>Firm</InputLabel>
                <Select
                  name="firmId"
                  value={formData.firmId}
                  label="Firm"
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    <em>{firmsLoading ? "Loading..." : "Select"}</em>
                  </MenuItem>

                  {firmOptions.map((f: any) => (
                    <MenuItem key={f.firmId} value={String(f.firmId)}>
                      {getFirmLabel(f)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* SaaS Feature */}
            <Grid size={{ xs: 12 }}>
              <FormControl
                fullWidth
                size="small"
                required
                disabled={isSubmitting}
              >
                <InputLabel>SaaS Feature</InputLabel>
                <Select
                  name="saaSFeatureId"
                  value={formData.saaSFeatureId}
                  label="SaaS Feature"
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    <em>Select</em>
                  </MenuItem>

                  {saasFeatures.map((f) => (
                    <MenuItem
                      key={f.saaSFeatureId}
                      value={String(f.saaSFeatureId)}
                    >
                      {f.featureName} ({f.featureKey})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Enabled Switch */}
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={Boolean(formData.isEnabled)}
                    name="isEnabled"
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                }
                label="Enabled"
              />
            </Grid>

            {/* Limit Type */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Limit Type"
                name="limitType"
                value={formData.limitType}
                onChange={handleChange}
                size="small"
                disabled={isSubmitting}
                placeholder='e.g. "DAILY" / "MONTHLY" (optional)'
              />
            </Grid>

            {/* Limit Value */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Limit Value"
                name="limitValue"
                value={formData.limitValue}
                onChange={handleChange}
                size="small"
                disabled={isSubmitting}
                placeholder="e.g. 100 (optional)"
              />
            </Grid>

            {/* Buttons */}
            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Link href="/firmSaaSFeatures">
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