"use client";

import React from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel,
  Stack,
} from "@mui/material";

import { Save, Cancel } from "@mui/icons-material";
import Link from "next/link";

import { useCreateBatchStudyWorkViewModel } from "@/lib/features/BatchStudyWorks/useCreateBatchStudyWorkViewModel";
import { useStaffViewModel } from "@/lib/features/staff/useStaffViewModel";
import { useBatchViewModel } from "@/lib/features/batch/useBatchViewModel";

export default function CreateBatchStudyWork() {
  const { isLoading, error, handleSubmit } = useCreateBatchStudyWorkViewModel();

  const { staff, isLoading: staffLoading } = useStaffViewModel();

  // IMPORTANT FIX: include refetch and call it once
  const { batches, isLoading: batchLoading, refetch } = useBatchViewModel();
  console.log("BATCHES FROM HOOK =", batches);
  // 🔥 FIX: Load batches when page opens
  React.useEffect(() => {
    refetch();
  }, []);

  const [formData, setFormData] = React.useState({
    workType: "",
    assignedBy: null as number | null,
    batchId: null as number | null,
    workTitle: "",
    workDescription: "",
    expectedCompletionDate: "",
    isActive: true,
  });

  const toNullableNumber = (val: unknown) => {
    const str = String(val ?? "");
    return str === "" ? null : Number(str);
  };

  const update = (field: string, value: any) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  return (
    <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Create Batch Study Work
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0" }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(formData);
          }}
        >
          <Stack spacing={3}>
            <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
              Work Information
            </Typography>

            {/* WORK TITLE */}
            <TextField
              label="Work Title *"
              fullWidth
              size="small"
              required
              value={formData.workTitle}
              onChange={(e) => update("workTitle", e.target.value)}
              disabled={isLoading}
            />

            {/* WORK TYPE */}
            <FormControl fullWidth size="small">
              <InputLabel>Work Type *</InputLabel>
              <Select
                label="Work Type *"
                required
                value={formData.workType}
                onChange={(e) => update("workType", e.target.value)}
                disabled={isLoading}
              >
                <MenuItem value="">
                  <em>Select Type</em>
                </MenuItem>
                <MenuItem value="classwork">Classwork</MenuItem>
                <MenuItem value="homework">Homework</MenuItem>
              </Select>
            </FormControl>

            {/* STAFF */}
            {/* <FormControl fullWidth size="small" disabled={staffLoading}>
              <InputLabel>Assigned By (Staff)</InputLabel>
              <Select
                label="Assigned By (Staff)"
                value={formData.assignedBy ?? ""}
                onChange={(e) =>
                  update("assignedBy", toNullableNumber(e.target.value))
                }
                endAdornment={
                  staffLoading ? (
                    <Box sx={{ display: "flex", pr: 2 }}>
                      <CircularProgress size={20} />
                    </Box>
                  ) : null
                }
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>

                {staff.map((s) => (
                  <MenuItem key={s.staffId} value={s.staffId}>
                    {s.firstName} {s.lastName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}

            {/* BATCH */}
            <FormControl fullWidth size="small" disabled={batchLoading}>
              <InputLabel>Batch *</InputLabel>
              <Select
                label="Batch *"
                required
                value={formData.batchId ?? ""}
                onChange={(e) =>
                  update("batchId", toNullableNumber(e.target.value))
                }
              >
                <MenuItem value="">
                  <em>Select Batch</em>
                </MenuItem>

                {batches.map((b) => (
                  <MenuItem key={b.batchId} value={b.batchId}>
                    {b.batchCode}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* DATE */}
            <TextField
              fullWidth
              label="Expected Completion Date"
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={formData.expectedCompletionDate}
              onChange={(e) => update("expectedCompletionDate", e.target.value)}
              disabled={isLoading}
            />

            {/* DESCRIPTION */}
            <TextField
              fullWidth
              multiline
              minRows={3}
              size="small"
              label="Work Description"
              value={formData.workDescription}
              onChange={(e) => update("workDescription", e.target.value)}
              disabled={isLoading}
            />

            {/* ACTIVE STATUS */}
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) => update("isActive", e.target.checked)}
                />
              }
              label="Active"
            />

            {/* ACTION BUTTONS */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Link href="/BatchStudyWorks" passHref>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<Cancel />}
                  size="small"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </Link>

              <Button
                type="submit"
                variant="contained"
                startIcon={<Save />}
                size="small"
                disabled={
                  isLoading ||
                  !formData.workTitle ||
                  !formData.workType ||
                  !formData.batchId
                }
              >
                {isLoading ? "Creating..." : "Create Work"}
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
