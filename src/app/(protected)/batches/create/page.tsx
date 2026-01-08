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
import { useState, useEffect } from "react";
import api from "@/lib/services/apiService";
import API_ENDPOINTS from "@/lib/config/apiConfig";
import { useRouter } from "next/navigation";
import { useCreateBatch } from "@/lib/features/batch/useCreateBatch";
import Swal from "sweetalert2";

export default function CreateBatchPage() {
  const router = useRouter();
  const { handleCreateBatch } = useCreateBatch();

  const [branches, setBranches] = useState([]);
  const [modules, setModules] = useState([]);
  const [classRooms, setClassRooms] = useState([]);
  const [trainers, setTrainers] = useState([]);

  const [form, setForm] = useState({
    batchCode: "",
    branchId: "",
    moduleId: "",
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

  // Load dropdown data
  const loadDropdowns = async () => {
    const b = await api.get(API_ENDPOINTS.BRANCHES.GET_LIST);
    const m = await api.get(API_ENDPOINTS.MODULES.GET_LIST);
    const cr = await api.get(API_ENDPOINTS.CLASS_ROOMS.GET_LIST);
    const t = await api.get(API_ENDPOINTS.STAFF.GET_LIST);

    setBranches(b.data ?? []);
    setModules(m.data ?? []);
    setClassRooms(cr.data ?? []);
    setTrainers(t.data ?? []);
  };

  useEffect(() => {
    loadDropdowns();
  }, []);

const handleSubmit = async (e: any) => {
  e.preventDefault();

  const dto = {
    BatchCode: form.batchCode,
    BranchId: form.branchId ? Number(form.branchId) : null,
    ModuleId: Number(form.moduleId),
    TrainerId: Number(form.trainerId),
    ClassRoomId: Number(form.classRoomId),

    StartDate: form.startDate || null,
    ActualStartDate: form.actualStartDate || null,
    EndDate: form.endDate || null,
    ActualEndDate: form.actualEndDate || null,

    StartTime: form.startTime ? form.startTime + ":00" : null, 
    BatchDurationInHr: Number(form.batchDurationInHr),
    IsActive: form.isActive,
  };

  const ok = await handleCreateBatch(dto);

  if (ok) {
    Swal.fire({
      icon: "success",
      title: "Batch created successfully!",
      showConfirmButton: false,
      timer: 500,
    });

    setTimeout(() => {
      router.push("/batches");
    }, 500);
  }
};

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" mb={3}>
          Create Batch
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "grid", gap: 2 }}
        >
          {/* Batch Code */}
          <TextField
            label="Batch Code"
            name="batchCode"
            value={form.batchCode}
            onChange={handleChange}
            required
          />

          {/*            
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
          */}

          {/* Course Module */}
          <TextField
            select
            label="Module"
            name="moduleId"
            value={form.moduleId}
            onChange={handleChange}
            required
          >
            {modules.map((m: any) => (
              <MenuItem key={m.moduleId} value={m.moduleId}>
                {m.moduleName}
              </MenuItem>
            ))}
          </TextField>

          {/* Trainer */}
          <TextField
            select
            label="Trainer"
            name="trainerId"
            value={form.trainerId}
            onChange={handleChange}
            required
          >
            {trainers.map((t: any) => (
              <MenuItem key={t.staffId} value={t.staffId}>
                {t.firstName} {t.lastName}
              </MenuItem>
            ))}
          </TextField>

          {/* Class Room */}
          <TextField
            select
            label="Class Room"
            name="classRoomId"
            value={form.classRoomId}
            onChange={handleChange}
            required
          >
            {classRooms.map((c: any) => (
              <MenuItem key={c.classRoomId} value={c.classRoomId}>
                {c.classRoomName}
              </MenuItem>
            ))}
          </TextField>

          {/* Dates */}
          {/* <TextField
            type="date"
            label="Start Date"
            name="startDate"
            InputLabelProps={{ shrink: true }}
            value={form.startDate}
            onChange={handleChange}
          /> */}

          {/* <TextField
            type="date"
            label="End Date"
            name="endDate"
            InputLabelProps={{ shrink: true }}
            value={form.endDate}
            onChange={handleChange}
          /> */}

          {/* <TextField
            type="date"
            label="Actual Start Date"
            name="actualStartDate"
            InputLabelProps={{ shrink: true }}
            value={form.actualStartDate}
            onChange={handleChange}
          />
 */}
          {/* <TextField
            type="date"
            label="Actual End Date"
            name="actualEndDate"
            InputLabelProps={{ shrink: true }}
            value={form.actualEndDate}
            onChange={handleChange}
          /> */}

          {/* Time */}
          <TextField
            type="time"
            label="Start Time"
            name="startTime"
            InputLabelProps={{ shrink: true }}
            value={form.startTime}
            onChange={handleChange}
          />

          {/* Duration */}
          {/* <TextField
            type="number"
            label="Duration (hours)"
            name="batchDurationInHr"
            value={form.batchDurationInHr}
            onChange={handleChange}
          /> */}

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

          {/* Submit */}
          <Button type="submit" variant="contained">
            Create Batch
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
