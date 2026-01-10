"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Grid,
  Alert,
  FormControlLabel,
  Checkbox,
  Skeleton,
} from "@mui/material";

import { Save, Cancel } from "@mui/icons-material";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { useFirmDetailsViewModel } from "@/lib/features/firm/useFirmDetailsViewModel";
import { useUpdateFirm } from "@/lib/features/firm/useUpdateFirm";

export default function EditFirm() {
  const { id } = useParams();
  const router = useRouter();

  const { firm, isLoading, error } = useFirmDetailsViewModel(id as string);
  const {
    handleUpdate,
    isLoading: isSubmitting,
    error: updateError,
  } = useUpdateFirm();

  const [formData, setFormData] = useState({
    firmName: "",
    firmCode: "",
    isActive: true,
  });

  // Load initial form values
  useEffect(() => {
    if (firm) {
      setFormData({
        firmName: firm.firmName,
        firmCode: firm.firmCode,
        isActive: firm.isActive,
      });
    }
  }, [firm]);

  // Handle input changes
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  // Submit handler
  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (!firm) return;

    const success = await handleUpdate({
      firmId: firm.firmId,
      firmName: formData.firmName,
      firmCode: formData.firmCode,
      isActive: formData.isActive,
    });

    if (success) {
      router.push("/firms"); // Redirect to list page
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
        <Skeleton variant="text" width={300} height={40} />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={400}
          sx={{ mt: 2 }}
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Edit Firm
      </Typography>

      {(error || updateError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || updateError}
        </Alert>
      )}

      <Paper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0" }}>
        <form onSubmit={onSubmit}>
          <Grid container spacing={2}>
            {/* Section Title */}
            <Grid size={{ xs: 12 }}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 1, color: "text.secondary" }}
              >
                Firm Information
              </Typography>
            </Grid>

            {/* Firm Name */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Firm Name"
                name="firmName"
                value={formData.firmName}
                onChange={handleChange}
                required
                size="small"
                disabled={isSubmitting}
              />
            </Grid>

            {/* Firm Code */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Firm Code"
                name="firmCode"
                value={formData.firmCode}
                onChange={handleChange}
                required
                size="small"
                disabled={isSubmitting}
              />
            </Grid>

            {/* Active Status */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleCheckboxChange}
                    disabled={isSubmitting}
                  />
                }
                label="Active Status"
              />
            </Grid>

            {/* Buttons */}
            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Link href={`/firms/${id}`} passHref>
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
                  {isSubmitting ? "Updating..." : "Update Firm"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}
