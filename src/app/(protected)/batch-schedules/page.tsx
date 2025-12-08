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
} from "@mui/material";

import API_ENDPOINTS from "@/lib/config/apiConfig";
import { api } from "@/lib/services/apiService";

// Redux
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

import {
  createBulkSchedules,
  createSingleSchedule,
  fetchBatchSchedules,
} from "@/lib/features/batchSchedules/batchScheduleThunks";
import { clearMessages } from "@/lib/features/batchSchedules/batchScheduleSlice";
import type { CreateBatchScheduleModel } from "@/lib/features/batchSchedules/batchScheduleTypes";

import { fetchAllStaff } from "@/lib/features/staff/staffThunks";
import { fetchClassRooms } from "@/lib/features/classRoom/classRoomThunks";

// ============= Types =============

type Batch = {
  batchId: number;
  batchCode: string;
  trainerId?: number | null;
  classRoomId?: number | null;
  classRoomName?: string | null;
  batchDurationInHr?: number | null;
};

type ClassRoom = {
  classRoomId: number;
  classRoomName: string;
};

// Week days
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


function formatScheduleDate(dateTime: string) {
  if (!dateTime) return "-";

  const date = new Date(dateTime);

  // DAY names
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const dayName = days[date.getDay()];

  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();

  return `[${dayName}] ${dd}-${mm}-${yyyy}`;
}


// Get all batches (simple list)
async function fetchBatchesApi(): Promise<Batch[]> {
  const res = await api.get<Batch[]>(API_ENDPOINTS.BATCHES.GET_LIST);
  if (!res.success) {
    throw new Error(res.error || res.message || "Failed to load batches");
  }
  return res.data || [];
}

const BatchSchedulesPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const { items: savedSchedules, loading, error, successMessage } = useAppSelector(
    (state) => state.batchSchedules
  );

  const staffList = useAppSelector((state) => state.staff.dropdownStaff);
  const classRooms = useAppSelector(
    (state) => state.classRooms.classRooms
  ) as ClassRoom[];

  const trainers = staffList; // no filter

  // -------- Local state --------
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<number | "">("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");

  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [trainerId, setTrainerId] = useState<number | "">("");
  const [selectedClassRoomId, setSelectedClassRoomId] = useState<number | "">("");

  const [batchDurationInHr, setBatchDurationInHr] = useState<number>(1);

  const [generatedItems, setGeneratedItems] = useState<CreateBatchScheduleModel[]>(
    []
  );
  const [localError, setLocalError] = useState<string | null>(null);

  // -------- Load batches once --------
  useEffect(() => {
    (async () => {
      try {
        const list = await fetchBatchesApi();
        setBatches(list);
      } catch (err: any) {
        setLocalError(err.message || "Failed to load batches");
      }
    })();
  }, []);

  // -------- Load staff + classrooms once --------
  useEffect(() => {
    dispatch(fetchAllStaff());
    dispatch(fetchClassRooms());
  }, [dispatch]);

  // -------- Load schedules when batch changes --------
  useEffect(() => {
    if (selectedBatchId) {
      dispatch(fetchBatchSchedules(Number(selectedBatchId)));
    }
  }, [selectedBatchId, dispatch]);

  // Toggle weekdays
  const handleToggleDay = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // ========== Handle Batch Change (prefill classroom + duration) ==========
  const handleBatchChange = (value: string) => {
    const batchId = value ? Number(value) : "";
    setSelectedBatchId(batchId);

    if (!batchId) {
      // reset
      setSelectedClassRoomId("");
      setBatchDurationInHr(1);
      return;
    }

    const found = batches.find((b) => b.batchId === batchId);
    if (found) {
      // default from batch but editable (Option C)
      setSelectedClassRoomId(
        found.classRoomId != null ? found.classRoomId : ""
      );
      setBatchDurationInHr(
        typeof found.batchDurationInHr === "number" && !isNaN(found.batchDurationInHr)
          ? found.batchDurationInHr
          : 1
      );

      setTrainerId(
      found.trainerId != null ? Number(found.trainerId) : ""
    );
    }
  };

  // ========== Generate Schedule (safe date loop) ==========
  const handleGenerate = () => {
    setLocalError(null);
    dispatch(clearMessages());

    if (!selectedBatchId || !startDate || !endDate || !startTime) {
      setLocalError("Please fill Batch, Start Date, End Date and Start Time");
      return;
    }

    if (batchDurationInHr <= 0) {
      setLocalError("Batch duration must be greater than 0 hours");
      return;
    }

    if (selectedDays.length === 0) {
      setLocalError("Please select at least one working day");
      return;
    }

    const start = new Date(startDate + "T00:00:00");
    const end = new Date(endDate + "T00:00:00");

    if (start > end) {
      setLocalError("Start Date cannot be greater than End Date");
      return;
    }

    let currentDate = new Date(start);
    const items: CreateBatchScheduleModel[] = [];

    while (currentDate <= end) {
      const dow = currentDate.getDay();
      if (selectedDays.includes(dow)) {
        const dateStr = currentDate.toISOString().split("T")[0];

        items.push({
          expectedDateTime: combineDateTime(dateStr, startTime),
          expectedTrainerId:
            typeof trainerId === "number" ? trainerId : undefined,
          classRoomId:
            typeof selectedClassRoomId === "number"
              ? selectedClassRoomId
              : undefined,
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (items.length === 0) {
      setLocalError("No schedule generated — adjust days or date range.");
      return;
    }

    setGeneratedItems(items);
  };

  // ========== Save Bulk ==========
  const handleConfirm = async () => {
    setLocalError(null);
    dispatch(clearMessages());

    if (!selectedBatchId || generatedItems.length === 0) {
      setLocalError("Nothing to save. Generate schedule first.");
      return;
    }

    try {
      await dispatch(
        createBulkSchedules({
          batchId: Number(selectedBatchId),
          items: generatedItems,
        })
      ).unwrap();

      dispatch(fetchBatchSchedules(Number(selectedBatchId)));

      setGeneratedItems([]);

    } catch (err: any) {
      setLocalError(err || "Bulk creation failed");
    }
  };

  // ========== Re-Schedule Example ==========
  const handleRescheduleExample = async (index: number) => {
    if (!selectedBatchId) {
      setLocalError("Select batch first");
      return;
    }

    const item = generatedItems[index];

    try {
      setLocalError(null);
      dispatch(clearMessages());

      await dispatch(
        createSingleSchedule({
          batchId: Number(selectedBatchId),
          item,
        })
      ).unwrap();

      dispatch(fetchBatchSchedules(Number(selectedBatchId)));
    } catch (err: any) {
      setLocalError(err || "Re-Schedule failed");
    }
  };

  // ========== Utility: compute end time string from start & duration ==========
  const getEndTimeFromStart = (timeStr: string): string => {
    if (!timeStr || !timeStr.includes(":") || batchDurationInHr <= 0) return "";

    const [hStr, mStr] = timeStr.split(":");
    const h = Number(hStr) || 0;
    const m = Number(mStr) || 0;

    const totalMinutes = h * 60 + m + batchDurationInHr * 60;
    const endH = Math.floor(totalMinutes / 60) % 24;
    const endM = totalMinutes % 60;

    return `${endH.toString().padStart(2, "0")}:${endM
      .toString()
      .padStart(2, "0")}`;
  };

  // ========== UI ==========

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Create Batch Schedule
      </Typography>

      {/* ---------- Form Section ---------- */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          {/* Batch */}
          <Grid size={{xs:12, md:4}}>
            <TextField
              select
              fullWidth
              size="small"
              label="Batch"
              value={selectedBatchId}
              onChange={(e) => handleBatchChange(e.target.value)}
            >
              <MenuItem value="">Select Batch</MenuItem>
              {batches.map((b) => (
                <MenuItem key={b.batchId} value={b.batchId}>
                  {b.batchCode}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Start Date */}
          <Grid size={{xs:12, md:4}}>
            <TextField
              type="date"
              fullWidth
              size="small"
              label="Start Date"
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Grid>

          {/* End Date */}
          <Grid size={{xs:12, md:4}}>
            <TextField
              type="date"
              fullWidth
              size="small"
              label="End Date"
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Grid>

          {/* Start Time */}
          <Grid size={{xs:12, md:4}}>
            <TextField
              type="time"
              fullWidth
              size="small"
              label="Batch Start Time"
              InputLabelProps={{ shrink: true }}
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </Grid>

          {/* Batch Duration in Hours */}
          <Grid size={{xs:12, md:4}}>
            <TextField
              type="number"
              fullWidth
              size="small"
              label="Batch Duration (hours)"
              inputProps={{ min: 0.5, step: 0.5 }}
              value={batchDurationInHr}
              onChange={(e) => {
                const v = Number(e.target.value);
                setBatchDurationInHr(isNaN(v) ? 0 : v);
              }}
            />
          </Grid>

          {/* Classroom Dropdown */}
          <Grid size={{xs:12, md:4}}>
            <TextField
              select
              fullWidth
              size="small"
              label="Classroom"
              value={selectedClassRoomId}
              onChange={(e) =>
                setSelectedClassRoomId(
                  e.target.value ? Number(e.target.value) : ""
                )
              }
            >
              <MenuItem value="">Select Classroom</MenuItem>
              {classRooms.map((c) => (
                <MenuItem key={c.classRoomId} value={c.classRoomId}>
                  {c.classRoomName}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Trainer Dropdown */}
          <Grid size={{xs:12, md:4}}>
            <TextField
              select
              fullWidth
              size="small"
              label="Trainer"
              value={trainerId}
              onChange={(e) =>
                setTrainerId(e.target.value ? Number(e.target.value) : "")
              }
            >
              <MenuItem value="">Select Trainer</MenuItem>
              {trainers.map((t) => (
                <MenuItem key={t.staffId} value={t.staffId}>
                  {t.firstName} {t.lastName}{" "}
                  {t.position ? `(${t.position})` : ""}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Select Days */}
          <Grid size={{xs:12, md:8}}
          sx={{ backgroundColor: "#f5f5f5", p: 2, borderRadius: 1 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Select Days
            </Typography>
            <FormGroup row>
              {weekDaysOptions.map((d) => (
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
          <Grid size={{xs:12}}>
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" onClick={handleGenerate}>
                Generate Schedule
              </Button>
              <Button
                variant="contained"
                onClick={handleConfirm}
                disabled={loading || generatedItems.length === 0}
              >
                {loading ? "Saving..." : "Confirm & Save"}
              </Button>
            </Stack>
          </Grid>
        </Grid>

        {/* Messages */}
        <Box mt={2}>
          {localError && (
            <Alert severity="error" sx={{ mb: 1 }}>
              {localError}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 1 }}>
              {error}
            </Alert>
          )}
          {successMessage && (
            <Alert severity="success" sx={{ mb: 1 }}>
              {successMessage}
            </Alert>
          )}
        </Box>
      </Paper>

      {/* ---------- Preview Generated Schedule ---------- */}
      {generatedItems.length > 0 && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Generated Schedule (Preview)
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time (Start - End)</TableCell>
                <TableCell>Trainer</TableCell>
                <TableCell>Classroom</TableCell>
                {/* <TableCell>Re-Schedule</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {generatedItems.map((item, index) => {
                let datePart = "";
                let timeStart = "";

                if (item.expectedDateTime?.includes("T")) {
                  const [d, t] = item.expectedDateTime.split("T");
                  datePart = d;
                  timeStart = t?.slice(0, 5) || "";
                }

                const timeEnd = getEndTimeFromStart(timeStart);
                const trainerIdNum =
                typeof item.expectedTrainerId === "number"
                    ? item.expectedTrainerId
                    : Number(item.expectedTrainerId);

                const trainer = trainers.find((t) => Number(t.staffId) === trainerIdNum);

                const trainerName = trainer ? `${trainer.firstName} ${trainer.lastName}` : "-";

                const classRoomName =
                  classRooms.find((c) => c.classRoomId === item.classRoomId)
                    ?.classRoomName ?? "-";

                return (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{datePart}</TableCell>
                    <TableCell>
                      {timeStart}
                      {timeEnd ? ` - ${timeEnd}` : ""}
                    </TableCell>
                    <TableCell>{trainerName}</TableCell>
                    <TableCell>{classRoomName}</TableCell>
                    {/* <TableCell>
                      <Button
                        size="small"
                        variant="text"
                        onClick={() => handleRescheduleExample(index)}
                        disabled={loading || !selectedBatchId}
                      >
                        Re-Schedule
                      </Button>
                    </TableCell> */}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* ---------- Saved Schedules ---------- */}
      {selectedBatchId && savedSchedules.length > 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Saved Schedules (from API)
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>DateTime</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Trainer</TableCell>
                <TableCell>Classroom</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {savedSchedules.map((s, idx) => {
                const classRoomName =
                  classRooms.find((c) => c.classRoomId === s.classRoomId)
                    ?.classRoomName ?? "-";

                            // Trainer name lookup
                const trainer = trainers.find(
                  (t) => Number(t.staffId) === Number(s.expectedTrainerId)
                );

                const trainerName = trainer
                  ? `${trainer.firstName} ${trainer.lastName}`
                  : "-";


                return (
                  <TableRow key={s.batchScheduleId}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{formatScheduleDate(s.expectedDateTime)}</TableCell>
                    <TableCell>{s.status}</TableCell>
                    <TableCell>{trainerName}</TableCell>
                    <TableCell>{classRoomName}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Container>
  );
};

export default BatchSchedulesPage;
