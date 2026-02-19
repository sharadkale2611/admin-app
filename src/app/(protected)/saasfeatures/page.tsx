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

import { useSaaSFeatureViewModel } from "@/lib/features/saasfeature/useSaaSFeatureViewModel";
import { useDeleteSaaSFeature } from "@/lib/features/saasfeature/useDeleteSaaSFeatureViewModel";

import { ApiError } from "@/lib/features/saasfeature/saasFeatureTypes";

export default function SaaSFeaturesPage() {
  const { saasFeatures, isLoading, error, refetch } =
    useSaaSFeatureViewModel();

  const { handleDelete } = useDeleteSaaSFeature();

  /* ===============================
     Error Renderer (Same Pattern)
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
          SaaS Features
        </Typography>

        <Stack direction="row" spacing={1}>
          <IconButton onClick={refetch} color="primary">
            <Refresh />
          </IconButton>

          <Link href="/saasfeatures/create" passHref>
            <Button
              variant="contained"
              startIcon={<Add />}
            >
              Add Feature
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
                <TableCell>Feature Key</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {/* ===== Loading Skeleton ===== */}

              {isLoading ? (
                Array.from(new Array(5)).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from(new Array(6)).map((__, j) => (
                      <TableCell key={j}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : saasFeatures.length === 0 ? (

                /* ===== Empty State ===== */

                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{ py: 4 }}
                  >
                    <Typography color="text.secondary">
                      No SaaS Features found
                    </Typography>
                  </TableCell>
                </TableRow>

              ) : (

                /* ===== Data Rows ===== */

                saasFeatures.map((f) => (
                  <TableRow
                    key={f.saaSFeatureId}
                    hover
                  >
                    <TableCell>
                      <Typography fontWeight="medium">
                        #{f.saaSFeatureId}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      {f.featureKey}
                    </TableCell>

                    <TableCell>
                      {f.featureName}
                    </TableCell>

                    <TableCell>
                      {f.description ?? "—"}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={
                          f.isActive
                            ? "Active"
                            : "Inactive"
                        }
                        color={
                          f.isActive
                            ? "success"
                            : "default"
                        }
                        size="small"
                      />
                    </TableCell>

                    {/* ===== ACTIONS ===== */}

                    <TableCell>
                      <Stack
                        direction="row"
                        spacing={1}
                      >
                        <Link
                          href={`/saasfeatures/${f.saaSFeatureId}`}
                          passHref
                        >
                          <IconButton
                            size="small"
                            color="primary"
                          >
                            <Visibility />
                          </IconButton>
                        </Link>

                        <Link
                          href={`/saasfeatures/${f.saaSFeatureId}/edit`}
                          passHref
                        >
                          <IconButton
                            size="small"
                            color="secondary"
                          >
                            <Edit />
                          </IconButton>
                        </Link>

                        <IconButton
                          size="small"
                          color="error"
                          onClick={async () => {
                            const success =
                              await handleDelete(
                                f.saaSFeatureId,
                                f.featureName
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
