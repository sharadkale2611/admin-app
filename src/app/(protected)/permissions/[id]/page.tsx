// permissions/[id]/page.tsx
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
  Security,
  Event,
  Info,
  ToggleOn,
} from "@mui/icons-material";

import { usePermissionDetailsViewModel } from "@/lib/features/permission/usePermissionDetailsViewModel";

export default function PermissionDetails() {
  const { id } = useParams();
  const { permission, isLoading, error } =
    usePermissionDetailsViewModel(id as string);

  const formatDate = (dateString: string | null | undefined) => {
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
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Skeleton variant="rectangular" width="100%" height={400} />
      </Container>
    );
  }

  /* ===============================
     Error
  ================================ */

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load permission details
        </Alert>
        <Link href="/permissions" passHref>
          <Button startIcon={<ArrowBack />} variant="outlined">
            Back to Permissions
          </Button>
        </Link>
      </Container>
    );
  }

  /* ===============================
     Not Found
  ================================ */

  if (!permission) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Permission not found
        </Alert>
        <Link href="/permissions" passHref>
          <Button startIcon={<ArrowBack />} variant="outlined">
            Back to Permissions
          </Button>
        </Link>
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
          alignItems: "center",
          justifyContent: "space-between",
          mb: 4,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Link href="/permissions" passHref>
            <Button startIcon={<ArrowBack />} variant="outlined" size="small">
              Back
            </Button>
          </Link>
          <Typography variant="h4">Permission Details</Typography>
        </Box>

        <Chip
          label={permission.isActive ? "Active" : "Inactive"}
          color={permission.isActive ? "success" : "default"}
          variant="filled"
        />
      </Box>

      <Grid container spacing={3}>
        {/* Left Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, textAlign: "center" }} elevation={2}>
            <Security
              sx={{
                fontSize: 80,
                color: "primary.main",
                mb: 2,
              }}
            />

            <Typography variant="h5" gutterBottom>
              {permission.permissionKey}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Module: {permission.module}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Stack spacing={1} alignItems="flex-start">
              <Box sx={{ display: "flex", gap: 1 }}>
                <Event fontSize="small" />
                <Typography variant="body2">
                  {formatDate(permission.createdAt)}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <ToggleOn fontSize="small" />
                <Typography variant="body2">
                  Status: {permission.isActive ? "Active" : "Inactive"}
                </Typography>
              </Box>
            </Stack>

            <Box sx={{ mt: 3 }}>
              <Link href={`/permissions/${id}/edit`} passHref>
                <Button variant="contained" startIcon={<Edit />} fullWidth>
                  Edit Permission
                </Button>
              </Link>
            </Box>
          </Paper>
        </Grid>

        {/* Right Card */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Permission Information
              </Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                    <Info fontSize="small" color="primary" />
                    <Typography variant="subtitle2">
                      Description
                    </Typography>
                  </Box>
                  <Typography variant="body1">
                    {permission.description || "No description"}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                System Information
              </Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Permission ID
                  </Typography>
                  <Typography variant="body2">
                    {permission.permissionId}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Module
                  </Typography>
                  <Typography variant="body2">
                    {permission.module}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Created On
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(permission.createdAt)}
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
