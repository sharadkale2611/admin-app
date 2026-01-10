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
} from "@mui/icons-material";

import Link from "next/link";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import { useFirmsViewModel } from "@/lib/features/firm/useFirmsViewModel";
import { useDeleteFirm } from "@/lib/features/firm/useDeleteFirm";

const FirmList: React.FC = () => {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  const {
    firms,
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
  } = useFirmsViewModel();

  const { handleDelete } = useDeleteFirm(); // ⭐ SweetAlert Delete Hook

  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const toggleExpand = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // -------------------------------------------------
  // 🔥 DELETE HANDLER USING SweetAlert HOOK
  // -------------------------------------------------
  const deleteFirmHandler = async (id: number, name: string) => {
    setIsDeleting(id);
    const success = await handleDelete(id, name);
    if (success) refetch();
    setIsDeleting(null);
  };

  // -------------------------------------------------
  // TABLE COLUMNS
  // -------------------------------------------------
  const columns: GridColDef[] = [
    { field: "firmId", headerName: "ID", width: 80 },
    { field: "firmName", headerName: "Firm Name", flex: 1 },
    { field: "firmCode", headerName: "Firm Code", width: 120 },
    {
      field: "isActive",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value ? "Active" : "Inactive"}
          color={params.value ? "success" : "error"}
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
          {/* View */}
          <Link href={`/firms/${params.row.firmId}`} passHref>
            <IconButton size="small" color="info">
              <Visibility fontSize="small" />
            </IconButton>
          </Link>

          {/* Edit */}
          <Link href={`/firms/${params.row.firmId}/edit`} passHref>
            <IconButton size="small" color="primary">
              <Edit fontSize="small" />
            </IconButton>
          </Link>

          {/* Delete */}
          <IconButton
            size="small"
            color="error"
            disabled={isDeleting === params.row.firmId}
            onClick={() =>
              deleteFirmHandler(params.row.firmId, params.row.firmName)
            }
          >
            {isDeleting === params.row.firmId ? (
              <Skeleton variant="circular" width={24} height={24} />
            ) : (
              <Delete fontSize="small" />
            )}
          </IconButton>
        </Stack>
      ),
    },
  ];

  if (isLoading) return <Box sx={{ p: 3 }}>Loading firms...</Box>;
  if (error)
    return <Box sx={{ p: 3, color: "error.main" }}>Error: {error}</Box>;

  // -------------------------------------------------
  // UI
  // -------------------------------------------------
  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      {/* HEADER */}
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h4">Firm Management</Typography>

        <Button
          variant="contained"
          startIcon={<Add />}
          component={Link}
          href="/firms/create"
        >
          Add Firm
        </Button>
      </Stack>

      {/* FILTERS */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <TextField
            size="small"
            placeholder="Search firms..."
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
        <Box sx={{ height: 500 }}>
          <DataGrid
            rows={firms}
            columns={columns}
            getRowId={(row) => row.firmId}
            hideFooter
          />
        </Box>
      ) : (
        /* MOBILE LIST */
        <Box component={Paper}>
          {firms.map((firm) => (
            <Box key={firm.firmId}>
              <Box
                sx={{
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                }}
                onClick={() => toggleExpand(firm.firmId)}
              >
                <Typography>{firm.firmName}</Typography>
                <IconButton>
                  {expandedRows.includes(firm.firmId) ? (
                    <KeyboardArrowUp />
                  ) : (
                    <KeyboardArrowDown />
                  )}
                </IconButton>
              </Box>

              <Collapse in={expandedRows.includes(firm.firmId)}>
                <CardContent>
                  <Typography>Code: {firm.firmCode}</Typography>
                  <Typography>
                    Status: {firm.isActive ? "Active" : "Inactive"}
                  </Typography>

                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    disabled={isDeleting === firm.firmId}
                    onClick={() =>
                      deleteFirmHandler(firm.firmId, firm.firmName)
                    }
                  >
                    {isDeleting === firm.firmId ? "Deleting..." : "Delete"}
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

export default FirmList;
