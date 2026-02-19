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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import { Add, Refresh, Visibility, Edit, Delete } from "@mui/icons-material";
import Link from "next/link";

import { useFirmSaaSFeatureViewModel } from "@/lib/features/firmSaaSFeature/useFirmSaaSFeatureViewModel";
import { useDeleteFirmSaaSFeature } from "@/lib/features/firmSaaSFeature/useDeleteFirmSaaSFeatureViewModel";

import { useSaaSFeatureViewModel } from "@/lib/features/saasfeature/useSaaSFeatureViewModel";
import { ApiError } from "@/lib/features/firmSaaSFeature/firmSaaSFeatureTypes";

export default function FirmSaaSFeaturesPage() {
  const { firmSaaSFeatures, isLoading, error, refetch } = useFirmSaaSFeatureViewModel();
  const { handleDelete } = useDeleteFirmSaaSFeature();

  // For displaying SaaS Feature names in the table (optional)
  const { saasFeatures } = useSaaSFeatureViewModel();

  const saasFeatureNameById = React.useMemo(() => {
    const map = new Map<number, string>();
    (saasFeatures ?? []).forEach((f) => map.set(f.saaSFeatureId, f.featureName));
    return map;
  }, [saasFeatures]);

  /* ===============================
     Filters (client-side)
  ================================ */
  const [firmIdSearch, setFirmIdSearch] = React.useState("");
  const [saasFeatureIdSearch, setSaasFeatureIdSearch] = React.useState("");
  const [isEnabledFilter, setIsEnabledFilter] = React.useState<string>("");

  const filtered = React.useMemo(() => {
    const firmTerm = firmIdSearch.trim();
    const featureTerm = saasFeatureIdSearch.trim();

    return (firmSaaSFeatures ?? []).filter((x) => {
      if (firmTerm && !String(x.firmId).includes(firmTerm)) return false;
      if (featureTerm && !String(x.saaSFeatureId).includes(featureTerm)) return false;

      if (isEnabledFilter) {
        const flag = isEnabledFilter === "true";
        if (Boolean(x.isEnabled) !== flag) return false;
      }

      return true;
    });
  }, [firmSaaSFeatures, firmIdSearch, saasFeatureIdSearch, isEnabledFilter]);

  /* ===============================
     Error Renderer (Same Pattern)
  ================================ */
  function renderErrorContent(err: ApiError | null) {
    if (!err) return null;

    if (err.error) return <div>{err.error}</div>;

    if (err.errors && typeof err.errors === "object") {
      return Object.entries(err.errors).map(([k, v], i) => (
        <div key={i}>
          <strong>{k}:</strong> {Array.isArray(v) ? v.join(", ") : String(v)}
        </div>
      ));
    }

    return null;
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* ===== Header ===== */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4">Firm SaaS Features</Typography>

        <Stack direction="row" spacing={1}>
          <IconButton onClick={refetch} color="primary">
            <Refresh />
          </IconButton>

          <Link href="/firmSaaSFeatures/create" passHref>
            <Button variant="contained" startIcon={<Add />}>
              Add Mapping
            </Button>
          </Link>
        </Stack>
      </Box>

      {/* ===== Filters ===== */}
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

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Enabled</InputLabel>
            <Select
              value={isEnabledFilter}
              label="Enabled"
              onChange={(e) => setIsEnabledFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="true">Enabled</MenuItem>
              <MenuItem value="false">Disabled</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

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
                <TableCell>Firm</TableCell>
                <TableCell>SaaS Feature</TableCell>
                <TableCell>Enabled</TableCell>
                <TableCell>Limit Type</TableCell>
                <TableCell>Limit Value</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
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
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No Firm SaaS Features found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((x) => {
                  const featureName =
                    saasFeatureNameById.get(x.saaSFeatureId) ?? `#${x.saaSFeatureId}`;

                  return (
                    <TableRow key={x.firmSaaSFeatureId} hover>
                      <TableCell>
                        <Typography fontWeight="medium">#{x.firmSaaSFeatureId}</Typography>
                      </TableCell>

                      <TableCell>{x.firmId}</TableCell>

                      <TableCell>{featureName}</TableCell>

                      <TableCell>
                        <Chip
                          label={x.isEnabled ? "Enabled" : "Disabled"}
                          color={x.isEnabled ? "success" : "default"}
                          size="small"
                        />
                      </TableCell>

                      <TableCell>{x.limitType ?? "—"}</TableCell>
                      <TableCell>{x.limitValue ?? "—"}</TableCell>

                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Link href={`/firmSaaSFeatures/${x.firmSaaSFeatureId}`} passHref>
                            <IconButton size="small" color="primary">
                              <Visibility />
                            </IconButton>
                          </Link>

                          <Link href={`/firmSaaSFeatures/${x.firmSaaSFeatureId}/edit`} passHref>
                            <IconButton size="small" color="secondary">
                              <Edit />
                            </IconButton>
                          </Link>

                          <IconButton
                            size="small"
                            color="error"
                            onClick={async () => {
                              const success = await handleDelete(
                                x.firmSaaSFeatureId,
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