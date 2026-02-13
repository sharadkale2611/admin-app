'use client';

import React, { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';

import { useAppDispatch } from "@/lib/hooks";
import { fetchStudentExamPerformance } from "@/lib/features/student/studentThunks";
import { ExamPerformanceItem } from "@/lib/features/student/studentTypes";

type ExamPerformanceTabProps = {
  studentId: number;
};

export default function PerformanceTab({
  studentId,
}: ExamPerformanceTabProps) {

  const dispatch = useAppDispatch();

  const [examList, setExamList] = useState<ExamPerformanceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPerformance = async () => {
      if (!studentId) return;

      try {
        setLoading(true);
        setError(null);

        const result = await dispatch(
          fetchStudentExamPerformance({ studentId })
        ).unwrap();

        setExamList(result.items);

      } catch (err: any) {
        setError(err?.error || "Failed to fetch exam performance");
      } finally {
        setLoading(false);
      }
    };

    loadPerformance();
  }, [studentId, dispatch]);

  return (
    <Paper sx={{ p: 3 }}>
      {/* ================= HEADER ================= */}
      <Typography variant="h6">
        Exam Performance
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 1 }}
      >
        Student ID : {studentId}
      </Typography>

      <Divider sx={{ my: 2 }} />

      {/* ================= STATES ================= */}
      {loading && <CircularProgress />}

      {error && <Alert severity="error">{error}</Alert>}

      {/* ================= TABLE ================= */}
      {!loading && !error && (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Exam</TableCell>
                <TableCell>Course / Module</TableCell>
                <TableCell align="center">Marks</TableCell>
                {/* <TableCell align="center">Grade</TableCell> */}
                <TableCell align="center">Result</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {examList.map((row, index) => (
                <TableRow key={row.examMarkId}>
                  <TableCell>{index + 1}</TableCell>

                  <TableCell>
                    <Typography variant="subtitle2">
                      {row.examName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {row.createdAt
                        ? new Date(row.createdAt).toLocaleDateString()
                        : ''}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">
                      {row.courseName || '—'}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {row.moduleName || ''}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Typography variant="body2">
                      {row.markObtained} / {row.examTotalMarks}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Pass: {row.examPassingMarks}
                    </Typography>
                  </TableCell>

                  {/* <TableCell align="center">
                    <Chip
                      label={row.grade}
                      size="small"
                      color={
                        row.grade === 'A' || row.grade === 'B'
                          ? 'success'
                          : row.grade === 'C' || row.grade === 'D'
                            ? 'warning'
                            : 'error'
                      }
                    />
                  </TableCell> */}

                  <TableCell align="center">
                    <Chip
                      label={row.result}
                      size="small"
                      color={
                        row.result === 'Passed'
                          ? 'success'
                          : 'error'
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}

              {examList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No exam performance data found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}
