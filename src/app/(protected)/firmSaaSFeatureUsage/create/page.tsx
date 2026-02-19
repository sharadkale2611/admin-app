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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import { Save, Cancel } from "@mui/icons-material";
import Link from "next/link";

import useCreateFirmSaaSFeatureUsageViewModel from "@/lib/features/firmSaaSFeatureUsage/useCreateFirmSaaSFeatureUsageViewModel";
import { useSaaSFeatureViewModel } from "@/lib/features/saasfeature/useSaaSFeatureViewModel";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import type { RootState } from "@/lib/store";
import { fetchFirms } from "@/lib/features/firm/firmThunks";

export default function CreateFirmSaaSFeatureUsagePage() {
  const dispatch = useAppDispatch();

  const { formData, handleChange, handleSubmit, isSubmitting } =
    useCreateFirmSaaSFeatureUsageViewModel();

  const { saasFeatures } = useSaaSFeatureViewModel();

  const { firms, loading: firmsLoading } = useAppSelector((s: RootState) => s.firms);
  const [firmSearch, setFirmSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      dispatch(fetchFirms({ page: 1, searchTerm: firmSearch, activeOnly: true }));
    }, 350);
    return () => clearTimeout(t);
  }, [dispatch, firmSearch]);

  const firmOptions = useMemo(() => firms ?? [], [firms]);

  // TODO: Replace firmName below with the exact display field from your Firm type
  const getFirmLabel = (f: any) => f?.firmName ?? `Firm #${f?.firmId ?? ""}`;

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  return (
    <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Create Firm SaaS Feature Usage
      </Typography>

      <Paper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0" }}>
        <form
          onSubmit={async (e) => {
            const result = await handleSubmit(e);
            if (result?.success) {
              setSnackbarMessage("Usage record created successfully");
              setSnackbarOpen(true);
              setTimeout(() => (window.location.href = "/firmSaaSFeatureUsage"), 1200);
            }
          }}
        >
          <Grid container spacing={2}>
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

            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth size="small" required disabled={isSubmitting || firmsLoading}>
                <InputLabel>Firm</InputLabel>
                <Select name="firmId" value={formData.firmId} label="Firm" onChange={handleChange}>
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

            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth size="small" required disabled={isSubmitting}>
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

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                required
                label="Used Count"
                name="usedCount"
                value={formData.usedCount}
                onChange={handleChange}
                size="small"
                disabled={isSubmitting}
                placeholder="0"
              />
            </Grid>

            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Link href="/firmSaaSFeatureUsage">
                  <Button variant="outlined" startIcon={<Cancel />} size="small" disabled={isSubmitting}>
                    Cancel
                  </Button>
                </Link>

                <Button type="submit" variant="contained" startIcon={<Save />} size="small" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Usage"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar open={snackbarOpen} autoHideDuration={2000} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity="success" variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}