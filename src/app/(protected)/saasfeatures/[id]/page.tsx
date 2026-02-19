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
  Event,
  Info,
  ToggleOn,
} from "@mui/icons-material";

import { useSaaSFeatureDetailsViewModel } from "@/lib/features/saasfeature/useSaaSFeatureDetailsViewModel";

export default function SaaSFeatureDetailsPage() {
  const { id } = useParams();

  const { saasFeature, isLoading, error } =
    useSaaSFeatureDetailsViewModel(id as string);

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "Not specified";

    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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
          Failed to load SaaS feature
        </Alert>

        <Link href="/saasfeatures">
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

  if (!saasFeature) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="warning">Feature not found</Alert>
      </Container>
    );
  }

  /* ===============================
     Page
  ================================ */

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          <Link href="/saasfeatures">
            <Button startIcon={<ArrowBack />} variant="outlined" size="small">
              Back
            </Button>
          </Link>

          <Typography variant="h4">SaaS Feature Details</Typography>
        </Box>

        <Chip
          label={saasFeature.isActive ? "Active" : "Inactive"}
          color={saasFeature.isActive ? "success" : "default"}
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

            <Typography variant="h5">
              {saasFeature.featureKey}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {saasFeature.featureName}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Stack spacing={1} alignItems="flex-start">
              <Box sx={{ display: "flex", gap: 1 }}>
                <Info fontSize="small" />
                <Typography variant="body2">
                  {saasFeature.description || "No description"}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Event fontSize="small" />
                <Typography variant="body2">
                  Created: {formatDate(saasFeature.createdAt)}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <ToggleOn fontSize="small" />
                <Typography variant="body2">
                  Status: {saasFeature.isActive ? "Active" : "Inactive"}
                </Typography>
              </Box>
            </Stack>

            <Box sx={{ mt: 3 }}>
              <Link href={`/saasfeatures/${id}/edit`}>
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  fullWidth
                >
                  Edit Feature
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
                Feature Information
              </Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Feature Key
                  </Typography>
                  <Typography variant="body2">
                    {saasFeature.featureKey}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Feature Name
                  </Typography>
                  <Typography variant="body2">
                    {saasFeature.featureName}
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
                    Feature ID
                  </Typography>
                  <Typography variant="body2">
                    {saasFeature.saaSFeatureId}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Created On
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(saasFeature.createdAt)}
                  </Typography>
                </Grid>

                {saasFeature.updatedAt && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Updated On
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(saasFeature.updatedAt)}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
