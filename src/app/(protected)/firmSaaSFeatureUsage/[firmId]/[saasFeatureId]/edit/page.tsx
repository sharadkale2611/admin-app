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

import useEditFirmSaaSFeatureUsageViewModel from "@/lib/features/firmSaaSFeatureUsage/useEditFirmSaaSFeatureUsageViewModel";
import type { ApiError } from "@/lib/features/firmSaaSFeatureUsage/firmSaaSFeatureUsageTypes";

import { useSaaSFeatureViewModel } from "@/lib/features/saasfeature/useSaaSFeatureViewModel";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import type { RootState } from "@/lib/store";
import { fetchFirms } from "@/lib/features/firm/firmThunks";

const fieldLabels: Record<string, string> = {
  usedCount: "Used Count",
  UsedCount: "Used Count",
};

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

export default function EditFirmSaaSFeatureUsagePage() {
  const dispatch = useAppDispatch();

  const { formData, isSubmitting, error, loading, handleChange, handleSubmit } =
    useEditFirmSaaSFeatureUsageViewModel();

  // Firms for readonly dropdown label
  const { firms } = useAppSelector((state: RootState) => state.firms);

  // SaaS Features for readonly dropdown label
  const { saasFeatures } = useSaaSFeatureViewModel();

  useEffect(() => {
    // fetch first page so the dropdown can show a proper label
    dispatch(fetchFirms({ page: 1, searchTerm: "", activeOnly: true }));
  }, [dispatch]);

  const firmIdNum = Number(formData.firmId);
  const saasFeatureIdNum = Number(formData.saaSFeatureId);

  const firmLabelById = useMemo(() => {
    const map = new Map<number, string>();
    (firms ?? []).forEach((f: any) => {
      const label =
        f?.firmName ??
        f?.name ??
        f?.companyName ??
        f?.firmCompanyName ??
        `Firm #${f?.firmId ?? ""}`;
      map.set(Number(f.firmId), label);
    });
    return map;
  }, [firms]);

  const saasLabelById = useMemo(() => {
    const map = new Map<number, string>();
    (saasFeatures ?? []).forEach((f) => {
      map.set(f.saaSFeatureId, `${f.featureName} (${f.featureKey})`);
    });
    return map;
  }, [saasFeatures]);

  const firmSelectedLabel =
    (Number.isFinite(firmIdNum) && firmLabelById.get(firmIdNum)) || (formData.firmId ? `Firm #${formData.firmId}` : "");

  const saasSelectedLabel =
    (Number.isFinite(saasFeatureIdNum) && saasLabelById.get(saasFeatureIdNum)) ||
    (formData.saaSFeatureId ? `Feature #${formData.saaSFeatureId}` : "");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<"success" | "error">("success");

  return (
    <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Edit Usage Record
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
                window.location.href = "/firmSaaSFeatureUsage";
              }, 1200);
            } else {
              setSnackbarMessage("Update failed");
              setSnackbarSeverity("error");
              setSnackbarOpen(true);
            }
          }}
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 1, color: "text.secondary" }}
              >
                Keys
              </Typography>
            </Grid>

            {/* Firm (readonly dropdown) */}
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth size="small" disabled>
                <InputLabel>Firm</InputLabel>
                <Select label="Firm" value={formData.firmId || ""}>
                  <MenuItem value={formData.firmId || ""}>
                    {firmSelectedLabel || <em>—</em>}
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* SaaS Feature (readonly dropdown) */}
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth size="small" disabled>
                <InputLabel>SaaS Feature</InputLabel>
                <Select label="SaaS Feature" value={formData.saaSFeatureId || ""}>
                  <MenuItem value={formData.saaSFeatureId || ""}>
                    {saasSelectedLabel || <em>—</em>}
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Used Count */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                required
                label="Used Count"
                name="usedCount"
                value={formData.usedCount}
                onChange={handleChange}
                size="small"
                disabled={loading || isSubmitting}
              />
            </Grid>

            {/* Buttons */}
            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Link href="/firmSaaSFeatureUsage">
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
                  {isSubmitting ? "Updating..." : "Update Usage"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbarSeverity} variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}