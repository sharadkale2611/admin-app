"use client";

// src/app/(protected)/batches/page.tsx

import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Alert,
  Skeleton,
  Stack,
  Grid,
  TablePagination,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import {
  Search,
  Refresh,
  Delete,
  FilterList,
  Edit,
} from "@mui/icons-material";
import Link from "next/link";
import { useBatchViewModel } from "@/lib/features/batch/useBatchViewModel";
import { ApiError, Batch } from "@/lib/features/batch/batchTypes";
import { useDeleteBatch } from "@/lib/features/batch/useDeleteBatch";
import BatchCard from "./BatchCard";

/* ---------------------------------------------
   Helpers
--------------------------------------------- */
const formatDate = (dateString: string | null) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};



/* ---------------------------------------------
   Page
--------------------------------------------- */
export default function BatchesPage() {
  const {
    batches,
    isLoading,
    error,
    page,
    totalPages,
    totalCount,
    searchTerm,
    activeOnly,
    handleSearch,
    handleToggleActive,
    handleResetFilters,
    handlePageChange,
    refetch,
  } = useBatchViewModel();

  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const { handleDelete } = useDeleteBatch();
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  const handleDeleteClick = async (batch: Batch) => {
    setIsDeleting(batch.batchId);
    try {
      const success = await handleDelete(batch.batchId, batch.batchCode);
      if (success) refetch();
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Batches</Typography>
        <Link href="/batches/create">
          <Button variant="contained">Add Batch</Button>
        </Link>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <TextField
            size="small"
            placeholder="Search by Batch Code"
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              handleSearch(localSearchTerm)
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="outlined"
            startIcon={<Search />}
            onClick={() => handleSearch(localSearchTerm)}
          >
            Search
          </Button>

          <FormControlLabel
            control={
              <Checkbox
                checked={activeOnly}
                onChange={handleToggleActive}
              />
            }
            label="Active Only"
          />

          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={handleResetFilters}
          >
            Reset
          </Button>

          <IconButton onClick={refetch} color="primary">
            <Refresh />
          </IconButton>
        </Stack>
      </Paper>

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {(error as ApiError)?.error || "Something went wrong"}
        </Alert>
      )}

      {/* Cards */}
      {isLoading ? (
        <Grid container spacing={2}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Skeleton variant="rectangular" height={260} />
            </Grid>
          ))}
        </Grid>
      ) : batches.length === 0 ? (
        <Alert severity="info">
          {searchTerm
            ? "No batches found matching your search"
            : "No batches found"}
        </Alert>
      ) : (
        <Grid container spacing={2}>
          {batches.map((batch) => (
            <Grid
              key={batch.batchId}
              size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
            >
              <BatchCard
                batch={batch}
                onDelete={handleDeleteClick}
                isDeleting={isDeleting === batch.batchId}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <TablePagination
          component="div"
          count={totalCount}
          page={page - 1}
          onPageChange={(_, newPage) =>
            handlePageChange(newPage + 1)
          }
          rowsPerPage={10}
          rowsPerPageOptions={[10]}
        />
      )}
    </Container>
  );
}
