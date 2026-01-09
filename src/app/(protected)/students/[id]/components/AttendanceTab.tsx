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
   TYPES
===================================================== */
type BatchAttendanceSummary = {
  batchId: number;
  batchCode: string;
  totalSessions: number;
  present: number;
  absent: number;
  leave: number;
  upcomingSessions: number;
};

/* =====================================================
   DUMMY DATA
===================================================== */
const dummyBatchAttendance: BatchAttendanceSummary[] = [
  {
    batchId: 1,
    batchCode: 'JEE-2025-A',
    totalSessions: 120,
    present: 110,
    absent: 8,
    leave: 2,
    upcomingSessions: 10,
  },
  {
    batchId: 2,
    batchCode: 'PHY-CRASH-01',
    totalSessions: 30,
    present: 26,
    absent: 3,
    leave: 1,
    upcomingSessions: 4,
  },
];

/* =====================================================
   MAIN COMPONENT
===================================================== */
type AttendanceTabProps = {
  studentId: number;
};

export default function AttendanceTab({ studentId }: AttendanceTabProps) {
  const batchAttendanceList = dummyBatchAttendance;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6">
        Attendance Summary
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 1 }}
      >
        Student ID : {studentId}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Batch</TableCell>
              <TableCell align="center">Total Sessions</TableCell>
              <TableCell align="center">Present</TableCell>
              <TableCell align="center">Absent</TableCell>
              <TableCell align="center">Leave</TableCell>
              <TableCell align="center">Upcoming Sessions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {batchAttendanceList.map((row, index) => (
              <TableRow key={row.batchId}>
                <TableCell>{index + 1}</TableCell>

                <TableCell>
                  <Typography variant="subtitle2">
                    {row.batchCode}
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  {row.totalSessions}
                </TableCell>

                <TableCell align="center">
                  <Chip label={row.present} color="success" size="small" />
                </TableCell>

                <TableCell align="center">
                  <Chip label={row.absent} color="error" size="small" />
                </TableCell>

                <TableCell align="center">
                  <Chip label={row.leave} color="warning" size="small" />
                </TableCell>

                <TableCell align="center">
                  <Chip
                    label={row.upcomingSessions}
                    color="info"
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}

            {batchAttendanceList.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No attendance data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
