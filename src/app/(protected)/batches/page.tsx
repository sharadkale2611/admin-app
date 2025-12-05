// app/(protected)/batches/page.tsx

"use client";

import React, { useState, useEffect } from "react";
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
  TablePagination,
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
} from "@mui/material";
import {
  Search,
  Refresh,
  Visibility,
  Delete,
  FilterList,
  Edit,
} from "@mui/icons-material";
import Link from "next/link";
import { useBatchViewModel } from "@/lib/features/batch/useBatchViewModel";
import { ApiError, Batch } from "@/lib/features/batch/batchTypes";
import { useDeleteBatch } from "@/lib/features/batch/useDeleteBatch";

function renderErrorContent(error: ApiError | null) {
  if (!error) return null;

  if (error.error) return <div>{error.error}</div>;

  if (error.errors && Array.isArray(error.errors)) {
    return error.errors.map((e, i) => (
      <div key={i}>{typeof e === "string" ? e : JSON.stringify(e)}</div>
    ));
  }

  return null;
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return "-";

  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (timeString: string | null) => {
  if (!timeString) return "-";
  return timeString.slice(0, 5);
};

export default function BatchesPage() {
  const {
    batches,
    isLoading,
    error,
    page,
    totalPages,
    totalCount,   // ⬅ NEW
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

  // Sync local search UI state when store updates
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(event.target.value);
  };

  const handleSearchSubmit = () => {
    handleSearch(localSearchTerm);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const handleDeleteClick = async (batch: Batch) => {
    setIsDeleting(batch.batchId);
    try {
      const success = await handleDelete(batch.batchId, batch.batchCode);
      if (success) {
        refetch(); // ALWAYS refetch after delete
      }
    } catch (error) {
      console.error("Delete error:", error);
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
        <Typography variant="h4" component="h1">
          Batches
        </Typography>
        <Link href="/batches/create" passHref>
          <Button variant="contained">Add Batch</Button>
        </Link>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }} elevation={1}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <TextField
            placeholder="Search by Batch Code..."
            value={localSearchTerm}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            size="small"
            sx={{ minWidth: 250 }}
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
            onClick={handleSearchSubmit}
            startIcon={<Search />}
          >
            Search
          </Button>

          <FormControlLabel
            control={
              <Checkbox
                checked={activeOnly}
                onChange={handleToggleActive}
                color="primary"
              />
            }
            label="Active Only"
          />

          <Button
            variant="outlined"
            onClick={handleResetFilters}
            startIcon={<FilterList />}
          >
            Reset Filters
          </Button>

          <IconButton onClick={refetch} color="primary">
            <Refresh />
          </IconButton>
        </Stack>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {renderErrorContent(error)}
        </Alert>
      )}

      {/* Table */}
      <Paper elevation={2}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Batch Code</TableCell>
                <TableCell>Branch</TableCell>
                <TableCell>Course / Category</TableCell>
                <TableCell>Module</TableCell>
                <TableCell>Classroom</TableCell>
                <TableCell>Trainer ID</TableCell>
                <TableCell>Start</TableCell>
                <TableCell>End</TableCell>
                <TableCell>Duration (Hr)</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading ? (
                Array.from(new Array(5)).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from(new Array(11)).map((__, idx) => (
                      <TableCell key={idx}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                    <TableCell>
                      <Skeleton variant="text" width={100} />
                    </TableCell>
                  </TableRow>
                ))
              ) : batches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      {searchTerm
                        ? "No batches found matching your search"
                        : "No batches found"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                batches.map((batch: Batch) => (
                  <TableRow key={batch.batchId} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {batch.batchCode}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">
                        {batch.branchName || "-"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {batch.branchCode || ""}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">
                        {batch.courseName || "-"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {batch.courseCategoryName || ""}
                      </Typography>
                    </TableCell>

                    <TableCell>{batch.moduleName || "-"}</TableCell>
                    <TableCell>{batch.classRoomName || "-"}</TableCell>
                    <TableCell>{batch.trainerId ?? "-"}</TableCell>

                    <TableCell>
                      {formatDate(batch.startDate)}{" "}
                      {batch.startTime
                        ? `(${formatTime(batch.startTime)})`
                        : ""}
                    </TableCell>

                    <TableCell>{formatDate(batch.endDate)}</TableCell>

                    <TableCell>{batch.batchDurationInHr ?? "-"}</TableCell>

                    <TableCell>
                      <Chip
                        label={batch.isActive ? "Active" : "Inactive"}
                        color={batch.isActive ? "success" : "error"}
                        size="small"
                      />
                    </TableCell>

                    <TableCell>{formatDate(batch.createdAt)}</TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Link href={`/batches/${batch.batchId}`} passHref>
                          <IconButton size="small" color="primary">
                            <Visibility />
                          </IconButton>
                        </Link>
                        <Link href={`/batches/${batch.batchId}/edit`} passHref>
                          <IconButton size="small" color="primary">
                            <Edit />
                          </IconButton>
                        </Link>

                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(batch)}
                          disabled={isDeleting === batch.batchId}
                        >
                          {isDeleting === batch.batchId ? (
                            <Skeleton
                              variant="circular"
                              width={24}
                              height={24}
                            />
                          ) : (
                            <Delete />
                          )}
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination using REAL backend count */}
        <TablePagination
          component="div"
          count={totalCount}       // ⬅ FIXED
          page={page - 1}
          onPageChange={(_, newPage) => handlePageChange(newPage + 1)}
          rowsPerPage={10}
          onRowsPerPageChange={() => {}}
          rowsPerPageOptions={[10]}
        />
      </Paper>
    </Container>
  );
}
