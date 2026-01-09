'use client';

import React from 'react';
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
} from '@mui/material';

/* =====================================================
   TYPES (BACKEND ALIGNED)
===================================================== */

type ExamPerformance = {
  examId: number;
  examName: string;
  courseName?: string;
  moduleName?: string;
  examDuration: number; // in hrs
  totalMarks: number;
  passingMarks: number;
  marksObtained: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  status: 'Passed' | 'Failed';
};

/* =====================================================
   DUMMY DATA (API REPLACEABLE)
===================================================== */

const dummyExamPerformance: ExamPerformance[] = [
  {
    examId: 1,
    examName: 'Physics Unit Test 1',
    courseName: 'JEE 2025',
    moduleName: 'Mechanics',
    examDuration: 2,
    totalMarks: 100,
    passingMarks: 35,
    marksObtained: 78,
    grade: 'A',
    status: 'Passed',
  },
  {
    examId: 2,
    examName: 'Chemistry Unit Test 1',
    courseName: 'JEE 2025',
    moduleName: 'Organic Chemistry',
    examDuration: 1.5,
    totalMarks: 100,
    passingMarks: 35,
    marksObtained: 32,
    grade: 'F',
    status: 'Failed',
  },
];

/* =====================================================
   MAIN COMPONENT
===================================================== */

type ExamPerformanceTabProps = {
  studentId: number;
};

export default function PerformanceTab({
  studentId,
}: ExamPerformanceTabProps) {
  const examList = dummyExamPerformance;

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

      {/* ================= TABLE ================= */}
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Exam</TableCell>
              <TableCell>Course / Module</TableCell>
              <TableCell align="center">Marks</TableCell>
              <TableCell align="center">Grade</TableCell>
              <TableCell align="center">Result</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {examList.map((row, index) => (
              <TableRow key={row.examId}>
                <TableCell>{index + 1}</TableCell>

                <TableCell>
                  <Typography variant="subtitle2">
                    {row.examName}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Duration: {row.examDuration} hrs
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
                    {row.marksObtained} / {row.totalMarks}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Pass: {row.passingMarks}
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  <Chip
                    label={row.grade}
                    size="small"
                    color={
                      row.grade === 'A'
                        ? 'success'
                        : row.grade === 'B'
                          ? 'success'
                          : row.grade === 'C'
                            ? 'warning'
                            : row.grade === 'D'
                              ? 'warning'
                              : 'error'
                    }
                  />
                </TableCell>

                <TableCell align="center">
                  <Chip
                    label={row.status}
                    size="small"
                    color={
                      row.status === 'Passed'
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
    </Paper>
  );
}
