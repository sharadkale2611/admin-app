"use client";

import React, { useEffect, useState } from "react";
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
  Grid,
  Alert,
  Snackbar,
  CircularProgress,
  FormControlLabel,
  Switch,
} from "@mui/material";

import { Save, Cancel } from "@mui/icons-material";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import useEditStudentBatchAssignmentViewModel from "@/lib/features/studentBatchAssignment/useEditStudentBatchAssignmentViewModel";
import api from "@/lib/services/apiService";

export default function EditStudentBatchAssignmentPage() {
  const params = useParams();
  const router = useRouter();
  const idParam = params?.id;
  const id = Number(idParam);

  const {
    formData,
    isLoadingAssignment,
    isSubmitting,
    error,
    clearError,
    loadAssignment,
    handleChange,
    handleSelectChange,
    handleNumberChange,
    handleBooleanChange,
    handleSubmit,
  } = useEditStudentBatchAssignmentViewModel();

  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<"success" | "error">("success");

  const handleSnackbarClose = () => setSnackbarOpen(false);

  // -------------------------------
  // Load dropdown data (Enrollments + Batches)
  // -------------------------------
  useEffect(() => {
    async function loadDropdowns() {
      try {
        const [enrollmentRes, batchRes] = await Promise.all([
          api.get("/Enrollments"),
          api.get("/Batches"),
        ]);

        // If your API returns { success, data }, adjust here:
        const enrollData = (enrollmentRes.data?.data ?? enrollmentRes.data) || [];
        const batchData = (batchRes.data?.data ?? batchRes.data) || [];

        setEnrollments(enrollData);
        setBatches(batchData);
      } catch (err) {
        console.error("Dropdown load failed:", err);
      } finally {
        setLoadingDropdowns(false);
      }
    }

    loadDropdowns();
  }, []);

  // -------------------------------
  // Load existing assignment by ID
  // -------------------------------
  useEffect(() => {
    if (!id || Number.isNaN(id)) return;
    loadAssignment(id);
  }, [id, loadAssignment]);

  // -------------------------------
  // Submit handler
  // -------------------------------
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const result = await handleSubmit();

    if (result?.success) {
      setSnackbarMessage(result.message);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      setTimeout(() => {
        router.push("/studentBatchAssignments");
      }, 1500);
    }
  };

  const isLoading = isLoadingAssignment || loadingDropdowns;

  return (
    <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Edit Student Batch Assignment
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.error}
        </Alert>
      )}

      <Paper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0" }}>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <form onSubmit={onSubmit}>
            <Grid container spacing={2}>
              {/* STUDENT ENROLLMENT DROPDOWN */}
              <Grid size={{xs:12, sm:6}}>
                <FormControl fullWidth size="small">
                  <InputLabel>Enrollment</InputLabel>
                  <Select
                    label="Enrollment"
                    name="studentEnrollmentId"
                    value={formData.studentEnrollmentId || 0}
                    onChange={(e) =>
                      handleNumberChange(
                        "studentEnrollmentId",
                        Number(e.target.value)
                      )
                    }
                  >
                    {enrollments.map((enr) => (
                      <MenuItem
                        key={enr.studentEnrollmentId}
                        value={enr.studentEnrollmentId}
                      >
                        {enr.studentName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* BATCH DROPDOWN */}
              <Grid size={{xs:12, sm:6}}>
                <FormControl fullWidth size="small">
                  <InputLabel>Batch</InputLabel>
                  <Select
                    label="Batch"
                    name="batchId"
                    value={formData.batchId || 0}
                    onChange={(e) =>
                      handleNumberChange("batchId", Number(e.target.value))
                    }
                  >
                    {batches.map((b) => (
                      <MenuItem key={b.batchId} value={b.batchId}>
                        {b.batchCode}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* ASSIGNMENT DATE */}
              <Grid size={{xs:12, sm:6}}>
                <TextField
                  fullWidth
                  label="Assignment Date"
                  name="assignmentDate"
                  type="date"
                  value={formData.assignmentDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Grid>

              {/* ASSIGNMENT TYPE */}
              <Grid size={{xs:12, sm:6}}>
                <FormControl fullWidth size="small">
                  <InputLabel>Assignment Type</InputLabel>
                  <Select
                    label="Assignment Type"
                    name="assignmentType"
                    value={formData.assignmentType}
                    onChange={handleSelectChange}
                  >
                    <MenuItem value="fresh">Fresh</MenuItem>
                    <MenuItem value="merged">Merged</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* REMARK */}
              <Grid size={{xs:12}}>
                <TextField
                  fullWidth
                  label="Remark"
                  name="remark"
                  value={formData.remark}
                  onChange={handleChange}
                  size="small"
                  multiline
                  minRows={2}
                />
              </Grid>

              {/* ACTIVE / INACTIVE TOGGLE */}
              <Grid size={{xs:12}}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={(e) =>
                        handleBooleanChange("isActive", e.target.checked)
                      }
                    />
                  }
                  label={formData.isActive ? "Active" : "Inactive"}
                />
              </Grid>

              {/* ACTION BUTTONS */}
              <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<Save />}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Updating..." : "Update Assignment"}
                  </Button>

                  <Link href="/studentBatchAssignments">
                    <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<Cancel />}
                    >
                      Cancel
                    </Button>
                  </Link>
                </Box>
              </Grid>
            </Grid>
          </form>
        )}
      </Paper>

      {/* SNACKBAR */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbarSeverity} variant="filled" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
