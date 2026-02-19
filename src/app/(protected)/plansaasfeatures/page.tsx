"use client";

import React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Alert,
  Skeleton,
  Stack,
  Chip,
} from "@mui/material";

import {
  Add,
  Refresh,
  Visibility,
  Edit,
  Delete,
} from "@mui/icons-material";

import Link from "next/link";

import { usePlanSaaSFeatureViewModel } from "@/lib/features/plansaasfeature/usePlanSaaSFeatureViewModel";
import { useDeletePlanSaaSFeatureViewModel } from "@/lib/features/plansaasfeature/useDeletePlanSaaSFeatureViewModel";
import { ApiError } from "@/lib/features/plansaasfeature/planSaaSFeatureTypes";


export default function PlanSaaSFeaturesPage() {
  const { planSaaSFeatures, isLoading, error, refetch } =
    usePlanSaaSFeatureViewModel();

  const { handleDelete } = useDeletePlanSaaSFeatureViewModel();

  /* ===============================
     Error Renderer
  ================================ */

  function renderErrorContent(error: ApiError | null) {
    if (!error) return null;

    if (error.error) {
      return <div>{error.error}</div>;
    }

    if (error.errors && typeof error.errors === "object") {
      return Object.entries(error.errors).map(([k, v], i) => (
        <div key={i}>
          <strong>{k}:</strong>{" "}
          {Array.isArray(v) ? v.join(", ") : String(v)}
        </div>
      ));
    }

    return null;
  }

  /* ===============================
     Page
  ================================ */

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* ===== Header ===== */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">
          Plan SaaS Features
        </Typography>

        <Stack direction="row" spacing={1}>
          <IconButton onClick={refetch} color="primary">
            <Refresh />
          </IconButton>

          <Link href="/plansaasfeatures/create">
            <Button
              variant="contained"
              startIcon={<Add />}
            >
             Plan SaaS Features
            </Button>
          </Link>
        </Stack>
      </Box>

      {/* ===== Error ===== */}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {renderErrorContent(error)}
        </Alert>
      )}

      {/* ===== Table ===== */}

      <Paper elevation={2}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
               <TableCell>Plan</TableCell>
<TableCell>Feature</TableCell>
                <TableCell>Limit Type</TableCell>
                <TableCell>Limit Value</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {/* ===== Loading ===== */}

              {isLoading ? (
                Array.from(new Array(5)).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from(new Array(7)).map((__, j) => (
                      <TableCell key={j}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : planSaaSFeatures.length === 0 ? (

                /* ===== Empty ===== */

                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                    sx={{ py: 4 }}
                  >
                    <Typography color="text.secondary">
                      No Plan SaaS Features found
                    </Typography>
                  </TableCell>
                </TableRow>

              ) : (

                /* ===== Data ===== */

                planSaaSFeatures.map((p) => (
                  <TableRow key={p.planSaaSFeatureId} hover>
                    <TableCell>
                      <Typography fontWeight="medium">
                        #{p.planSaaSFeatureId}
                      </Typography>
                    </TableCell>

                   <TableCell>{p.planName}</TableCell>

<TableCell>
  <Stack>
    <Typography fontWeight="medium">
      {p.featureName}
    </Typography>
    <Typography variant="caption" color="text.secondary">
      {p.featureKey}
    </Typography>
  </Stack>
</TableCell>


                    <TableCell>
                      {p.limitType || "—"}
                    </TableCell>

                    <TableCell>
                      {p.limitValue ?? "Unlimited"}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={p.isEnabled ? "Enabled" : "Disabled"}
                        color={p.isEnabled ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>

                    {/* ===== ACTIONS ===== */}

                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Link
                          href={`/plansaasfeatures/${p.planSaaSFeatureId}`}
                        >
                          <IconButton size="small" color="primary">
                            <Visibility />
                          </IconButton>
                        </Link>

                        <Link
                          href={`/plansaasfeatures/${p.planSaaSFeatureId}/edit`}
                        >
                          <IconButton size="small" color="secondary">
                            <Edit />
                          </IconButton>
                        </Link>

                        <IconButton
                          size="small"
                          color="error"
                          onClick={async () => {
                            const success =
                              await handleDelete(
                                p.planSaaSFeatureId
                              );

                            if (success) refetch();
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))

              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}
