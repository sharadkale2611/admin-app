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

import { useSubscriptionPlanViewModel } from "@/lib/features/subscriptionPlan/useSubscriptionPlanViewModel";
import { useDeleteSubscriptionPlanViewModel } from "@/lib/features/subscriptionPlan/useDeleteSubscriptionPlanViewModel";

import { ApiError } from "@/lib/features/subscriptionPlan/subscriptionPlanTypes";

export default function SubscriptionPlansPage() {
  const { subscriptionPlans, isLoading, error, refetch } =
    useSubscriptionPlanViewModel();

  const { handleDelete } = useDeleteSubscriptionPlanViewModel();

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
          Subscription Plans
        </Typography>

        <Stack direction="row" spacing={1}>
          <IconButton onClick={refetch} color="primary">
            <Refresh />
          </IconButton>

          <Link href="/subscriptionplans/create">
            <Button
              variant="contained"
              startIcon={<Add />}
            >
              Add Plan
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
                <TableCell>Plan Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Billing Cycle</TableCell>
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
              ) : subscriptionPlans.length === 0 ? (

                /* ===== Empty ===== */

                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                    sx={{ py: 4 }}
                  >
                    <Typography color="text.secondary">
                      No Subscription Plans found
                    </Typography>
                  </TableCell>
                </TableRow>

              ) : (

                /* ===== Data ===== */

                subscriptionPlans.map((p) => (
                  <TableRow key={p.planId} hover>
                    <TableCell>
                      <Typography fontWeight="medium">
                        #{p.planId}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      {p.planCode}
                    </TableCell>

                    <TableCell>
                      {p.planName}
                    </TableCell>

                    <TableCell>
                      ₹ {p.price}
                    </TableCell>

                    <TableCell>
                      {p.billingCycle}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={
                          p.isActive
                            ? "Active"
                            : "Inactive"
                        }
                        color={
                          p.isActive
                            ? "success"
                            : "default"
                        }
                        size="small"
                      />
                    </TableCell>

                    {/* ===== ACTIONS ===== */}

                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Link href={`/subscriptionplans/${p.planId}`}>
                          <IconButton size="small" color="primary">
                            <Visibility />
                          </IconButton>
                        </Link>

                        <Link href={`/subscriptionplans/${p.planId}/edit`}>
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
                                p.planId,
                                p.planName
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
