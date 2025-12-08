"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Box,
  Paper,
  Divider,
  Stack,
  Skeleton,
  Alert,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@mui/material";

import Link from "next/link";
import {
  ArrowBack,
  Edit,
  CalendarMonth,
  AccessTime,
  School,
  Person,
  Apartment,
  Home,
  Class
} from "@mui/icons-material";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";

// Thunks
import { fetchBatchById } from "@/lib/features/batch/batchThunks";
import { fetchBatchSchedules } from "@/lib/features/batchSchedules/batchScheduleThunks";
import { fetchAllStaff } from "@/lib/features/staff/staffThunks";
import { fetchClassRooms } from "@/lib/features/classRoom/classRoomThunks";

export default function BatchDetailsPage() {
  const { id } = useParams();
  const batchId = Number(id);

  const dispatch = useAppDispatch();

  const staffList = useAppSelector((state) => state.staff.dropdownStaff);
  const classRooms = useAppSelector((state) => state.classRooms.classRooms);
  const savedSchedules = useAppSelector((state) => state.batchSchedules.items);

  const { currentBatch, loading, error } = useAppSelector(
    (state) => state.batches
  );

  // Fetch all required data
  useEffect(() => {
    dispatch(fetchBatchById(batchId));
    dispatch(fetchBatchSchedules(batchId));

    // REQUIRED for trainer + classroom names
    dispatch(fetchAllStaff());
    dispatch(fetchClassRooms());
  }, [batchId]);

  // Helpers
  const formatDate = (date: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const formatTime = (time: string | null) => {
    if (!time) return "-";
    return time.slice(0, 5);
  };
  
  const formatScheduleDate = (dateString: string) => {
    const d = new Date(dateString);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayName = days[d.getDay()];

    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();

    return `[${dayName}] ${dd}-${mm}-${yyyy}`;
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <Skeleton variant="rectangular" width="100%" height={400} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load batch details.
        </Alert>
        <Link href="/batches">
          <Button startIcon={<ArrowBack />} variant="outlined">
            Back to Batches
          </Button>
        </Link>
      </Container>
    );
  }

  if (!currentBatch) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Batch not found.
        </Alert>
        <Link href="/batches">
          <Button startIcon={<ArrowBack />} variant="outlined">
            Back to Batches
          </Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* HEADER */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Link href="/batches" passHref>
            <Button startIcon={<ArrowBack />} variant="outlined" size="small">
              Back
            </Button>
          </Link>

          <Typography variant="h4">Batch Details</Typography>
        </Box>

        <Chip
          label={currentBatch.isActive ? "Active" : "Inactive"}
          color={currentBatch.isActive ? "success" : "error"}
        />
      </Box>

      <Grid container spacing={3}>
        {/* LEFT PANEL */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, textAlign: "center" }} elevation={2}>
            <Box
              sx={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                bgcolor: "primary.main",
                color: "#fff",
                mx: "auto",
                mb: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem"
              }}
            >
              {currentBatch.batchCode.slice(0, 2)}
            </Box>

            <Typography variant="h5" gutterBottom>
              {currentBatch.batchCode}
            </Typography>

            <Typography variant="body1" color="text.secondary">
              {currentBatch.courseName}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Stack spacing={1} alignItems="flex-start">
              <Box sx={{ display: "flex", gap: 1 }}>
                <Apartment fontSize="small" />
                <Typography variant="body2">
                  {currentBatch.branchName} ({currentBatch.branchCode})
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <School fontSize="small" />
                <Typography variant="body2">{currentBatch.moduleName}</Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Person fontSize="small" />
                <Typography variant="body2">
                  Trainer ID: {currentBatch.trainerId}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Home fontSize="small" />
                <Typography variant="body2">
                  {currentBatch.classRoomName}
                </Typography>
              </Box>
            </Stack>

            <Box sx={{ mt: 3 }}>
              <Link href={`/batches/${currentBatch.batchId}/edit`} passHref>
                <Button variant="contained" startIcon={<Edit />} fullWidth>
                  Edit Batch
                </Button>
              </Link>
            </Box>
          </Paper>
        </Grid>

        {/* RIGHT PANEL */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Schedule Information
              </Typography>

              {/* Schedule Info */}
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                    <CalendarMonth fontSize="small" />
                    <Typography variant="subtitle2">Start Date</Typography>
                  </Box>
                  <Typography>{formatDate(currentBatch.startDate)}</Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                    <CalendarMonth fontSize="small" />
                    <Typography variant="subtitle2">End Date</Typography>
                  </Box>
                  <Typography>{formatDate(currentBatch.endDate)}</Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                    <AccessTime fontSize="small" />
                    <Typography variant="subtitle2">Start Time</Typography>
                  </Box>
                  <Typography>{formatTime(currentBatch.startTime)}</Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                    <Class fontSize="small" />
                    <Typography variant="subtitle2">Duration</Typography>
                  </Box>
                  <Typography>{currentBatch.batchDurationInHr} hours</Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" sx={{ mb: 3 }}>
                System Information
              </Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Batch ID
                  </Typography>
                  <Typography>{currentBatch.batchId}</Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Created At
                  </Typography>
                  <Typography>{formatDate(currentBatch.createdAt)}</Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Last Updated
                  </Typography>
                  <Typography>
                    {currentBatch.updatedAt
                      ? formatDate(currentBatch.updatedAt)
                      : "Never"}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ---------- SAVED SCHEDULES SECTION ---------- */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Saved Schedules
        </Typography>

        {savedSchedules.length === 0 ? (
          <Alert severity="info">No schedules found for this batch.</Alert>
        ) : (
          <Paper sx={{ p: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Trainer</TableCell>
                  <TableCell>Classroom</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {savedSchedules.map((s, idx) => {
                  const d = new Date(s.expectedDateTime);
                  const dateStr = d.toLocaleDateString("en-GB");
                  const timeStr = d.toTimeString().slice(0, 5);

                  const trainer =
                    staffList.find(
                      (t) => Number(t.staffId) === Number(s.expectedTrainerId)
                    ) || null;

                  const trainerName = trainer
                    ? `${trainer.firstName} ${trainer.lastName}`
                    : "-";

                  const classRoomName =
                    classRooms.find((c) => c.classRoomId === s.classRoomId)
                      ?.classRoomName ?? "-";

                  return (
                    <TableRow key={s.batchScheduleId}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{formatScheduleDate(s.expectedDateTime)}</TableCell>
                      <TableCell>{timeStr}</TableCell>
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
      </Box>
    </Container>
  );
}
