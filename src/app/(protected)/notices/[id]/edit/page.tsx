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
} from "@mui/material";
import { Save, Cancel } from "@mui/icons-material";
import Link from "next/link";

import useEditNoticeViewModel from "@/lib/features/notice/useEditNoticeViewModel";
import { ApiError } from "@/lib/features/notice/noticeTypes";
import { useBatchViewModel } from "@/lib/features/batch/useBatchViewModel";
import { useStudentViewModel } from "@/lib/features/student/useStudentViewModel";

/* ===============================
   Field Labels (for errors)
================================ */

const fieldLabels: Record<string, string> = {
  title: "Title",
  description: "Description",
  createdBy: "Updated By",
  createdFor: "Notice Type",
  batchId: "Batch",
  studentId: "Student",

  // API PascalCase
  Title: "Title",
  Description: "Description",
  CreatedBy: "Updated By",
  CreatedFor: "Notice Type",
  BatchId: "Batch",
  StudentId: "Student",
};

/* ===============================
   Error Renderer
================================ */

function renderErrorContent(error: ApiError | null) {
  if (!error) return null;

  return (
    <div className="text-red-600">
      {error.error && (
        <h4 className="font-semibold mb-2">{error.error}</h4>
      )}

      {error.errors && (
        <ul className="list-disc list-inside space-y-1">
          {Object.entries(error.errors).map(([field, messages]) =>
            messages.map((msg, i) => (
              <li key={`${field}-${i}`}>
                <strong>{fieldLabels[field] || field}:</strong>{" "}
                {msg}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

export default function EditNoticePage() {
  const {
    formData,
    isSubmitting,
    error,
    loading,
    handleChange,
    handleStringSelectChange,
    handleNumberSelectChange,
    handleSubmit,
  } = useEditNoticeViewModel();

  /* Snackbar */
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error"
  >("success");

  const handleSnackbarClose = () => setSnackbarOpen(false);

  /* Dropdowns */
  const {
    dropdownBatches,
    ensureBatchesLoaded,
    isLoading: batchLoading,
  } = useBatchViewModel();

  const {
    dropdownStudents,
    ensureStudentsLoaded,
    isLoading: studentLoading,
  } = useStudentViewModel();

  useEffect(() => {
    ensureBatchesLoaded();
    ensureStudentsLoaded();
  }, [ensureBatchesLoaded, ensureStudentsLoaded]);

  return (
    <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Edit Notice
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {renderErrorContent(error)}
        </Alert>
      )}

      <Paper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0" }}>
        <form
          onSubmit={async (e) => {
            const result = await handleSubmit(e);

            if (result?.success) {
              setSnackbarMessage(result.message);
              setSnackbarSeverity("success");
              setSnackbarOpen(true);

              setTimeout(() => {
                window.location.href = "/notices";
              }, 1500);
            }
          }}
        >
          <Grid container spacing={2}>
            {/* Notice Info */}
            <Grid size={{ xs: 12 }}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 1, color: "text.secondary" }}
              >
                Notice Information
              </Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                size="small"
                disabled={loading || isSubmitting}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                size="small"
                multiline
                minRows={3}
                disabled={loading || isSubmitting}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Updated By"
                name="updatedBy"
                value={formData.updatedBy}
                onChange={handleChange}
                required
                size="small"
                disabled={loading || isSubmitting}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl
                fullWidth
                size="small"
                disabled
                // disabled={loading || isSubmitting}
              >
                <InputLabel>Notice For</InputLabel>
                <Select
                  label="Notice For"
                  name="createdFor"
                  value={formData.createdFor}
                  onChange={handleStringSelectChange}
                >
                  <MenuItem value="BATCH">Batch</MenuItem>
                  <MenuItem value="STUDENT">Student</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Conditional Fields */}
            {formData.createdFor === "BATCH" && (
              <Grid size={{ xs: 12 }}>
                <FormControl
                  fullWidth
                  size="small"
                  disabled
                //   disabled={batchLoading || isSubmitting}
                >
                  <InputLabel>Batch</InputLabel>
                  <Select
                    label="Batch"
                    name="batchId"
                    value={formData.batchId}
                    onChange={handleNumberSelectChange}
                  >
                    {dropdownBatches.map((batch) => (
                      <MenuItem
                        key={batch.batchId}
                        value={batch.batchId}
                      >
                        {batch.batchCode}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            {formData.createdFor === "STUDENT" && (
              <Grid size={{ xs: 12 }}>
                <FormControl
                  fullWidth
                  size="small"
                  disabled
                //   disabled={studentLoading || isSubmitting}
                >
                  <InputLabel>Student</InputLabel>
                  <Select
                    label="Student"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleNumberSelectChange}
                  >
                    {dropdownStudents.map((student) => (
                      <MenuItem
                        key={student.studentId}
                        value={student.studentId}
                      >
                        {student.firstName} {student.lastName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            {/* Actions */}
            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Link href="/notices" passHref>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<Cancel />}
                    size="small"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </Link>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<Save />}
                  size="small"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update Notice"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Snackbar */}
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
