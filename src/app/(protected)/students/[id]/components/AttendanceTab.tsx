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
  Stack,
  Button,
} from '@mui/material';

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

import { useAppDispatch } from "@/lib/hooks";
import { fetchStudentModuleWiseAttendance } from "@/lib/features/student/studentThunks";
import { ModuleWiseAttendanceItem } from "@/lib/features/student/studentTypes";

type AttendanceTabProps = {
  studentId: number;
};

export default function AttendanceTab({ studentId }: AttendanceTabProps) {
  const dispatch = useAppDispatch();

  const now = dayjs();
  const [fromDate, setFromDate] = useState<Dayjs | null>(
    now.startOf("month")
  );
  const [toDate, setToDate] = useState<Dayjs | null>(
    now.endOf("month")
  );

  const [data, setData] = useState<ModuleWiseAttendanceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAttendance = async () => {
    if (!studentId) return;

    try {
      setLoading(true);
      setError(null);

      const result = await dispatch(
        fetchStudentModuleWiseAttendance({
          studentId,
          from: fromDate?.format("YYYY-MM-DD"),
          to: toDate?.format("YYYY-MM-DD"),
        })
      ).unwrap();

      setData(result.items);

    } catch (err: any) {
      setError(err?.error || "Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, [studentId]);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6">
        Attendance Summary
      </Typography>

      <Divider sx={{ my: 2 }} />

      {/*  DATE RANGE SECTION */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mb: 2 }}
        >
          <DatePicker
            label="From"
            value={fromDate}
            onChange={(newValue) => setFromDate(newValue)}
          />

          <DatePicker
            label="To"
            value={toDate}
            onChange={(newValue) => setToDate(newValue)}
          />

          <Button
            variant="outlined"
            onClick={loadAttendance}
          >
            Apply
          </Button>
        </Stack>
      </LocalizationProvider>

      {loading && <CircularProgress />}

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Module</TableCell>
                <TableCell align="center">Total Sessions</TableCell>
                <TableCell align="center">Present</TableCell>
                <TableCell align="center">Absent</TableCell>
                <TableCell align="center">Leave</TableCell>
                <TableCell align="center">Late</TableCell>
                <TableCell align="center">%</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {data.map((row, index) => (
                <TableRow key={row.moduleId}>
                  <TableCell>{index + 1}</TableCell>

                  <TableCell>
                    <Typography variant="subtitle2">
                      {row.moduleName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {row.batchName}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    {row.totalMarkedSessions}
                  </TableCell>

                  <TableCell align="center">
                    <Chip label={row.presentSessions} color="success" size="small" />
                  </TableCell>

                  <TableCell align="center">
                    <Chip label={row.absentSessions} color="error" size="small" />
                  </TableCell>

                  <TableCell align="center">
                    <Chip label={row.leaveSessions} color="warning" size="small" />
                  </TableCell>

                  <TableCell align="center">
                    <Chip label={row.lateSessions} color="info" size="small" />
                  </TableCell>

                  <TableCell align="center">
                    <Chip label={`${row.percentage}%`} color="primary" size="small" />
                  </TableCell>
                </TableRow>
              ))}

              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No attendance data found
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
