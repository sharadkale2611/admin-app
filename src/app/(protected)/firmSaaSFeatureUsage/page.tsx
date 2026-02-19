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
  TextField,
} from "@mui/material";

import { Add, Refresh, Edit, Delete } from "@mui/icons-material";
import Link from "next/link";

import { useFirmSaaSFeatureUsageViewModel } from "@/lib/features/firmSaaSFeatureUsage/useFirmSaaSFeatureUsageViewModel";
import { useDeleteFirmSaaSFeatureUsage } from "@/lib/features/firmSaaSFeatureUsage/useDeleteFirmSaaSFeatureUsageViewModel";
import type { ApiError } from "@/lib/features/firmSaaSFeatureUsage/firmSaaSFeatureUsageTypes";

import { useSaaSFeatureViewModel } from "@/lib/features/saasfeature/useSaaSFeatureViewModel";

function renderErrorContent(error: ApiError | null) {
  if (!error) return null;

  if (error.error) return <div>{error.error}</div>;

  if (error.errors && typeof error.errors === "object") {
    return Object.entries(error.errors).map(([k, v], i) => (
      <div key={i}>
        <strong>{k}:</strong> {Array.isArray(v) ? v.join(", ") : String(v)}
      </div>
    ));
  }

  return null;
}

export default function FirmSaaSFeatureUsagePage() {
  const { items, isLoading, error, refetch } = useFirmSaaSFeatureUsageViewModel();
  const { handleDelete } = useDeleteFirmSaaSFeatureUsage();
  const { saasFeatures } = useSaaSFeatureViewModel();

  const saasFeatureNameById = React.useMemo(() => {
    const map = new Map<number, string>();
    (saasFeatures ?? []).forEach((f) => map.set(f.saaSFeatureId, f.featureName));
    return map;
  }, [saasFeatures]);

  const [firmIdSearch, setFirmIdSearch] = React.useState("");
  const [saasFeatureIdSearch, setSaasFeatureIdSearch] = React.useState("");

  const filtered = React.useMemo(() => {
    const firmTerm = firmIdSearch.trim();
    const featureTerm = saasFeatureIdSearch.trim();

    return (items ?? []).filter((x) => {
      if (firmTerm && !String(x.firmId).includes(firmTerm)) return false;
      if (featureTerm && !String(x.saaSFeatureId).includes(featureTerm)) return false;
      return true;
    });
  }, [items, firmIdSearch, saasFeatureIdSearch]);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4">Firm SaaS Feature Usage</Typography>

        <Stack direction="row" spacing={1}>
          <IconButton onClick={refetch} color="primary">
            <Refresh />
          </IconButton>

          <Link href="/firmSaaSFeatureUsage/create" passHref>
            <Button variant="contained" startIcon={<Add />}>
              Add Usage
            </Button>
          </Link>
        </Stack>
      </Box>

      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <TextField
            size="small"
            label="Search FirmId"
            value={firmIdSearch}
            onChange={(e) => setFirmIdSearch(e.target.value)}
          />
          <TextField
            size="small"
            label="Search SaaSFeatureId"
            value={saasFeatureIdSearch}
            onChange={(e) => setSaasFeatureIdSearch(e.target.value)}
          />
        </Stack>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {renderErrorContent(error)}
        </Alert>
      )}

      <Paper elevation={2}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Firm</TableCell>
                <TableCell>SaaS Feature</TableCell>
                <TableCell>Used Count</TableCell>
                <TableCell>Last Updated</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading ? (
                Array.from(new Array(5)).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from(new Array(5)).map((__, j) => (
                      <TableCell key={j}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No usage records found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((x) => {
                  const featureName =
                    saasFeatureNameById.get(x.saaSFeatureId) ?? `#${x.saaSFeatureId}`;

                  return (
                    <TableRow key={`${x.firmId}-${x.saaSFeatureId}`} hover>
                      <TableCell>{x.firmId}</TableCell>
                      <TableCell>{featureName}</TableCell>

                      <TableCell>
                        <Chip label={String(x.usedCount)} color="primary" size="small" />
                      </TableCell>

                      <TableCell>{x.lastUpdated ? new Date(x.lastUpdated).toLocaleString() : "—"}</TableCell>

                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Link
                            href={`/firmSaaSFeatureUsage/${x.firmId}/${x.saaSFeatureId}/edit`}
                            passHref
                          >
                            <IconButton size="small" color="secondary">
                              <Edit />
                            </IconButton>
                          </Link>

                          <IconButton
                            size="small"
                            color="error"
                            onClick={async () => {
                              const success = await handleDelete(
                                x.firmId,
                                x.saaSFeatureId,
                                `Firm ${x.firmId} - ${featureName}`
                              );
                              if (success) refetch();
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}