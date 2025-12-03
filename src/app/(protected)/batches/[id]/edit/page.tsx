"use client";

import {
  Box,
  Button,
  Container,
  FormControlLabel,
  MenuItem,
  Paper,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/services/apiService";
import API_ENDPOINTS from "@/lib/config/apiConfig";
import { useUpdateBatch } from "@/lib/features/batch/useUpdateBatch";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchBatchById } from "@/lib/features/batch/batchThunks";

export default function EditBatchPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const dispatch = useAppDispatch();
  const { currentBatch } = useAppSelector((state) => state.batches);
  const { handleUpdateBatch } = useUpdateBatch();

  const [branches, setBranches] = useState([]);
  const [courseModules, setCourseModules] = useState([]);
  const [classRooms, setClassRooms] = useState([]);
  const [trainers, setTrainers] = useState([]);

  const [form, setForm] = useState({
    batchCode: "",
    branchId: "",
    courseModuleId: "",
    trainerId: "",
    classRoomId: "",
    startDate: "",
    actualStartDate: "",
    endDate: "",
    actualEndDate: "",
    startTime: "",
    batchDurationInHr: 1,
    isActive: true,
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const loadDropdowns = async () => {
    const b = await api.get(API_ENDPOINTS.BRANCHES.GET_LIST);
    const cm = await api.get(API_ENDPOINTS.COURSE_MODULES.GET_LIST);
    const cr = await api.get(API_ENDPOINTS.CLASS_ROOMS.GET_LIST);
    const t = await api.get(API_ENDPOINTS.STAFF.GET_LIST);

    setBranches(b.data ?? []);
    setCourseModules(cm.data ?? []);
    setClassRooms(cr.data ?? []);
    setTrainers(t.data ?? []);
  };

  useEffect(() => {
    dispatch(fetchBatchById(id));
    loadDropdowns();
  }, [id]);

  useEffect(() => {
    if (currentBatch) {
      setForm({
        batchCode: currentBatch.batchCode,

        branchId: currentBatch.branchId ? String(currentBatch.branchId) : "",
        courseModuleId: currentBatch.courseModuleId
          ? String(currentBatch.courseModuleId)
          : "",
        trainerId: currentBatch.trainerId ? String(currentBatch.trainerId) : "",
        classRoomId: currentBatch.classRoomId
          ? String(currentBatch.classRoomId)
          : "",

        startDate: currentBatch.startDate?.slice(0, 10) ?? "",
        actualStartDate: currentBatch.actualStartDate?.slice(0, 10) ?? "",
        endDate: currentBatch.endDate?.slice(0, 10) ?? "",
        actualEndDate: currentBatch.actualEndDate?.slice(0, 10) ?? "",

        startTime: currentBatch.startTime?.slice(0, 5) ?? "",

        batchDurationInHr: currentBatch.batchDurationInHr ?? 1,
        isActive: currentBatch.isActive,
      });
    }
  }, [currentBatch]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const dto = {
      batchCode: form.batchCode,

      branchId: form.branchId ? Number(form.branchId) : null, // ✔ FIXED
      courseModuleId: Number(form.courseModuleId),
      trainerId: Number(form.trainerId),
      classRoomId: Number(form.classRoomId),

      startDate: form.startDate || null,
      actualStartDate: form.actualStartDate || null,
      endDate: form.endDate || null,
      actualEndDate: form.actualEndDate || null,

      startTime: form.startTime ? form.startTime + ":00" : null, // ✔ FIXED
      batchDurationInHr: Number(form.batchDurationInHr),
      isActive: form.isActive,
    };

    const ok = await handleUpdateBatch(id, dto);

    if (ok) {
      router.push("/batches");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" mb={3}>
          Edit Batch
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
          
          <TextField
            label="Batch Code"
            name="batchCode"
            value={form.batchCode}
            onChange={handleChange}
            required
          />

          {/* Branch optional */}
          <TextField
            select
            label="Branch (optional)"
            name="branchId"
            value={form.branchId}
            onChange={handleChange}
          >
            <MenuItem value="">None</MenuItem>
            {branches.map((b: any) => (
              <MenuItem key={b.branchId} value={b.branchId}>
                {b.branchName}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Course Module"
            name="courseModuleId"
            value={form.courseModuleId}
            onChange={handleChange}
          >
            {courseModules.map((m: any) => (
              <MenuItem key={m.courseModuleId} value={m.courseModuleId}>
                {m.courseName} — {m.moduleName}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Trainer"
            name="trainerId"
            value={form.trainerId}
            onChange={handleChange}
          >
            {trainers.map((t: any) => (
              <MenuItem key={t.staffId} value={t.staffId}>
                {t.firstName} {t.lastName}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Class Room"
            name="classRoomId"
            value={form.classRoomId}
            onChange={handleChange}
          >
            {classRooms.map((c: any) => (
              <MenuItem key={c.classRoomId} value={c.classRoomId}>
                {c.classRoomName}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            type="date"
            name="startDate"
            label="Start Date"
            InputLabelProps={{ shrink: true }}
            value={form.startDate}
            onChange={handleChange}
          />

          <TextField
            type="date"
            name="endDate"
            label="End Date"
            InputLabelProps={{ shrink: true }}
            value={form.endDate}
            onChange={handleChange}
          />

          <TextField
            type="date"
            name="actualStartDate"
            label="Actual Start Date"
            InputLabelProps={{ shrink: true }}
            value={form.actualStartDate}
            onChange={handleChange}
          />

          <TextField
            type="date"
            name="actualEndDate"
            label="Actual End Date"
            InputLabelProps={{ shrink: true }}
            value={form.actualEndDate}
            onChange={handleChange}
          />

          <TextField
            type="time"
            name="startTime"
            label="Start Time"
            InputLabelProps={{ shrink: true }}
            value={form.startTime}
            onChange={handleChange}
          />

          <TextField
            type="number"
            name="batchDurationInHr"
            label="Duration (hours)"
            value={form.batchDurationInHr}
            onChange={handleChange}
          />

          <FormControlLabel
            control={
              <Switch
                checked={form.isActive}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, isActive: e.target.checked }))
                }
                color="primary"
              />
            }
            label={form.isActive ? "Active" : "Inactive"}
          />

          <Button variant="contained" type="submit">
            Update Batch
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
