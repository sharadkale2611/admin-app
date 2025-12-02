'use client'
import React, { useState } from 'react';
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Snackbar
} from '@mui/material';
import {
    ArrowBack,
    Edit,
    Visibility,
    Delete,
    KeyboardArrowDown,
    KeyboardArrowUp,
    Add,
    Search,
    AttachMoney
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';
import Link from 'next/link';
import { useCourseFeesViewModel } from '@/lib/features/fees/useCourseFeesViewModel';
import { useCourseViewModel } from "@/lib/features/course/useCourseViewModel";
import { CourseFee } from '@/lib/features/fees/feesThunks';

const CourseFeesList: React.FC = () => {
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    // Use the ViewModel
    const {
        courseFees,
        isLoading,
        error,
        filters,
        handleCourseIdFilter,
        handleClearFilters,
        handleClearError, // This should now be available from the ViewModel
        handleDeleteCourseFee,
        refetch,
        refetchByFirm,
        refetchByCourse
    } = useCourseFeesViewModel();

    const { courses, isLoading: coursesLoading } = useCourseViewModel();

    // State for UI controls
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'courseFeeId', sort: 'asc' }]);
    const [expandedRows, setExpandedRows] = useState<string[]>([]);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [courseFeeToDelete, setCourseFeeToDelete] = useState<CourseFee | null>(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Delete handler
    const onDeleteCourseFee = async (courseFee: CourseFee) => {
        setCourseFeeToDelete(courseFee);
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!courseFeeToDelete) return;

        try {
            const result = await handleDeleteCourseFee(courseFeeToDelete.courseFeeId);

            // Type payload correctly
            const payload = result.payload as { success: boolean; message?: string } | undefined;

            if (payload?.success) {
                setSnackbar({ open: true, message: payload.message || 'Operation successful', severity: 'success' });
            } else {
                const errorMessage = payload?.message || 'Operation failed';
                setSnackbar({ open: true, message: errorMessage, severity: 'error' });
            }

        } catch (error) {
            setSnackbar({ open: true, message: 'An error occurred while deleting the course fee', severity: 'error' });
        }

        setDeleteConfirmOpen(false);
        setCourseFeeToDelete(null);
    };


    const cancelDelete = () => {
        setDeleteConfirmOpen(false);
        setCourseFeeToDelete(null);
    };

    const handleChangeRowsPerPage = (event: SelectChangeEvent) => {
        setRowsPerPage(Number(event.target.value));
        setPage(1);
    };

    const handleSortModelChange = (newModel: GridSortModel) => {
        setSortModel(newModel);
    };

    const toggleRowExpand = (courseFeeId: number) => {
        const idString = courseFeeId.toString();
        setExpandedRows(prev =>
            prev.includes(idString) ? prev.filter(rowId => rowId !== idString) : [...prev, idString]
        );
    };

    // Calculate current page data
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    // Sort data
    const sortedCourseFees = courseFees.length > 0 ? [...courseFees].sort((a, b) => {
        const sortItem = sortModel[0];
        if (!sortItem) return 0;

        const aValue = a?.[sortItem.field as keyof typeof a];
        const bValue = b?.[sortItem.field as keyof typeof b];

        if (aValue === undefined && bValue === undefined) return 0;
        if (aValue === undefined) return sortItem.sort === 'asc' ? 1 : -1;
        if (bValue === undefined) return sortItem.sort === 'asc' ? -1 : 1;

        const aString = String(aValue || '');
        const bString = String(bValue || '');

        return sortItem.sort === 'asc'
            ? aString.localeCompare(bString)
            : bString.localeCompare(aString);
    }) : [];

    const currentCourseFees = sortedCourseFees.slice(startIndex, endIndex);
    const totalPages = Math.ceil(courseFees.length / rowsPerPage);

    // Columns configuration
    const columns: GridColDef<CourseFee>[] = [
        {
            field: 'courseFeeId',
            headerName: 'ID',
            width: 80,
            valueGetter: (value, row) => row?.courseFeeId ?? '',
            renderHeader: () => {
                const isActive = sortModel[0]?.field === 'courseFeeId';
                const direction = isActive ? sortModel[0]?.sort as 'asc' | 'desc' : undefined;

                return (
                    <TableSortLabel
                        active={isActive}
                        direction={direction}
                        onClick={() => {
                            setSortModel([{
                                field: 'courseFeeId',
                                sort: isActive
                                    ? sortModel[0]?.sort === 'asc' ? 'desc' : 'asc'
                                    : 'asc'
                            }]);
                        }}
                    >
                        ID
                    </TableSortLabel>
                );
            }
        },
        {
            field: 'courseName',
            headerName: 'Course',
            flex: 1,
            valueGetter: (value, row) => row?.courseName || '',
            renderHeader: () => {
                const isActive = sortModel[0]?.field === 'courseName';
                const direction = isActive ? sortModel[0]?.sort as 'asc' | 'desc' : undefined;

                return (
                    <TableSortLabel
                        active={isActive}
                        direction={direction}
                        onClick={() => {
                            setSortModel([{
                                field: 'courseName',
                                sort: isActive
                                    ? sortModel[0]?.sort === 'asc' ? 'desc' : 'asc'
                                    : 'asc'
                            }]);
                        }}
                    >
                        Course
                    </TableSortLabel>
                );
            }
        },
        {
            field: 'feeAmount',
            headerName: 'Fee Amount',
            width: 120,
            valueGetter: (value, row) => row?.feeAmount ?? 0,
            renderCell: (params) => (
                <Typography>
                    ₹{params.row.feeAmount?.toLocaleString('en-IN')}
                </Typography>
            ),
        },
        {
            field: 'gstPercentage',
            headerName: 'GST %',
            width: 100,
            valueGetter: (value, row) => row?.gstPercentage ?? 0,
            renderCell: (params) => (
                <Typography>
                    {params.row.gstPercentage}%
                </Typography>
            ),
        },
        {
            field: 'totalFee',
            headerName: 'Total Fee',
            width: 120,
            valueGetter: (value, row) => row?.totalFee ?? 0,
            renderCell: (params) => (
                <Typography fontWeight="bold">
                    ₹{params.row.totalFee?.toLocaleString('en-IN')}
                </Typography>
            ),
        },
        {
            field: 'totalInstallments',
            headerName: 'Installments',
            width: 100,
            valueGetter: (value, row) => row?.totalInstallments ?? 0,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            width: 150,
            renderCell: (params) => (
                <Stack direction="row" spacing={0.5}>
                    <IconButton
                        size="small"
                        color="info"
                        component={Link}
                        href={`/fees/${params.row?.courseFeeId}`}
                        disabled={!params.row?.courseFeeId}
                    >
                        <Visibility fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        color="primary"
                        component={Link}
                        href={`/fees/${params.row?.courseFeeId}/edit`}
                        disabled={!params.row?.courseFeeId}
                    >
                        <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDeleteCourseFee(params.row)}
                        disabled={!params.row?.courseFeeId}
                    >
                        <Delete fontSize="small" />
                    </IconButton>
                </Stack>
            )
        }
    ];

    if (isLoading) return <Box sx={{ p: 3 }}>Loading course fees...</Box>;

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
              Course Fees Management
            </Typography>
          </Stack>
          <Button
            variant="contained"
            startIcon={<Add />}
            size={isMobile ? "small" : "medium"}
            component={Link}
            href="/fees/create"
          >
            Add Fee Structure
          </Button>
        </Stack>

        {/* Filters */}
        <Paper sx={{ mb: 3, p: 2 }}>
          <Stack
            direction={isMobile ? "column" : "row"}
            spacing={2}
            alignItems="flex-end"
          >
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Filter by Course</InputLabel>
              <Select
                value={filters.courseId ? filters.courseId.toString() : ""}
                onChange={(e) => {
                  const value = e.target.value;
                  const id = value === "" ? undefined : Number(value);

                  handleCourseIdFilter(id);

                  if (id) refetchByCourse();
                  else refetchByFirm();
                }}
                label="Filter by Course"
              >
                <MenuItem value="">All Courses</MenuItem>

                {!coursesLoading &&
                  courses?.map((c) => (
                    <MenuItem key={c.courseId} value={c.courseId.toString()}>
                      {c.courseName}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              onClick={() => {
                  handleClearFilters();
                  refetchByFirm(); // load firm's fees after clearing
              }}
              size="small"
          >
              Clear Filters
          </Button>
          </Stack>
        </Paper>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={handleClearError}>
            {error}
          </Alert>
        )}

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
            Page {page} of {totalPages} | Total: {courseFees.length} fee
            structures
          </Typography>

          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, newPage) => setPage(newPage)}
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
                rows={currentCourseFees}
                columns={columns}
                hideFooter
                sortingMode="server"
                sortModel={sortModel}
                onSortModelChange={handleSortModelChange}
                disableColumnMenu
                getRowId={(row) =>
                  row?.courseFeeId
                    ? row.courseFeeId.toString()
                    : Math.random().toString()
                }
                loading={isLoading}
                slots={{
                  noRowsOverlay: () => (
                    <Stack
                      height="100%"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Typography>No course fees found</Typography>
                    </Stack>
                  ),
                }}
              />
            )}
          </Box>
        ) : (
          /* Mobile Collapsible List */
          <Box component={Paper} elevation={3} sx={{ mb: 2 }}>
            {currentCourseFees.map((courseFee) => (
              <Box key={courseFee.courseFeeId}>
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
                  onClick={() => toggleRowExpand(courseFee.courseFeeId)}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      sx={{ width: 40, height: 40, bgcolor: "primary.main" }}
                    >
                      <AttachMoney />
                    </Avatar>
                    <Box>
                      <Typography fontWeight="bold">
                        {courseFee.courseName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ₹{courseFee.totalFee?.toLocaleString("en-IN")}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton size="small">
                    {expandedRows.includes(courseFee.courseFeeId.toString()) ? (
                      <KeyboardArrowUp />
                    ) : (
                      <KeyboardArrowDown />
                    )}
                  </IconButton>
                </Box>

                <Collapse
                  in={expandedRows.includes(courseFee.courseFeeId.toString())}
                >
                  <CardContent>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Fee Amount
                        </Typography>
                        <Typography>
                          ₹{courseFee.feeAmount?.toLocaleString("en-IN")}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          GST Percentage
                        </Typography>
                        <Typography>{courseFee.gstPercentage}%</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Total Fee
                        </Typography>
                        <Typography fontWeight="bold">
                          ₹{courseFee.totalFee?.toLocaleString("en-IN")}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Installments
                        </Typography>
                        <Typography>{courseFee.totalInstallments}</Typography>
                      </Box>
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Visibility />}
                          fullWidth
                          component={Link}
                          href={`/course-fees/${courseFee.courseFeeId}`}
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
                          href={`/course-fees/${courseFee.courseFeeId}/edit`}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Delete />}
                          color="error"
                          fullWidth
                          onClick={() => onDeleteCourseFee(courseFee)}
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
              onChange={(_, newPage) => setPage(newPage)}
              color="primary"
              shape="rounded"
              size={isMobile ? "small" : "medium"}
            />
          </Box>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirmOpen} onClose={cancelDelete}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the fee structure for{" "}
              {courseFeeToDelete?.courseName}?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={cancelDelete}>Cancel</Button>
            <Button onClick={confirmDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            severity={snackbar.severity as any}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    );
};

export default CourseFeesList;