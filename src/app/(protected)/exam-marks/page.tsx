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
} from "@mui/material";
import Link from "next/link";
import { useExamMarksViewModel } from "@/lib/features/examMarks/useExamMarksViewModel";
import { useExamMarksListSupport } from "@/lib/features/examMarks/useExamMarksListSupport";
import { useDeleteExamMark } from "@/lib/features/examMarks/useDeleteExamMark";

const ExamMarksList: React.FC = () => {
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
              value={examId ?? ""}
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
              value={studentId ?? ""}
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

          <FormControl size="small" sx={{ minWidth: 140 }}>
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
          </FormControl>

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

        {examMarks.length === 0 && !isLoading ? (
          <Typography>No exam marks found.</Typography>
        ) : (
          <Box sx={{ overflowX: "auto" }}>
            <table
              style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}
            >
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: 8 }}>Exam</th>
                  <th style={{ textAlign: "left", padding: 8 }}>Student</th>
                  <th style={{ textAlign: "right", padding: 8 }}>Marks</th>
                  <th style={{ textAlign: "center", padding: 8 }}>Grade</th>
                  <th style={{ textAlign: "center", padding: 8 }}>Status</th>
                  <th style={{ textAlign: "center", padding: 8 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {examMarks.map((m) => (
                  <tr key={m.examMarkId}>
                    <td style={{ padding: 8 }}>{m.examName}</td>
                    <td style={{ padding: 8 }}>{m.studentName}</td>
                    <td style={{ padding: 8, textAlign: "right" }}>
                      {m.markObtained}
                    </td>
                    <td style={{ padding: 8, textAlign: "center" }}>{m.grade}</td>
                    <td style={{ padding: 8, textAlign: "center" }}>
                      {m.status ? "Active" : "Inactive"}
                    </td>
                    <td style={{ padding: 8, textAlign: "center" }}>
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Link href={`/exam-marks/${m.examMarkId}/edit`}>
                          <Button variant="text" size="small">
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="text"
                          color="error"
                          size="small"
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
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
