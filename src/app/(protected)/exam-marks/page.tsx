"use client";

import React from "react";
import {
  Box,
  Typography,
  Paper,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Button,
  TextField,
  useMediaQuery,
  Theme,
  CardContent,
  Collapse,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Visibility,
  Edit,
  Delete,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import {
  DataGrid,
  GridColDef,
  GridSortModel,
} from "@mui/x-data-grid";
import Link from "next/link";
import { useExamMarksViewModel } from "@/lib/features/examMarks/useExamMarksViewModel";
import { useExamMarksListSupport } from "@/lib/features/examMarks/useExamMarksListSupport";
import { useDeleteExamMark } from "@/lib/features/examMarks/useDeleteExamMark";
import type { ExamMark } from "@/lib/features/examMarks/examMarksTypes";

const ExamMarksList: React.FC = () => {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  const {
    examMarks,
    isLoading,
    error,
    page,
    totalPages,
    examId,
    studentId,
    status,
    handleExamChange,
    handleStudentChange,
    handleStatusChange,
    handlePageChange,
    handleResetFilters,
  } = useExamMarksViewModel();

  const { exams, students } = useExamMarksListSupport();
  const { handleDelete } = useDeleteExamMark();

  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    { field: "examName", sort: "asc" },
  ]);

  const [expandedRows, setExpandedRows] = React.useState<string[]>([]);

  const handleSortModelChange = (newModel: GridSortModel) => {
    setSortModel(newModel);
  };

  const toggleRowExpand = (examMarkId: number | string) => {
    const idString = examMarkId.toString();
    setExpandedRows((prev) =>
      prev.includes(idString)
        ? prev.filter((rowId) => rowId !== idString)
        : [...prev, idString]
    );
  };

  const sortedExamMarks: ExamMark[] =
    examMarks.length > 0
      ? [...examMarks].sort((a, b) => {
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

  const columns: GridColDef<ExamMark>[] = [
    {
      field: "srNo",
      headerName: "Sr. No",
      width: 100,
      sortable: false,
      valueGetter: (value, row, column, apiRef) => {
        const index = apiRef.current.getRowIndexRelativeToVisibleRows(
          row.examMarkId
        );
        return index + 1;
      },
    },
    {
      field: "examName",
      headerName: "Exam",
      flex: 1,
      valueGetter: (v, row) => row?.examName || "",
    },
    {
      field: "studentName",
      headerName: "Student",
      flex: 1,
      valueGetter: (v, row) => row?.studentName || "",
    },
    {
      field: "markObtained",
      headerName: "Marks",
      width: 120,
      type: "number",
    },
    {
      field: "grade",
      headerName: "Grade",
      width: 120,
      valueGetter: (v, row) => row?.grade || "-",
    },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.row?.status ? "Active" : "Inactive"}
          color={params.row?.status ? "success" : "error"}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 170,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Link href={`/exam-marks/${params.row.examMarkId}`}>
            <Tooltip title="View">
              <IconButton size="small" color="primary">
                <Visibility fontSize="small" />
              </IconButton>
            </Tooltip>
          </Link>
          <Link href={`/exam-marks/${params.row.examMarkId}/edit`}>
            <Tooltip title="Edit">
              <IconButton size="small" color="primary">
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
          </Link>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() =>
                onDelete(
                  params.row.examMarkId,
                  `${params.row.examName} - ${params.row.studentName}`
                )
              }
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  const onDelete = async (id: number, label: string) => {
    const success = await handleDelete(id, label);
    if (success) {
      // reload current page after delete
      handlePageChange(page);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Exam Marks
        </Typography>
        <Link href="/exam-marks/create">
          <Button variant="contained" size="small">
            Add Exam Mark
          </Button>
        </Link>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Exam</InputLabel>
            <Select
              label="Exam"
              value={examId?.toString() ?? ""}
              onChange={(e) =>
                handleExamChange(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
            >
              <MenuItem value="">
                <em>All Exams</em>
              </MenuItem>
              {exams.map((ex) => (
                <MenuItem key={ex.examId} value={ex.examId}>
                  {ex.examName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Student</InputLabel>
            <Select
              label="Student"
              value={studentId?.toString() ?? ""}
              onChange={(e) =>
                handleStudentChange(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
            >
              <MenuItem value="">
                <em>All Students</em>
              </MenuItem>
              {students.map((st) => (
                <MenuItem key={st.studentId} value={st.studentId}>
                  {st.firstName} {st.lastName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={
                status === null ? "all" : status === true ? "active" : "inactive"
              }
              onChange={(e) => {
                const value = e.target.value;
                if (value === "all") handleStatusChange(null);
                else if (value === "active") handleStatusChange(true);
                else handleStatusChange(false);
              }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl> */}

          <Box sx={{ flexGrow: 1 }} />

          <Button variant="outlined" size="small" onClick={handleResetFilters}>
            Reset
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ p: 2 }}>
        {isLoading && <Typography>Loading...</Typography>}
        {error && (
          <Typography color="error" sx={{ mb: 1 }}>
            {error}
          </Typography>
        )}

        {sortedExamMarks.length === 0 && !isLoading ? (
          <Typography>No exam marks found.</Typography>
        ) : !isMobile ? (
          <Box sx={{ height: "100%", width: "100%" }}>
            <DataGrid
              rows={sortedExamMarks}
              columns={columns}
              hideFooter
              sortingMode="server"
              sortModel={sortModel}
              onSortModelChange={handleSortModelChange}
              getRowId={(row) => row.examMarkId}
              loading={isLoading}
              autoHeight
            />
          </Box>
        ) : (
          <Paper>
            {sortedExamMarks.map((m) => (
              <Box key={m.examMarkId}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    p: 2,
                  }}
                  onClick={() => toggleRowExpand(m.examMarkId)}
                >
                  <Typography fontWeight="bold">
                    {m.examName}
                  </Typography>

                  {expandedRows.includes(m.examMarkId.toString()) ? (
                    <KeyboardArrowUp />
                  ) : (
                    <KeyboardArrowDown />
                  )}
                </Box>

                <Collapse in={expandedRows.includes(m.examMarkId.toString())}>
                  <CardContent>
                    <Typography>Student: {m.studentName}</Typography>
                    <Typography>Marks: {m.markObtained}</Typography>
                    <Typography>Grade: {m.grade ?? "-"}</Typography>
                    <Typography>
                      Status: {m.status ? "Active" : "Inactive"}
                    </Typography>

                    <Stack direction="row" spacing={1} mt={2}>
                      <Link href={`/exam-marks/${m.examMarkId}`}>
                        <Button size="small">View</Button>
                      </Link>
                      <Link href={`/exam-marks/${m.examMarkId}/edit`}>
                        <Button size="small">Edit</Button>
                      </Link>
                      <Button
                        size="small"
                        color="error"
                        onClick={() =>
                          onDelete(
                            m.examMarkId,
                            `${m.examName} - ${m.studentName}`
                          )
                        }
                      >
                        Delete
                      </Button>
                    </Stack>
                  </CardContent>
                </Collapse>
              </Box>
            ))}
          </Paper>
        )}

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => handlePageChange(value)}
            size="small"
            color="primary"
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default ExamMarksList;
