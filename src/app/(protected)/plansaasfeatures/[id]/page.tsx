"use client";

import React from "react";
import { useParams } from "next/navigation";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Box,
  Paper,
  Grid,
  Skeleton,
  Alert,
  Divider,
  Stack,
} from "@mui/material";

import Link from "next/link";
import {
  ArrowBack,
  Edit,
 Settings,
  Info,
  ToggleOn,
} from "@mui/icons-material";

import { usePlanSaaSFeatureDetailsViewModel } from "@/lib/features/plansaasfeature/usePlanSaaSFeatureDetailsViewModel";

export default function PlanSaaSFeatureDetailsPage() {
  const { id } = useParams();

  const { planSaaSFeature, isLoading, error } =
    usePlanSaaSFeatureDetailsViewModel(id as string);

  /* ===============================
     Loading
  ================================ */

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Skeleton variant="rectangular" width="100%" height={400} />
      </Container>
    );
  }

  /* ===============================
     Error
  ================================ */

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load Plan Feature
        </Alert>

        <Link href="/plansaasfeatures">
          <Button startIcon={<ArrowBack />} variant="outlined">
            Back
          </Button>
        </Link>
      </Container>
    );
  }

  /* ===============================
     Not Found
  ================================ */

  if (!planSaaSFeature) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="warning">Record not found</Alert>
      </Container>
    );
  }

  /* ===============================
     Page
  ================================ */

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* ===== Header ===== */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          <Link href="/plansaasfeatures">
            <Button startIcon={<ArrowBack />} variant="outlined" size="small">
              Back
            </Button>
          </Link>

          <Typography variant="h4">
            Plan Feature Details
          </Typography>
        </Box>

        <Chip
          label={planSaaSFeature.isEnabled ? "Enabled" : "Disabled"}
          color={planSaaSFeature.isEnabled ? "success" : "default"}
        />
      </Box>

      <Grid container spacing={3}>
        {/* LEFT CARD */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, textAlign: "center" }} elevation={2}>
            <Settings
              sx={{
                fontSize: 80,
                color: "primary.main",
                mb: 2,
              }}
            />

            <Typography variant="h6">
              {planSaaSFeature.planName}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {planSaaSFeature.featureName}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Stack spacing={1} alignItems="flex-start">
              <Box sx={{ display: "flex", gap: 1 }}>
                <Info fontSize="small" />
                <Typography variant="body2">
                  Feature Key: {planSaaSFeature.featureKey}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <ToggleOn fontSize="small" />
                <Typography variant="body2">
                  Status: {planSaaSFeature.isEnabled ? "Enabled" : "Disabled"}
                </Typography>
              </Box>
            </Stack>

            <Box sx={{ mt: 3 }}>
              <Link href={`/plansaasfeatures/${id}/edit`}>
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  fullWidth
                >
                  Edit Mapping
                </Button>
              </Link>
            </Box>
          </Paper>
        </Grid>

        {/* RIGHT CARD */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Feature Configuration
              </Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Plan
                  </Typography>
                  <Typography variant="body2">
                    {planSaaSFeature.planName}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Feature
                  </Typography>
                  <Typography variant="body2">
                    {planSaaSFeature.featureName}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Limit Type
                  </Typography>
                  <Typography variant="body2">
                    {planSaaSFeature.limitType || "—"}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Limit Value
                  </Typography>
                  <Typography variant="body2">
                    {planSaaSFeature.limitValue ?? "Unlimited"}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" sx={{ mb: 3 }}>
                System Information
              </Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Mapping ID
                  </Typography>
                  <Typography variant="body2">
                    {planSaaSFeature.planSaaSFeatureId}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
