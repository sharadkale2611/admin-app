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
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import { Save, Cancel } from "@mui/icons-material";
import Link from "next/link";

import useEditFirmSaaSFeatureViewModel from "@/lib/features/firmSaaSFeature/useEditFirmSaaSFeatureViewModel";
import { ApiError } from "@/lib/features/firmSaaSFeature/firmSaaSFeatureTypes";

import { useSaaSFeatureViewModel } from "@/lib/features/saasfeature/useSaaSFeatureViewModel";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import type { RootState } from "@/lib/store";
import { fetchFirms } from "@/lib/features/firm/firmThunks";

/* ===============================
   Field Labels (for backend validation keys)
================================ */

const fieldLabels: Record<string, string> = {
  firmId: "Firm",
  saaSFeatureId: "SaaS Feature",
  isEnabled: "Enabled",
  limitType: "Limit Type",
  limitValue: "Limit Value",

  FirmId: "Firm",
  SaaSFeatureId: "SaaS Feature",
  IsEnabled: "Enabled",
  LimitType: "Limit Type",
  LimitValue: "Limit Value",
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
          (messages ?? []).map((msg, i) => (
            <div key={`${field}-${i}`}>
              <strong>{fieldLabels[field] || field}:</strong> {msg}
            </div>
          ))
        )}
    </div>
  );
}

export default function EditFirmSaaSFeaturePage() {
  const dispatch = useAppDispatch();

  const {
    formData,
    isSubmitting,
    error,
    loading,
    handleChange,
    handleSubmit,
  } = useEditFirmSaaSFeatureViewModel();

  // Firms dropdown data (paginated thunk; we fetch first page)
  const { firms, loading: firmsLoading } = useAppSelector(
    (state: RootState) => state.firms
  );

  // SaaS Features dropdown data
  const { saasFeatures } = useSaaSFeatureViewModel();

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

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<"success" | "error">("success");

  const handleSnackbarClose = () => setSnackbarOpen(false);

  return (
    <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Edit Firm SaaS Feature
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
              setSnackbarMessage(result.message ?? "Updated successfully");
              setSnackbarSeverity("success");
              setSnackbarOpen(true);

              setTimeout(() => {
                window.location.href = "/firmSaaSFeatures";
              }, 1200);
            } else if (result?.success === false) {
              setSnackbarMessage("Update failed");
              setSnackbarSeverity("error");
              setSnackbarOpen(true);
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
                Firm SaaS Feature Mapping
              </Typography>
            </Grid>

            {/* Firm Search */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Search Firm"
                value={firmSearch}
                onChange={(e) => setFirmSearch(e.target.value)}
                size="small"
                disabled={loading || isSubmitting}
                placeholder="Type firm name..."
              />
            </Grid>

            {/* Firm */}
            <Grid size={{ xs: 12 }}>
              <FormControl
                fullWidth
                size="small"
                required
                disabled={loading || isSubmitting || firmsLoading}
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
              <FormControl fullWidth size="small" required disabled={loading || isSubmitting}>
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
                    <MenuItem key={f.saaSFeatureId} value={String(f.saaSFeatureId)}>
                      {f.featureName} ({f.featureKey})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Enabled */}
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={Boolean(formData.isEnabled)}
                    onChange={handleChange}
                    name="isEnabled"
                    color="primary"
                    disabled={loading || isSubmitting}
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
                disabled={loading || isSubmitting}
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
                disabled={loading || isSubmitting}
              />
            </Grid>

            {/* Buttons */}
            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Link href="/firmSaaSFeatures">
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