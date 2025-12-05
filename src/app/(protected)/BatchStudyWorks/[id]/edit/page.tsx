"use client";

import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

import { fetchBatchStudyWorkById } from "@/lib/features/BatchStudyWorks/batchStudyWorkThunk";
import { useUpdateBatchStudyWork } from "@/lib/features/BatchStudyWorks/useUpdateBatchStudyWorkViewModel";
import { useBatchViewModel } from "@/lib/features/batch/useBatchViewModel";
import { useStaffViewModel } from "@/lib/features/staff/useStaffViewModel";

export default function EditBatchStudyWorkPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const dispatch = useAppDispatch();

  // 🔥 Correct property from slice
  const { current } = useAppSelector((state) => state.batchStudyWorks);

  const { batches } = useBatchViewModel();
  const { staff } = useStaffViewModel();
  const { handleUpdateBatchStudyWork } = useUpdateBatchStudyWork();

  // -----------------------------------
  // Form State
  // -----------------------------------
  const [form, setForm] = useState({
    workType: "",
    workTitle: "",
    workDescription: "",
    assignedBy: "",
    batchId: "",
    expectedCompletionDate: "",
    isActive: true,
  });

  // -----------------------------------
  // Load Work by ID
  // -----------------------------------
  useEffect(() => {
    dispatch(fetchBatchStudyWorkById(id));
  }, [id]);

  // -----------------------------------
  // Prefill When Loaded
  // -----------------------------------
  useEffect(() => {
    if (current) {
      setForm({
        workType: current.workType,
        workTitle: current.workTitle,
        workDescription: current.workDescription || "",
        assignedBy: current.assignedBy ? String(current.assignedBy) : "",
        batchId: current.batchId ? String(current.batchId) : "",
        expectedCompletionDate:
          current.expectedCompletionDate?.slice(0, 10) || "",
        isActive: current.isActive,
      });
    }
  }, [current]);

  // -----------------------------------
  // Handle Input Change
  // -----------------------------------
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // -----------------------------------
  // Submit Update
  // -----------------------------------
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const dto = {
      workType: form.workType,
      workTitle: form.workTitle,
      workDescription: form.workDescription || null,
      assignedBy: form.assignedBy ? Number(form.assignedBy) : null,
      batchId: form.batchId ? Number(form.batchId) : null,
      expectedCompletionDate: form.expectedCompletionDate || null,
      isActive: form.isActive,
    };

    const ok = await handleUpdateBatchStudyWork(id, dto);

    if (ok) {
      router.push("/BatchStudyWorks");
    }
  };

  // -----------------------------------
  // UI
  // -----------------------------------
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" mb={3}>
          Edit Batch Study Work
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* Work Title */}
          <TextField
            label="Work Title *"
            name="workTitle"
            required
            value={form.workTitle}
            onChange={handleChange}
          />

          {/* Work Type */}
          <FormControl>
            <InputLabel>Work Type *</InputLabel>
            <Select
              label="Work Type *"
              name="workType"
              required
              value={form.workType}
              onChange={handleChange}
            >
              <MenuItem value="classwork">Classwork</MenuItem>
              <MenuItem value="homework">Homework</MenuItem>
            </Select>
          </FormControl>

          {/* Assigned By */}
          <FormControl>
            <InputLabel>Assigned By (Staff)</InputLabel>
            <Select
              label="Assigned By"
              name="assignedBy"
              value={form.assignedBy}
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {staff.map((s: any) => (
                <MenuItem key={s.staffId} value={s.staffId}>
                  {s.firstName} {s.lastName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Batch */}
          <FormControl>
            <InputLabel>Batch *</InputLabel>
            <Select
              label="Batch *"
              name="batchId"
              required
              value={form.batchId}
              onChange={handleChange}
            >
              {batches.map((b: any) => (
                <MenuItem key={b.batchId} value={b.batchId}>
                  {b.batchCode}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Expected Completion Date */}
          <TextField
            type="date"
            name="expectedCompletionDate"
            label="Expected Completion Date"
            InputLabelProps={{ shrink: true }}
            value={form.expectedCompletionDate}
            onChange={handleChange}
          />

          {/* Description */}
          <TextField
            label="Work Description"
            name="workDescription"
            multiline
            minRows={3}
            value={form.workDescription}
            onChange={handleChange}
          />

          {/* Active Switch */}
          <FormControlLabel
            control={
              <Switch
                checked={form.isActive}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, isActive: e.target.checked }))
                }
              />
            }
            label={form.isActive ? "Active" : "Inactive"}
          />

          <Button variant="contained" type="submit">
            Update Work
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
