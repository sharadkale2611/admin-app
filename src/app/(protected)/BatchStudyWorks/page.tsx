"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Pagination,
  TextField,
  Stack,
  useMediaQuery,
  Theme,
  CardContent,
  Collapse,
  Button,
  Chip,
  Skeleton,
} from "@mui/material";

import {
  Edit,
  Visibility,
  Delete,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Add,
  Search,
  FilterList,
  UploadFile

} from "@mui/icons-material";

import Link from "next/link";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import { useBatchStudyWorkViewModel } from "@/lib/features/BatchStudyWorks/useBatchStudyWorkViewModel";
import { useDeleteBatchStudyWork } from "@/lib/features/BatchStudyWorks/useDeleteBatchStudyWork";

const BatchStudyWorkList: React.FC = () => {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  const {
    items,
    loading,
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
  } = useBatchStudyWorkViewModel();

  const { handleDelete } = useDeleteBatchStudyWork();

  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const toggleExpand = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const deleteHandler = async (id: number, title: string) => {
    setIsDeleting(id);
    const success = await handleDelete(id, title);
    if (success) refetch();
    setIsDeleting(null);
  };

  // -------------------------------------------------
  // TABLE COLUMNS
  // -------------------------------------------------
  const columns: GridColDef[] = [
    { field: "batchStudyWorkId", headerName: "ID", width: 80 },
    { field: "workTitle", headerName: "Title", flex: 1 },

    {
      field: "workType",
      headerName: "Type",
      width: 120,
      renderCell: (p) => (
        <Chip
          label={p.value}
          size="small"
          color={p.value === "homework" ? "warning" : "primary"}
        />
      ),
    },

    {
      field: "batchCode",
      headerName: "Batch",
      width: 140,
      renderCell: (p) => p.value || "-",
    },

    {
      field: "isActive",
      headerName: "Status",
      width: 110,
      renderCell: (p) => (
        <Chip
          label={p.value ? "Active" : "Inactive"}
          color={p.value ? "success" : "error"}
          size="small"
        />
      ),
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          {/* Upload Docx / other docs */}
          <Link
            href={`/BatchStudyWorkAttachments?id=${params.row.batchStudyWorkId}`}
          >
            <IconButton size="small" color="secondary">
              <UploadFile fontSize="small" />
            </IconButton>
          </Link>

          {/* View */}
          <Link
            href={`/BatchStudyWorks/details?id=${params.row.batchStudyWorkId}`}
          >
            <IconButton size="small">
              <Visibility fontSize="small" />
            </IconButton>
          </Link>

          {/* Edit */}
          <Link href={`/BatchStudyWorks/${params.row.batchStudyWorkId}/edit`}>
            <IconButton size="small" color="primary">
              <Edit fontSize="small" />
            </IconButton>
          </Link>

          {/* Delete */}
          <IconButton
            size="small"
            color="error"
            disabled={isDeleting === params.row.batchStudyWorkId}
            onClick={() =>
              deleteHandler(params.row.batchStudyWorkId, params.row.workTitle)
            }
          >
            {isDeleting === params.row.batchStudyWorkId ? (
              <Skeleton variant="circular" width={24} height={24} />
            ) : (
              <Delete fontSize="small" />
            )}
          </IconButton>
        </Stack>
      ),
    },
  ];

  if (loading) return <Box sx={{ p: 3 }}>Loading...</Box>;
  if (error)
    return <Box sx={{ p: 3, color: "error.main" }}>Error: {error}</Box>;

  // -------------------------------------------------
  // UI
  // -------------------------------------------------
  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      {/* HEADER */}
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h4">Batch Study Works</Typography>

        <Button
          variant="contained"
          startIcon={<Add />}
          component={Link}
          href="/BatchStudyWorks/create"
        >
          Add Work
        </Button>
      </Stack>

      {/* FILTERS */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <TextField
            size="small"
            placeholder="Search..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(localSearch)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1 }} />,
            }}
          />

          <Button
            variant="outlined"
            startIcon={<Search />}
            onClick={() => handleSearch(localSearch)}
          >
            Search
          </Button>

          <Button
            variant={activeOnly ? "contained" : "outlined"}
            onClick={handleToggleActive}
          >
            {activeOnly ? "Active Only" : "Show All"}
          </Button>

          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={handleResetFilters}
          >
            Reset
          </Button>
        </Stack>
      </Paper>

      {/* DESKTOP TABLE */}
      {!isMobile ? (
        <Box sx={{ height: 520 }}>
          <DataGrid
            rows={items}
            columns={columns}
            getRowId={(row) => row.batchStudyWorkId}
            hideFooter
          />
        </Box>
      ) : (
        /* MOBILE LIST */
        <Box component={Paper}>
          {items.map((item) => (
            <Box key={item.batchStudyWorkId}>
              <Box
                sx={{
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                }}
                onClick={() => toggleExpand(item.batchStudyWorkId)}
              >
                <Typography>{item.workTitle}</Typography>
                <IconButton>
                  {expandedRows.includes(item.batchStudyWorkId) ? (
                    <KeyboardArrowUp />
                  ) : (
                    <KeyboardArrowDown />
                  )}
                </IconButton>
              </Box>

              <Collapse in={expandedRows.includes(item.batchStudyWorkId)}>
                <CardContent>
                  <Typography>Type: {item.workType}</Typography>
                  <Typography>Batch: {item.batchCode || "-"}</Typography>
                  <Typography>
                    Status: {item.isActive ? "Active" : "Inactive"}
                  </Typography>

                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    disabled={isDeleting === item.batchStudyWorkId}
                    onClick={() =>
                      deleteHandler(item.batchStudyWorkId, item.workTitle)
                    }
                  >
                    {isDeleting === item.batchStudyWorkId
                      ? "Deleting..."
                      : "Delete"}
                  </Button>
                </CardContent>
              </Collapse>
            </Box>
          ))}
        </Box>
      )}

      {/* PAGINATION */}
      <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
        <Pagination
          page={page}
          count={totalPages}
          onChange={(_, p) => handlePageChange(p)}
        />
      </Stack>
    </Box>
  );
};

export default BatchStudyWorkList;
