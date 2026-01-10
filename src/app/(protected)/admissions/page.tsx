"use client";
import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  useMediaQuery,
  Theme,
  CardContent,
  Collapse,
  Button,
  TextField,
  Avatar,
  Chip,
} from "@mui/material";

import {
  ArrowBack,
  Edit,
  Visibility,
  Delete,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Add,
  Search,
} from "@mui/icons-material";

import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import Link from "next/link";

import { useAdmissionsViewModel } from "@/lib/features/admission/useAdmissionsViewModel";
import { useDeleteAdmission } from "@/lib/features/admission/useDeleteAdmission";

import {
  Admission,
  AdmissionStatus,
  EnrollmentType,
  PaymentStatus,
} from "@/lib/features/admission/admissionTypes";

const AdmissionList: React.FC = () => {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  // ViewModel
  const {
    admissions,
    isLoading,
    error,
    page,
    totalPages,
    searchTerm,
    statusFilter,
    enrollmentTypeFilter,
    handleSearch,
    handleStatusFilter,
    handleEnrollmentTypeFilter,
    handleResetFilters,
    handlePageChange,
    refetch,
  } = useAdmissionsViewModel();

  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    { field: "studentEnrollmentId", sort: "asc" },
  ]);
  const [expandedRows, setExpandedRows] = React.useState<string[]>([]);
  const [localSearchTerm, setLocalSearchTerm] = React.useState(searchTerm);

  const { handleDelete } = useDeleteAdmission();

  const onDeleteAdmission = async (
    enrollmentId: number,
    studentName: string
  ) => {
    const success = await handleDelete(enrollmentId, studentName);
    if (success) refetch();
  };

  const handleChangeRowsPerPage = (e: any) => {
    setRowsPerPage(Number(e.target.value));
    handlePageChange(1);
  };

  const toggleRowExpand = (id: number) => {
    const idStr = id.toString();
    setExpandedRows((prev) =>
      prev.includes(idStr)
        ? prev.filter((rowId) => rowId !== idStr)
        : [...prev, idStr]
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(localSearchTerm);
  };

  // Sorting (client-side)
  const sortedAdmissions = [...admissions].sort((a, b) => {
    const sort = sortModel[0];
    if (!sort) return 0;

    const aVal = a[sort.field as keyof Admission];
    const bVal = b[sort.field as keyof Admission];

    return sort.sort === "asc"
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  const startIndex = (page - 1) * rowsPerPage;
  const currentAdmissions = sortedAdmissions.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  // FIXED COLUMNS
  const columns: GridColDef<Admission>[] = [
    {
      field: "studentEnrollmentId",
      headerName: "ID",
      width: 90,
    },
    { field: "studentName", headerName: "Student", flex: 1 },
    { field: "courseName", headerName: "Course", flex: 1 },

    {
      field: "enrollmentType",
      headerName: "Type",
      width: 130,
      renderCell: (params) => <Chip label={params.row.enrollmentType} size="small" />,
    },

    {
      field: "paymentStatus",
      headerName: "Payment",
      width: 130,
      renderCell: (params) => {
        const val = params.row.paymentStatus;
        const color =
          val === PaymentStatus.Paid
            ? "success"
            : val === PaymentStatus.Pending
            ? "warning"
            : "error";

        return <Chip label={val} size="small" color={color} />;
      },
    },

    { field: "finalAmount", headerName: "Final Amount", width: 120 },

    {
      field: "status",
      headerName: "Active",
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.row.status ? "Yes" : "No"}
          size="small"
          color={params.row.status ? "success" : "error"}
        />
      ),
    },

    // FIXED ACTION URLS
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          <IconButton
            size="small"
            color="info"
            component={Link}
            href={`/admissions/${params.row.studentEnrollmentId}`}
          >
            <Visibility fontSize="small" />
          </IconButton>

          <IconButton
            size="small"
            color="primary"
            component={Link}
            href={`/admissions/${params.row.studentEnrollmentId}/edit`}
          >
            <Edit fontSize="small" />
          </IconButton>

          <IconButton
            size="small"
            color="error"
            onClick={() =>
              onDeleteAdmission(
                params.row.studentEnrollmentId,
                params.row.studentName
              )
            }
          >
            <Delete fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  if (isLoading) return <Box sx={{ p: 3 }}>Loading admissions...</Box>;
  if (error) return <Box sx={{ p: 3, color: "error.main" }}>Error: {error}</Box>;

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      {/* HEADER */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton component={Link} href="/dashboard">
            <ArrowBack />
          </IconButton>
          <Typography variant="h4">Admissions</Typography>
        </Stack>

        <Button
          variant="contained"
          startIcon={<Add />}
          component={Link}
          href="/admissions/create"
        >
          Add Admission
        </Button>
      </Stack>

      {/* FILTERS */}
      <Paper sx={{ mb: 3, p: 2 }}>
        <Stack
          direction={isMobile ? "column" : "row"}
          spacing={2}
          alignItems="flex-end"
        >
          <TextField
            label="Search"
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearchSubmit(e)}
            InputProps={{
              endAdornment: (
                <IconButton onClick={handleSearchSubmit}>
                  <Search />
                </IconButton>
              ),
            }}
            size="small"
            fullWidth={isMobile}
          />

          <FormControl size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={(statusFilter ?? "") as string}
              onChange={(e) =>
                handleStatusFilter(
                  e.target.value === ""
                    ? null
                    : (e.target.value as AdmissionStatus)
                )
              }
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value={AdmissionStatus.Active}>Active</MenuItem>
              <MenuItem value={AdmissionStatus.Inactive}>Inactive</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small">
            <InputLabel>Enrollment Type</InputLabel>
            <Select
              value={enrollmentTypeFilter ?? ""}
              onChange={(e) => handleEnrollmentTypeFilter(e.target.value ?? "")}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Regular">Regular</MenuItem>
              <MenuItem value="Trial">Trial</MenuItem>
              <MenuItem value="Transfer">Transfer</MenuItem>
              <MenuItem value="Special">Special</MenuItem>
            </Select>
          </FormControl>

          <Button variant="outlined" size="small" onClick={handleResetFilters}>
            Reset
          </Button>
        </Stack>
      </Paper>

      {/* TOP PAGINATION */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          alignItems: "center",
        }}
      >
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Rows</InputLabel>
          <Select
            value={rowsPerPage.toString()}
            onChange={handleChangeRowsPerPage}
          >
            {[5, 10, 25, 50].map((n) => (
              <MenuItem key={n} value={n}>
                {n}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography>
          Page {page} of {totalPages} | Total: {admissions.length}
        </Typography>

        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, p) => handlePageChange(p)}
        />
      </Box>

      {/* DESKTOP GRID */}
      {!isMobile ? (
        <DataGrid
          autoHeight
          rows={currentAdmissions}
          columns={columns}
          sortingMode="client"
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          getRowId={(row) => row.studentEnrollmentId}
          disableColumnMenu
          loading={isLoading}
          paginationMode="client"
          pageSizeOptions={[5, 10, 25, 50]}
        />
      ) : (
        <>
          {/* MOBILE COLLAPSIBLE LIST */}
          <Paper>
            {currentAdmissions.map((adm) => (
              <Box key={adm.studentEnrollmentId}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    p: 2,
                    borderBottom: "1px solid #ddd",
                    cursor: "pointer",
                  }}
                  onClick={() => toggleRowExpand(adm.studentEnrollmentId)}
                >
                  <Stack direction="row" spacing={2}>
                    <Avatar>{adm.studentName?.charAt(0)}</Avatar>
                    <Box>
                      <Typography fontWeight="bold">{adm.studentName}</Typography>
                      <Typography variant="body2">{adm.courseName}</Typography>
                    </Box>
                  </Stack>

                  {expandedRows.includes(
                    adm.studentEnrollmentId.toString()
                  ) ? (
                    <KeyboardArrowUp />
                  ) : (
                    <KeyboardArrowDown />
                  )}
                </Box>

                <Collapse
                  in={expandedRows.includes(
                    adm.studentEnrollmentId.toString()
                  )}
                >
                  <CardContent>
                    <Stack spacing={1}>
                      <Chip label={`Type: ${adm.enrollmentType}`} size="small" />
                      <Chip
                        label={`Payment: ${adm.paymentStatus}`}
                        size="small"
                      />
                      <Chip
                        label={`Final Amount: ${adm.finalAmount}`}
                        size="small"
                      />
                      <Chip
                        label={`Active: ${adm.status ? "Yes" : "No"}`}
                        size="small"
                      />

                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          component={Link}
                          href={`/admissions/${adm.studentEnrollmentId}`}
                        >
                          View
                        </Button>

                        <Button
                          size="small"
                          component={Link}
                          href={`/admissions/${adm.studentEnrollmentId}/edit`}
                        >
                          Edit
                        </Button>

                        <Button
                          size="small"
                          color="error"
                          onClick={() =>
                            onDeleteAdmission(
                              adm.studentEnrollmentId,
                              adm.studentName
                            )
                          }
                        >
                          Delete
                        </Button>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Collapse>
              </Box>
            ))}
          </Paper>
        </>
      )}

      <Pagination
        count={totalPages}
        page={page}
        onChange={(_, p) => handlePageChange(p)}
        sx={{ mt: 3 }}
      />
    </Box>
  );
};

export default AdmissionList;
