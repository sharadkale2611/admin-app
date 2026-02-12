"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Alert,
  Stack,
  Divider
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import API_ENDPOINTS from "@/lib/config/apiConfig";
import { api } from "@/lib/services/apiService";

// Redux
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useRouter, useParams } from "next/navigation";

import {
  createBulkSchedules,
  createSingleSchedule,
  fetchBatchSchedules,
} from "@/lib/features/batchSchedules/batchScheduleThunks";
import { clearMessages } from "@/lib/features/batchSchedules/batchScheduleSlice";

import type { CreateBatchScheduleModel } from "@/lib/features/batchSchedules/batchScheduleTypes";

import { fetchAllStaff } from "@/lib/features/staff/staffThunks";
import { fetchClassRooms } from "@/lib/features/classRoom/classRoomThunks";
import { fetchBatchById } from "@/lib/features/batch/batchThunks"; // ✅ NEW

/* ===================== CONSTANTS ===================== */

const weekDaysOptions = [
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
  { label: "Sun", value: 0 },
];

function combineDateTime(dateStr: string, timeStr: string) {
  return `${dateStr}T${timeStr}:00`;
}

function toTimeInputValue(value: string | null | undefined) {
  if (!value) return "";
  // backend often sends "HH:mm:ss"; <input type="time"> expects "HH:mm"
  return value.length >= 5 ? value.slice(0, 5) : value;
}

function formatScheduleDate(dateTime: string) {
  if (!dateTime) return "-";
  const date = new Date(dateTime);
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  return `[${days[date.getDay()]}] ${date
    .toISOString()
    .slice(0, 10)
    .split("-")
    .reverse()
    .join("-")}`;
}

/* ===================== PAGE ===================== */

const BatchSchedulesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();

  // ✅ NEW: batchId from URL
  const batchId = Number(params.id);

  const { currentBatch } = useAppSelector(state => state.batches);

  const { items: savedSchedules, loading, error, successMessage } =
    useAppSelector(state => state.batchSchedules);

  const staffList = useAppSelector(state => state.staff.dropdownStaff);
  const classRooms = useAppSelector(state => state.classRooms.classRooms);

  const trainers = staffList;

  /* ---------------- LOCAL STATE ---------------- */
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("9:00");
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);

  const [trainerId, setTrainerId] = useState<number | "">("");
  const [selectedClassRoomId, setSelectedClassRoomId] = useState<number | "">("");
  const [batchDurationInHr, setBatchDurationInHr] = useState<number>(1);

  const [generatedItems, setGeneratedItems] = useState<CreateBatchScheduleModel[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);

  /* ---------------- LOAD REQUIRED DATA ---------------- */

  useEffect(() => {
    if (!batchId) return;

    dispatch(fetchBatchById(batchId));           // ✅ NEW
    dispatch(fetchBatchSchedules(batchId));      // existing
    dispatch(fetchAllStaff());
    dispatch(fetchClassRooms());
  }, [batchId, dispatch]);

  // Prefill defaults from batch
  useEffect(() => {
    if (!currentBatch) return;

    setTrainerId(currentBatch.trainerId ?? "");
    setSelectedClassRoomId(currentBatch.classRoomId ?? "");
    setBatchDurationInHr(currentBatch.batchDurationInHr ?? 1);
    setStartTime(toTimeInputValue(currentBatch.startTime));
  }, [currentBatch]);

  /* ---------------- ACTIONS ---------------- */

  const handleToggleDay = (day: number) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleGenerate = () => {
    setLocalError(null);
    dispatch(clearMessages());

    if (!startDate || !endDate || !startTime) {
      setLocalError("Please fill Start Date, End Date and Start Time");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      setLocalError("Start Date cannot be greater than End Date");
      return;
    }

    const items: CreateBatchScheduleModel[] = [];
    let current = new Date(start);

    while (current <= end) {
      if (selectedDays.includes(current.getDay())) {
        const dateStr = current.toISOString().split("T")[0];
        items.push({
          expectedDateTime: combineDateTime(dateStr, startTime),
          expectedTrainerId: typeof trainerId === "number" ? trainerId : undefined,
          classRoomId:
            typeof selectedClassRoomId === "number"
              ? selectedClassRoomId
              : undefined,
        });
      }
      current.setDate(current.getDate() + 1);
    }

    if (!items.length) {
      setLocalError("No schedules generated.");
      return;
    }

    setGeneratedItems(items);
  };

  const handleConfirm = async () => {
    if (!generatedItems.length) return;

    await dispatch(
      createBulkSchedules({
        batchId,
        items: generatedItems,
      })
    ).unwrap();

    dispatch(fetchBatchSchedules(batchId));
    setGeneratedItems([]);

    router.push(`/batches/${batchId}`); // ✅ Redirect back
  };

  /* ===================== UI ===================== */

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* ---------- HEADER ---------- */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push(`/batches/${batchId}`)}
        >
          Back to Batch Details
        </Button>

        <Typography variant="h5" fontWeight={600}>
          Create Schedule
        </Typography>
      </Stack>

      {/* ---------- BATCH DETAILS (READ ONLY) ---------- */}
      {currentBatch && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography fontWeight={600}>
            {currentBatch.batchCode}
          </Typography>
          <Typography color="text.secondary">
            {currentBatch.moduleName} • {currentBatch.batchDurationInHr} hrs
          </Typography>
        </Paper>
      )}

      {/* ---------- FORM ---------- */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          {/* Start Date */}
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              type="date"
              fullWidth
              size="small"
              label="Start Date"
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
          </Grid>

          {/* End Date */}
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              type="date"
              fullWidth
              size="small"
              label="End Date"
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </Grid>

          {/* Start Time */}
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              type="time"
              fullWidth
              size="small"
              label="Start Time"
              InputLabelProps={{ shrink: true }}
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              // disabled={!!currentBatch?.startTime}
              InputProps={{ readOnly: !!currentBatch?.startTime }}
            />
          </Grid>

          {/* Days */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2">Working Days</Typography>
            <FormGroup row>
              {weekDaysOptions.map(d => (
                <FormControlLabel
                  key={d.value}
                  control={
                    <Checkbox
                      checked={selectedDays.includes(d.value)}
                      onChange={() => handleToggleDay(d.value)}
                    />
                  }
                  label={d.label}
                />
              ))}
            </FormGroup>
          </Grid>

          {/* Actions */}
          <Grid size={{ xs: 12 }}>
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" onClick={handleGenerate}>
                Generate
              </Button>
              <Button
                variant="contained"
                onClick={handleConfirm}
                disabled={loading || !generatedItems.length}
              >
                Confirm & Save
              </Button>
            </Stack>
          </Grid>
        </Grid>

        {/* Alerts */}
        <Box mt={2}>
          {localError && <Alert severity="error">{localError}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
          {successMessage && <Alert severity="success">{successMessage}</Alert>}
        </Box>
      </Paper>

      {/* ---------- PREVIEW ---------- */}
      {generatedItems.length > 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Generated Schedule</Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {generatedItems.map((i, idx) => (
                <TableRow key={idx}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{formatScheduleDate(i.expectedDateTime)}</TableCell>
                  <TableCell>{startTime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Container>
  );
};

export default BatchSchedulesPage;
