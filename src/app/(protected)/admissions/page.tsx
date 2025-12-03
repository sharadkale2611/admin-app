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
  TableSortLabel,
  Button,
  TextField,
  Avatar,
  Chip,
  SelectChangeEvent,
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

  // ViewModel hook
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
    { field: "admissionId", sort: "asc" },
  ]);
  const [expandedRows, setExpandedRows] = React.useState<string[]>([]);
  const [localSearchTerm, setLocalSearchTerm] = React.useState(searchTerm);

  const { handleDelete } = useDeleteAdmission();

  const onDeleteAdmission = async (
    admissionId: number,
    studentName: string
  ) => {
    const success = await handleDelete(admissionId, studentName);
    if (success) refetch();
  };

  const handleChangeRowsPerPage = (event: SelectChangeEvent<string>) => {
    setRowsPerPage(Number(event.target.value));
    handlePageChange(1);
  };

  const toggleRowExpand = (id: number) => {
    const idString = id.toString();
    setExpandedRows((prev) =>
      prev.includes(idString)
        ? prev.filter((rowId) => rowId !== idString)
        : [...prev, idString]
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(localSearchTerm);
  };

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const sortedAdmissions =
    admissions.length > 0
      ? [...admissions].sort((a, b) => {
          const sortItem = sortModel[0];
          if (!sortItem) return 0;

          const aValue = a?.[sortItem.field as keyof typeof a];
          const bValue = b?.[sortItem.field as keyof typeof b];

          if (aValue === undefined && bValue === undefined) return 0;
          if (aValue === undefined) return sortItem.sort === "asc" ? 1 : -1;
          if (bValue === undefined) return sortItem.sort === "asc" ? -1 : 1;

          if (typeof aValue === "boolean" && typeof bValue === "boolean") {
            return sortItem.sort === "asc"
              ? aValue === bValue
                ? 0
                : aValue
                ? -1
                : 1
              : aValue === bValue
              ? 0
              : aValue
              ? 1
              : -1;
          }

          const aString = String(aValue || "");
          const bString = String(bValue || "");

          return sortItem.sort === "asc"
            ? aString.localeCompare(bString)
            : bString.localeCompare(aString);
        })
      : [];

  const currentAdmissions = sortedAdmissions.slice(startIndex, endIndex);

  const columns: GridColDef<Admission>[] = [
    { field: "admissionId", headerName: "ID", width: 80 },
    { field: "studentName", headerName: "Student", flex: 1 },
    { field: "courseName", headerName: "Course", flex: 1 },
    {
      field: "enrollmentType",
      headerName: "Type",
      width: 130,
      renderCell: (params) => (
        <Chip label={params.row.enrollmentType} size="small" />
      ),
    },
    {
      field: "paymentStatus",
      headerName: "Payment",
      width: 130,
      renderCell: (params) => {
        let color: "success" | "warning" | "error" = "warning";
        if (params.row.paymentStatus === PaymentStatus.Paid) color = "success";
        else if (params.row.paymentStatus === PaymentStatus.Pending)
          color = "warning";
        else if (params.row.paymentStatus === PaymentStatus.PartiallyPaid)
          color = "error";

        return (
          <Chip label={params.row.paymentStatus} size="small" color={color} />
        );
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
            href={`/admissions/${params.row.admissionId}`}
          >
            <Visibility fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="primary"
            component={Link}
            href={`/admissions/${params.row.admissionId}/edit`}
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() =>
              onDeleteAdmission(params.row.admissionId, params.row.studentName)
            }
          >
            <Delete fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  if (isLoading) return <Box sx={{ p: 3 }}>Loading admissions...</Box>;
  if (error)
    return <Box sx={{ p: 3, color: "error.main" }}>Error: {error}</Box>;

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
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
          <Typography variant={isMobile ? "h5" : "h4"}>Admissions</Typography>
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

      {/* Filters */}
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
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter ?? ""}
              onChange={(e: SelectChangeEvent<string>) =>
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
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Enrollment Type</InputLabel>
            <Select
              value={enrollmentTypeFilter ?? ""}
              onChange={(e) => handleEnrollmentTypeFilter(e.target.value ?? "")}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value={EnrollmentType.Regular}>Regular</MenuItem>
              <MenuItem value={EnrollmentType.Trial}>Trial</MenuItem>
              <MenuItem value={EnrollmentType.Transfer}>Transfer</MenuItem>
              <MenuItem value={EnrollmentType.Special}>Special</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined" size="small" onClick={handleResetFilters}>
            Reset
          </Button>
        </Stack>
      </Paper>

      {/* Pagination & Data */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
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
          onChange={(_, newPage) => handlePageChange(newPage)}
        />
      </Box>

      {/* Desktop DataGrid */}
      {!isMobile ? (
        <DataGrid
          autoHeight
          rows={currentAdmissions}
          columns={columns}
          sortingMode="server"
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          // getRowId={(row) => row.admissionId.toString()}
          getRowId={(row) => row.studentEnrollmentId.toString()}
          disableColumnMenu
          loading={isLoading}
          paginationModel={{ page: page - 1, pageSize: rowsPerPage }}
          onPaginationModelChange={(model) => {
            setRowsPerPage(model.pageSize);
            handlePageChange(model.page + 1);
          }}
        />
      ) : (
        /* Mobile Collapsible List */
        <Box component={Paper}>
          {currentAdmissions.map((adm) => (
            <Box key={adm.admissionId}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  p: 2,
                  borderBottom: "1px solid",
                  cursor: "pointer",
                }}
                onClick={() => toggleRowExpand(adm.admissionId)}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar>{adm.studentName?.charAt(0)}</Avatar>
                  <Box>
                    <Typography fontWeight="bold">{adm.studentName}</Typography>
                    <Typography variant="body2">{adm.courseName}</Typography>
                  </Box>
                </Stack>
                <IconButton>
                  {expandedRows.includes(adm.admissionId.toString()) ? (
                    <KeyboardArrowUp />
                  ) : (
                    <KeyboardArrowDown />
                  )}
                </IconButton>
              </Box>
              <Collapse in={expandedRows.includes(adm.admissionId.toString())}>
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
                        component={Link}
                        href={`/admissions/${adm.admissionId}`}
                        size="small"
                        variant="outlined"
                      >
                        View
                      </Button>
                      <Button
                        component={Link}
                        href={`/admissions/${adm.admissionId}/edit`}
                        size="small"
                        variant="outlined"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() =>
                          onDeleteAdmission(adm.admissionId, adm.studentName)
                        }
                        size="small"
                        variant="outlined"
                        color="error"
                      >
                        Delete
                      </Button>
                    </Stack>
                  </Stack>
                </CardContent>
              </Collapse>
            </Box>
          ))}
        </Box>
      )}

      {/* Bottom Pagination */}
      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, newPage) => handlePageChange(newPage)}
          sx={{ mt: 3 }}
        />
      )}
    </Box>
  );
};

export default AdmissionList;
