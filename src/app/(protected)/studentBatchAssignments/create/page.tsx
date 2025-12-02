"use client";

import React, { useState, useEffect } from "react";
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
} from "@mui/material";

import { Save, Cancel } from "@mui/icons-material";
import Link from "next/link";

import useCreateStudentBatchAssignmentViewModel from "@/lib/features/studentBatchAssignment/useCreateStudentBatchAssignmentViewModel";
import api from "@/lib/services/apiService";

export default function CreateStudentBatchAssignment() {
  const {
    formData,
    isSubmitting,
    error,
    clearError,
    handleChange,
    handleSelectChange,
    handleNumberChange,
    toggleEnrollmentSelection,
    handleSubmit,
    deselectAllEnrollments,
    selectAllEnrollments,
  } = useCreateStudentBatchAssignmentViewModel();

  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const handleSnackbarClose = () => setSnackbarOpen(false);

  // Load dropdown data
  useEffect(() => {
    async function loadData() {
      try {
        const [enrollmentRes, batchRes] = await Promise.all([
          api.get("/Enrollments"),
          api.get("/Batches"),
        ]);

        setEnrollments(enrollmentRes.data || []);
        setBatches(batchRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingData(false);
      }
    }

    loadData();
  }, []);

  // Form submit handler
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError(); // remove old errors

    const result = await handleSubmit();

    if (result?.success) {
      setSnackbarMessage(result.message);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      setTimeout(() => {
        window.location.href = "/studentBatchAssignments";
      }, 1500);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Create Student Batch Assignment
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.error}
        </Alert>
      )}

      <Paper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0" }}>
        <form onSubmit={onSubmit}>
          <Grid container spacing={2}>
            {/* CHECKBOX STUDENTS */}

            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Select Students (Enrollments)
              </Typography>

              {/* SELECT ALL / DESELECT ALL BUTTONS */}
              {!loadingData && (
                <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() =>
                      selectAllEnrollments(
                        enrollments.map((e) => e.studentEnrollmentId)
                      )
                    }
                  >
                    Select All
                  </Button>

                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={deselectAllEnrollments}
                  >
                    Deselect All
                  </Button>
                </Box>
              )}

              {loadingData ? (
                <CircularProgress size={22} />
              ) : (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(240px, 1fr))",
                    gap: 1,
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    p: 2,
                    maxHeight: 300,
                    overflowY: "auto",
                  }}
                >
                  {enrollments.map((enr) => (
                    <label
                      key={enr.studentEnrollmentId}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "15px",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.studentEnrollmentIds.includes(
                          enr.studentEnrollmentId
                        )}
                        onChange={() =>
                          toggleEnrollmentSelection(enr.studentEnrollmentId)
                        }
                      />
                      {enr.studentName}
                    </label>
                  ))}
                </Box>
              )}
            </Grid>

            {/* BATCH DROPDOWN */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Batch</InputLabel>
                <Select
                  label="Batch"
                  name="batchId"
                  value={formData.batchId}
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
            <Grid size={{ xs: 12, sm: 6 }}>
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
            <Grid size={{ xs: 12, sm: 6 }}>
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
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Remark"
                name="remark"
                value={formData.remark}
                onChange={handleChange}
                size="small"
                multiline
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
                  {isSubmitting ? "Creating..." : "Create Assignment"}
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
      </Paper>

      {/* SNACKBAR */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
