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
  SelectChangeEvent,
  useMediaQuery,
  Theme,
  CardContent,
  Collapse,
  TableSortLabel,
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
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridSortModel,
} from "@mui/x-data-grid";
import Link from "next/link";
import { useStaffViewModel } from "@/lib/features/staff/useStaffViewModel";
import { Staff } from "@/lib/features/staff/staffTypes";
import { useDeleteStaff } from "@/lib/features/staff/useDeleteStaff";

const StaffList: React.FC = () => {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  // Use the ViewModel
  const {
    staff,
    isLoading,
    error,
    page,
    totalPages,
    searchTerm,
    isActive,
    department,
    position,
    handleSearch,
    handleToggleActive,
    handleDepartmentChange,
    handlePositionChange,
    handleResetFilters,
    handlePageChange,
    refetch,
  } = useStaffViewModel();

  // State for UI controls
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    { field: "staffId", sort: "asc" },
  ]);
  const [expandedRows, setExpandedRows] = React.useState<string[]>([]);

  const [localSearchTerm, setLocalSearchTerm] = React.useState(searchTerm);
  // Use the delete hook
  const { handleDelete } = useDeleteStaff();

  // Delete handler
  const onDeleteStaff = async (staffId: string, staffName: string) => {
    const success = await handleDelete(staffId, staffName);
    if (success) {
      // Refetch the staff list after successful deletion
      refetch();
    }
  };

  const handleChangeRowsPerPage = (event: SelectChangeEvent) => {
    setRowsPerPage(Number(event.target.value));
    handlePageChange(1);
  };

  const handleSortModelChange = (newModel: GridSortModel) => {
    setSortModel(newModel);
  };

  const toggleRowExpand = (staffId: number | string) => {
    const idString = staffId.toString();
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

  // Calculate current page data
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  // Sort data
  // Sort data with better error handling
  const sortedStaff =
    staff.length > 0
      ? [...staff].sort((a, b) => {
          const sortItem = sortModel[0];
          if (!sortItem) return 0;

          // Use optional chaining to safely access properties
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
  const currentStaff = sortedStaff.slice(startIndex, endIndex);

  // Columns configuration with proper error handling
  const columns: GridColDef<Staff>[] = [
    {
      field: "staffId",
      headerName: "ID",
      width: 80,
      valueGetter: (value, row) => row?.staffId ?? "", // Use the correct signature
      renderHeader: () => {
        const isActive = sortModel[0]?.field === "staffId";
        const direction = isActive
          ? (sortModel[0]?.sort as "asc" | "desc")
          : undefined;

        return (
          <TableSortLabel
            active={isActive}
            direction={direction}
            onClick={() => {
              setSortModel([
                {
                  field: "staffId",
                  sort: isActive
                    ? sortModel[0]?.sort === "asc"
                      ? "desc"
                      : "asc"
                    : "asc",
                },
              ]);
            }}
          >
            ID
          </TableSortLabel>
        );
      },
    },
    {
      field: "avatar",
      headerName: "",
      width: 60,
      renderCell: (params) => (
        <Avatar sx={{ width: 32, height: 32 }}>
          {params.row?.firstName?.charAt(0) || ""}
          {params.row?.lastName?.charAt(0) || ""}
        </Avatar>
      ),
      sortable: false,
    },
    {
      field: "fullName",
      headerName: "Name",
      flex: 1,
      valueGetter: (value, row) =>
        `${row?.firstName || ""} ${row?.lastName || ""}`,
      renderHeader: () => {
        const isActive = sortModel[0]?.field === "fullName";
        const direction = isActive
          ? (sortModel[0]?.sort as "asc" | "desc")
          : undefined;

        return (
          <TableSortLabel
            active={isActive}
            direction={direction}
            onClick={() => {
              setSortModel([
                {
                  field: "fullName",
                  sort: isActive
                    ? sortModel[0]?.sort === "asc"
                      ? "desc"
                      : "asc"
                    : "asc",
                },
              ]);
            }}
          >
            Name
          </TableSortLabel>
        );
      },
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      valueGetter: (value, row) => row?.email || "",
      renderHeader: () => {
        const isActive = sortModel[0]?.field === "email";
        const direction = isActive
          ? (sortModel[0]?.sort as "asc" | "desc")
          : undefined;

        return (
          <TableSortLabel
            active={isActive}
            direction={direction}
            onClick={() => {
              setSortModel([
                {
                  field: "email",
                  sort: isActive
                    ? sortModel[0]?.sort === "asc"
                      ? "desc"
                      : "asc"
                    : "asc",
                },
              ]);
            }}
          >
            Email
          </TableSortLabel>
        );
      },
    },
    {
      field: "department",
      headerName: "Department",
      width: 150,
      valueGetter: (value, row) => row?.department || "",
      renderHeader: () => {
        const isActive = sortModel[0]?.field === "department";
        const direction = isActive
          ? (sortModel[0]?.sort as "asc" | "desc")
          : undefined;

        return (
          <TableSortLabel
            active={isActive}
            direction={direction}
            onClick={() => {
              setSortModel([
                {
                  field: "department",
                  sort: isActive
                    ? sortModel[0]?.sort === "asc"
                      ? "desc"
                      : "asc"
                    : "asc",
                },
              ]);
            }}
          >
            Department
          </TableSortLabel>
        );
      },
    },
    {
      field: "position",
      headerName: "Position",
      width: 150,
      valueGetter: (value, row) => row?.position || "",
      renderHeader: () => {
        const isActive = sortModel[0]?.field === "position";
        const direction = isActive
          ? (sortModel[0]?.sort as "asc" | "desc")
          : undefined;

        return (
          <TableSortLabel
            active={isActive}
            direction={direction}
            onClick={() => {
              setSortModel([
                {
                  field: "position",
                  sort: isActive
                    ? sortModel[0]?.sort === "asc"
                      ? "desc"
                      : "asc"
                    : "asc",
                },
              ]);
            }}
          >
            Position
          </TableSortLabel>
        );
      },
    },
    {
      field: "isActive",
      headerName: "Status",
      width: 120,
      valueGetter: (value, row) => row?.isActive || false,
      renderCell: (params) => (
        <Chip
          label={params.row?.isActive ? "Active" : "Inactive"}
          color={params.row?.isActive ? "success" : "error"}
          size="small"
        />
      ),
      renderHeader: () => {
        const isActive = sortModel[0]?.field === "isActive";
        const direction = isActive
          ? (sortModel[0]?.sort as "asc" | "desc")
          : undefined;

        return (
          <TableSortLabel
            active={isActive}
            direction={direction}
            onClick={() => {
              setSortModel([
                {
                  field: "isActive",
                  sort: isActive
                    ? sortModel[0]?.sort === "asc"
                      ? "desc"
                      : "asc"
                    : "asc",
                },
              ]);
            }}
          >
            Status
          </TableSortLabel>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 150,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          <IconButton
            size="small"
            color="info"
            component={Link}
            href={`/staff/${params.row?.staffId}`}
            disabled={!params.row?.staffId}
          >
            <Visibility fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="primary"
            component={Link}
            href={`/staff/${params.row?.staffId}/edit`}
            disabled={!params.row?.staffId}
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() =>
              onDeleteStaff(
                params.row.staffId,
                `${params.row.firstName} ${params.row.lastName}`
              )
            }
            disabled={!params.row?.staffId}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  // In your StaffList component
  if (isLoading) return <Box sx={{ p: 3 }}>Loading staff...</Box>;
  if (error)
    return <Box sx={{ p: 3, color: "error.main" }}>Error: {error}</Box>;

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton
            aria-label="back"
            size={isMobile ? "small" : "medium"}
            component={Link}
            href="/dashboard"
          >
            <ArrowBack fontSize={isMobile ? "small" : "medium"} />
          </IconButton>
          <Typography variant={isMobile ? "h5" : "h4"} component="h1">
            Staff Management
          </Typography>
        </Stack>
        <Button
          variant="contained"
          startIcon={<Add />}
          size={isMobile ? "small" : "medium"}
          component={Link}
          href="/staff/create"
        >
          Add Staff
        </Button>
      </Stack>

      {/* Search and Filters */}
      {/* <Paper sx={{ mb: 3, p: 2 }}> */}
      {/* <Stack direction={isMobile ? 'column' : 'row'} spacing={2} alignItems="flex-end"> */}
      {/* <FormControl fullWidth size="small">
                        <TextField
                            label="Search Staff"
                            value={localSearchTerm}
                            onChange={(e) => setLocalSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit(e)}
                            InputProps={{
                                endAdornment: (
                                    <IconButton onClick={handleSearchSubmit} size="small">
                                        <Search />
                                    </IconButton>
                                )
                            }}
                        />
                    </FormControl>
 */}
      {/* <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Department</InputLabel>
                        <Select
                            value={department}
                            onChange={(e) => handleDepartmentChange(e.target.value)}
                            label="Department"
                        >
                            <MenuItem value="">All Departments</MenuItem>
                            <MenuItem value="Teaching">Teaching</MenuItem>
                            <MenuItem value="Administration">Administration</MenuItem>
                            <MenuItem value="Support">Support</MenuItem>
                        </Select>
                    </FormControl> */}

      {/* <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Position</InputLabel>
                        <Select
                            value={position}
                            onChange={(e) => handlePositionChange(e.target.value)}
                            label="Position"
                        >
                            <MenuItem value="">All Positions</MenuItem>
                            <MenuItem value="Teacher">Teacher</MenuItem>
                            <MenuItem value="Principal">Principal</MenuItem>
                            <MenuItem value="Admin">Admin</MenuItem>
                        </Select>
                    </FormControl> */}

      {/* <Button
                        variant={activeOnly ? 'contained' : 'outlined'}
                        onClick={handleToggleActive}
                        size="small"
                    >
                        {activeOnly ? 'Active Only' : 'Show All'}
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={handleResetFilters}
                        size="small"
                    >
                        Reset
                    </Button> */}
      {/* </Stack> */}
      {/* </Paper> */}

      {/* Pagination controls */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? 2 : 0,
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Rows</InputLabel>
          <Select
            value={rowsPerPage.toString()}
            label="Rows"
            onChange={handleChangeRowsPerPage}
          >
            {[5, 10, 25, 50].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography
          variant="body2"
          sx={{ textAlign: isMobile ? "center" : "left" }}
        >
          Page {page} of {totalPages} | Total: {staff.length} staff members
        </Typography>

        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, newPage) => handlePageChange(newPage)}
          color="primary"
          shape="rounded"
          size={isMobile ? "small" : "medium"}
        />
      </Box>

      {/* Desktop DataGrid */}
      {!isMobile ? (
        <Box sx={{ height: 600, width: "100%", mb: 2 }}>
          {error ? (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Typography color="error" variant="h6">
                Error loading data
              </Typography>
              <Button variant="contained" onClick={refetch}>
                Retry
              </Button>
            </Box>
          ) : (
            <DataGrid
              rows={currentStaff}
              columns={columns}
              hideFooter
              sortingMode="server"
              sortModel={sortModel}
              onSortModelChange={handleSortModelChange}
              disableColumnMenu
              getRowId={(row) =>
                row?.staffId ? row.staffId.toString() : Math.random().toString()
              }
              loading={isLoading}
              slots={{
                noRowsOverlay: () => (
                  <Stack
                    height="100%"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography>No staff members found</Typography>
                  </Stack>
                ),
              }}
            />
          )}
        </Box>
      ) : (
        /* Mobile Collapsible List */
        <Box component={Paper} elevation={3} sx={{ mb: 2 }}>
          {currentStaff.map((staffMember) => (
            <Box key={staffMember.staffId}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 2,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "action.hover" },
                }}
                onClick={() => toggleRowExpand(staffMember.staffId)}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ width: 40, height: 40 }}>
                    {staffMember.firstName?.charAt(0)}
                    {staffMember.lastName?.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography fontWeight="bold">
                      {staffMember.firstName} {staffMember.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {staffMember.position}
                    </Typography>
                  </Box>
                </Box>
                <IconButton size="small">
                  {expandedRows.includes(staffMember.staffId) ? (
                    <KeyboardArrowUp />
                  ) : (
                    <KeyboardArrowDown />
                  )}
                </IconButton>
              </Box>

              <Collapse
                in={expandedRows.includes(staffMember.staffId.toString())}
              >
                <CardContent>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Email
                      </Typography>
                      <Typography>{staffMember.email}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Department
                      </Typography>
                      <Typography>{staffMember.department || "-"}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Status
                      </Typography>
                      <Chip
                        label={staffMember.isActive ? "Active" : "Inactive"}
                        color={staffMember.isActive ? "success" : "error"}
                        size="small"
                      />
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Visibility />}
                        fullWidth
                        component={Link}
                        href={`/staff/${staffMember.staffId}`}
                      >
                        View
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Edit />}
                        color="primary"
                        fullWidth
                        component={Link}
                        href={`/staff/${staffMember.staffId}/edit`}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Delete />}
                        color="error"
                        fullWidth
                        onClick={() => {
                          if (
                            confirm(
                              "Are you sure you want to delete this staff member?"
                            )
                          ) {
                            // dispatch(deleteStaff(staffMember.staffId)); // CHANGE staffMember.id to staffMember.staffId
                          }
                        }}
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

      {/* Bottom pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, newPage) => handlePageChange(newPage)}
            color="primary"
            shape="rounded"
            size={isMobile ? "small" : "medium"}
          />
        </Box>
      )}
    </Box>
  );
};

export default StaffList;
