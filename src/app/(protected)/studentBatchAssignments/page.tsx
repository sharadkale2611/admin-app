"use client";

import React, { useState } from "react";
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
  Add,
  Refresh,
  Visibility,
  Edit,
  Delete,
  FilterList,
} from "@mui/icons-material";

import Link from "next/link";

import { useStudentBatchAssignmentViewModel } from "@/lib/features/studentBatchAssignment/useStudentBatchAssignmentViewModel";
import { StudentBatchAssignment,ApiError,} from "@/lib/features/studentBatchAssignment/studentBatchAssignmentTypes";
import { useDeleteStudentBatchAssignment } from "@/lib/features/studentBatchAssignment/useDeleteStudentBatchAssignment";


// -------------------------------------------------------
// ERROR RENDERER
// -------------------------------------------------------
function renderErrorContent(error: ApiError | null) {
  if (!error) return null;

  if (error.error) return <div>{error.error}</div>;

  if (Array.isArray(error.errors)) {
    return error.errors.map((e, i) => (
      <div key={i}>{typeof e === "string" ? e : JSON.stringify(e)}</div>
    ));
  }

  return null;
}


// -------------------------------------------------------
// MAIN COMPONENT
// -------------------------------------------------------
export default function StudentBatchAssignmentsPage() {
  const {
    assignments,
    isLoading,
    error,
    page,
    totalPages,
    searchTerm,
    activeOnly,
    handleSearch,
    handleToggleActive,
    handleResetFilters,
    handlePageChange,
    refetch,
  } = useStudentBatchAssignmentViewModel();

  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const { handleDelete } = useDeleteStudentBatchAssignment();
  const [isDeleting, setIsDeleting] = useState<number | null>(null);


  // -------------------------------------------------------
  // Search input handlers
  // -------------------------------------------------------
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(e.target.value);
  };

  const handleSearchSubmit = () => {
    handleSearch(localSearchTerm);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSearchSubmit();
    }
  };


  // -------------------------------------------------------
  // Delete
  // -------------------------------------------------------
  const handleDeleteClick = async (item: StudentBatchAssignment) => {
    setIsDeleting(item.studentBatchAssignmentId);

    try {
      const success = await handleDelete(
        item.studentBatchAssignmentId,
        item.studentName ?? "Student"
      );

      if (success) refetch();
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setIsDeleting(null);
    }
  };


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };


  // =======================================================
  // UI
  // =======================================================
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* ----------------------------------- */}
      {/* Header */}
      {/* ----------------------------------- */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Student Batch Assignments
        </Typography>

        <Link href="/studentBatchAssignments/create" passHref>
          <Button variant="contained" startIcon={<Add />}>
            Add Assignment
          </Button>
        </Link>
      </Box>

      {/* ----------------------------------- */}
      {/* Filters */}
      {/* ----------------------------------- */}
      <Paper sx={{ p: 3, mb: 3 }} elevation={1}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <TextField
            placeholder="Search assignments..."
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

      {/* ----------------------------------- */}
      {/* Error Display */}
      {/* ----------------------------------- */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {renderErrorContent(error)}
        </Alert>
      )}

      {/* ----------------------------------- */}
      {/* Table */}
      {/* ----------------------------------- */}
      <Paper elevation={2}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student Name</TableCell>
                <TableCell>Batch</TableCell>
                <TableCell>Assignment Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Remark</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading ? (
                // Loading skeleton
                Array.from(new Array(5)).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from(new Array(8)).map((__, i) => (
                      <TableCell key={i}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : assignments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      {searchTerm
                        ? "No assignments match your search"
                        : "No student batch assignments found"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                assignments.map((item: StudentBatchAssignment) => (
                  <TableRow key={item.studentBatchAssignmentId} hover>
                    <TableCell>{item.studentName ?? "-"}</TableCell>
                    <TableCell>{item.batchCode ?? "-"}</TableCell>
                    <TableCell>{formatDate(item.assignmentDate)}</TableCell>
                    <TableCell>{item.assignmentType}</TableCell>
                    <TableCell>{item.remark || "-"}</TableCell>

                    <TableCell>
                      <Chip
                        label={item.isActive ? "Active" : "Inactive"}
                        color={item.isActive ? "success" : "error"}
                        size="small"
                      />
                    </TableCell>

                    <TableCell>{formatDate(item.createdAt)}</TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Link
                          href={`/studentBatchAssignments/${item.studentBatchAssignmentId}`}
                          passHref
                        >
                          <IconButton size="small" color="primary">
                            <Visibility />
                          </IconButton>
                        </Link>

                        <Link
                          href={`/studentBatchAssignments/${item.studentBatchAssignmentId}/edit`}
                        >
                          <IconButton size="small" color="secondary">
                            <Edit />
                          </IconButton>
                        </Link>

                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(item)}
                          disabled={
                            isDeleting === item.studentBatchAssignmentId
                          }
                        >
                          {isDeleting === item.studentBatchAssignmentId ? (
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

        {/* ----------------------------------- */}
        {/* Pagination */}
        {/* ----------------------------------- */}
        <TablePagination
          component="div"
          count={assignments.length * totalPages}
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
