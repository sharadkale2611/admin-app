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
} from "@mui/icons-material";

import {
  DataGrid,
  GridColDef,
  GridSortModel,
} from "@mui/x-data-grid";

import Link from "next/link";

import { useExamViewModel } from "@/lib/features/exam/useExamViewModel";
import { Exam } from "@/lib/features/exam/examTypes";
import { useDeleteExam } from "@/lib/features/exam/useDeleteExam";


const ExamList: React.FC = () => {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  const {
    exams,
    isLoading,
    error,
    page,
    totalPages,
    searchTerm,
    isActive,
    handleSearch,
    handleToggleActive,
    handleResetFilters,
    handlePageChange,
    refetch,

    // ⭐ now received from hook
    modules,
    courses
  } = useExamViewModel();

  const { handleDeleteExam } = useDeleteExam();

  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    { field: "examId", sort: "asc" },
  ]);

  const [expandedRows, setExpandedRows] = React.useState<string[]>([]);

  const handleChangeRowsPerPage = (event: SelectChangeEvent) => {
    setRowsPerPage(Number(event.target.value));
    handlePageChange(1);
  };

  const handleSortModelChange = (newModel: GridSortModel) => {
    setSortModel(newModel);
  };

  const toggleRowExpand = (examId: number | string) => {
    const idString = examId.toString();
    setExpandedRows((prev) =>
      prev.includes(idString)
        ? prev.filter((rowId) => rowId !== idString)
        : [...prev, idString]
    );
  };

  // ⭐ Helper → Get Module Name
  const getModuleName = (moduleId: number | null | undefined) => {
    if (!moduleId) return "-";
    const mod = modules?.find(m => m.moduleId === moduleId);
    return mod?.moduleName || `Module #${moduleId}`;
  };

  // ⭐ Helper → Get Course Name
  const getCourseName = (courseId: number | null | undefined) => {
    if (!courseId) return "-";
    const crs = courses?.find(c => c.courseId === courseId);
    return crs?.courseName || `Course #${courseId}`;
  };


  // Pagination
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const sortedExams =
    exams.length > 0
      ? [...exams].sort((a, b) => {
          const sortItem = sortModel[0];
          if (!sortItem) return 0;

          const aValue = a?.[sortItem.field as keyof typeof a];
          const bValue = b?.[sortItem.field as keyof typeof b];

          if (aValue === undefined && bValue === undefined) return 0;
          if (aValue === undefined) return sortItem.sort === "asc" ? 1 : -1;
          if (bValue === undefined) return sortItem.sort === "asc" ? -1 : 1;

          const aString = String(aValue ?? "");
          const bString = String(bValue ?? "");

          return sortItem.sort === "asc"
            ? aString.localeCompare(bString)
            : bString.localeCompare(aString);
        })
      : [];

  const currentExams = sortedExams.slice(startIndex, endIndex);

  // ⭐ Table Columns
  const columns: GridColDef<Exam>[] = [
    {
      field: "examId",
      headerName: "ID",
      width: 90,
      valueGetter: (v, row) => row?.examId ?? "",
      renderHeader: () => {
        const isActive = sortModel[0]?.field === "examId";
        const direction = isActive
          ? (sortModel[0]?.sort as "asc" | "desc")
          : undefined;

        return (
          <TableSortLabel
            active={isActive}
            direction={direction}
            onClick={() =>
              setSortModel([
                {
                  field: "examId",
                  sort:
                    isActive && sortModel[0]?.sort === "asc"
                      ? "desc"
                      : "asc",
                },
              ])
            }
          >
            ID
          </TableSortLabel>
        );
      },
    },

    {
      field: "examName",
      headerName: "Exam Name",
      flex: 1,
      valueGetter: (v, row) => row?.examName || "",
    },

    {
      field: "moduleId",
      headerName: "Module",
      width: 200,
      valueGetter: (v, row) => getModuleName(row?.moduleId),
    },

    {
      field: "courseId",
      headerName: "Course",
      width: 220,
      valueGetter: (v, row) => getCourseName(row?.courseId),
    },

    {
      field: "examTotalMarks",
      headerName: "Total Marks",
      width: 130,
    },

    {
      field: "examPassingMarks",
      headerName: "Passing Marks",
      width: 140,
    },

    {
      field: "isActive",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.row?.isActive ? "Active" : "Inactive"}
          color={params.row?.isActive ? "success" : "error"}
          size="small"
        />
      ),
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 160,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton
            color="info"
            component={Link}
            href={`/exams/${params.row.examId}`}
          >
            <Visibility fontSize="small" />
          </IconButton>

          <IconButton
            color="primary"
            component={Link}
            href={`/exams/${params.row.examId}/edit`}
          >
            <Edit fontSize="small" />
          </IconButton>

          <IconButton
            color="error"
            onClick={async () => {
              const deleted = await handleDeleteExam(
                params.row.examId,
                params.row.examName
              );

              if (deleted) {
                refetch();
              }
            }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];


  if (isLoading) return <Box sx={{ p: 3 }}>Loading exams...</Box>;
  if (error) return <Box sx={{ p: 3, color: "error.main" }}>Error: {error}</Box>;


  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton component={Link} href="/dashboard">
            <ArrowBack />
          </IconButton>

          <Typography variant="h4">Exam Management</Typography>
        </Stack>

        <Button
          variant="contained"
          startIcon={<Add />}
          component={Link}
          href="/exams/create"
        >
          Add Exam
        </Button>
      </Stack>

      {/* Pagination Bar */}
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
            label="Rows"
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
          Page {page} of {totalPages} | Total: {exams.length} exams
        </Typography>

        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, newPage) => handlePageChange(newPage)}
        />
      </Box>

      {/* Desktop Grid */}
      {!isMobile ? (
        <DataGrid
          rows={currentExams}
          columns={columns}
          hideFooter
          sortingMode="server"
          sortModel={sortModel}
          onSortModelChange={handleSortModelChange}
          getRowId={(row) => row.examId}
          loading={isLoading}
        />
      ) : (
        <Paper>
          {currentExams.map((exam) => (
            <Box key={exam.examId}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  p: 2,
                }}
                onClick={() => toggleRowExpand(exam.examId)}
              >
                <Typography fontWeight="bold">
                  {exam.examName}
                </Typography>

                {expandedRows.includes(exam.examId.toString()) ? (
                  <KeyboardArrowUp />
                ) : (
                  <KeyboardArrowDown />
                )}
              </Box>

              <Collapse in={expandedRows.includes(exam.examId.toString())}>
                <CardContent>
                  <Typography>
                    Module: {getModuleName(exam.moduleId)}
                  </Typography>

                  <Typography>
                    Course: {getCourseName(exam.courseId)}
                  </Typography>

                  <Typography>Total: {exam.examTotalMarks}</Typography>
                  <Typography>Pass: {exam.examPassingMarks}</Typography>

                  <Stack direction="row" spacing={1} mt={2}>
                    <Button component={Link} href={`/exams/${exam.examId}`}>
                      View
                    </Button>

                    <Button component={Link} href={`/exams/${exam.examId}/edit`}>
                      Edit
                    </Button>
                  </Stack>
                </CardContent>
              </Collapse>
            </Box>
          ))}
        </Paper>
      )}
    </Box>
  );
};

export default ExamList;
