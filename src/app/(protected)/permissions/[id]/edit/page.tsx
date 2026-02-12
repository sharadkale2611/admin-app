// permissions/[id]/edit/page.tsx
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

import useEditPermissionViewModel from "@/lib/features/permission/useEditPermissionViewModel";
import { ApiError } from "@/lib/features/permission/permissionTypes";

/* ===============================
   Field Labels (for errors)
================================ */

const fieldLabels: Record<string, string> = {
  permissionKey: "Permission Key",
  module: "Module",
  description: "Description",
  isActive: "Status",

  // API PascalCase
  PermissionKey: "Permission Key",
  Module: "Module",
  Description: "Description",
  IsActive: "Status",
};

/* ===============================
   Error Renderer
================================ */

function renderErrorContent(error: ApiError | null) {
  if (!error) return null;

  return (
    <div className="text-red-600">
      {error.error && (
        <h4 className="font-semibold mb-2">{error.error}</h4>
      )}

      {error.errors && (
        <ul className="list-disc list-inside space-y-1">
          {Object.entries(error.errors).map(([field, messages]) =>
            messages.map((msg, i) => (
              <li key={`${field}-${i}`}>
                <strong>{fieldLabels[field] || field}:</strong>{" "}
                {msg}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

export default function EditPermissionPage() {
  const {
    formData,
    isSubmitting,
    error,
    loading,
    handleChange,
    handleBooleanChange,
    handleSubmit,
  } = useEditPermissionViewModel();

  /* Snackbar */
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error"
  >("success");

  const handleSnackbarClose = () => setSnackbarOpen(false);

  return (
    <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Edit Permission
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {renderErrorContent(error)}
        </Alert>
      )}

      <Paper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0" }}>
        <form
          onSubmit={async (e) => {
            const result = await handleSubmit(e);

            if (result?.success) {
              setSnackbarMessage(result.message);
              setSnackbarSeverity("success");
              setSnackbarOpen(true);

              setTimeout(() => {
                window.location.href = "/permissions";
              }, 1500);
            }
          }}
        >
          <Grid container spacing={2}>
            {/* Permission Info */}
            <Grid size={{ xs: 12 }}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 1, color: "text.secondary" }}
              >
                Permission Information
              </Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Permission Key"
                name="permissionKey"
                value={formData.permissionKey}
                onChange={handleChange}
                required
                size="small"
                disabled={loading || isSubmitting}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Module"
                name="module"
                value={formData.module}
                onChange={handleChange}
                required
                size="small"
                disabled={loading || isSubmitting}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                size="small"
                multiline
                minRows={3}
                disabled={loading || isSubmitting}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={handleBooleanChange}
                    name="isActive"
                    color="primary"
                    disabled={loading || isSubmitting}
                  />
                }
                label="Active"
              />
            </Grid>

            {/* Actions */}
            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Link href="/permissions" passHref>
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
                  color="primary"
                  startIcon={<Save />}
                  size="small"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update Permission"}
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
        <Alert
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
