'use client';

import React from 'react';
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
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import Link from 'next/link';
import useCreateExamMarkViewModel from '@/lib/features/examMarks/useCreateExamMarkViewModel';
import { useExamMarksListSupport } from '@/lib/features/examMarks/useExamMarksListSupport';

export default function CreateExamMark() {
  const {
    formData,
    isSubmitting,
    error,
    handleChange,
    handleStatusChange,
    handleSubmit,
  } = useCreateExamMarkViewModel();

  const { exams, students } = useExamMarksListSupport();

  return (
    <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Create Exam Mark
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0' }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Exam</InputLabel>
                <Select
                  label="Exam"
                  name="examId"
                  value={formData.examId}
                  onChange={(e) =>
                    handleChange(e as any)
                  }
                  required
                  disabled={isSubmitting}
                >
                  {exams.map((ex) => (
                    <MenuItem key={ex.examId} value={ex.examId.toString()}>
                      {ex.examName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Student</InputLabel>
                <Select
                  label="Student"
                  name="studentId"
                  value={formData.studentId}
                  onChange={(e) =>
                    handleChange(e as any)
                  }
                  required
                  disabled={isSubmitting}
                >
                  {students.map((st) => (
                    <MenuItem
                      key={st.studentId}
                      value={st.studentId.toString()}
                    >
                      {st.firstName} {st.lastName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Marks Obtained"
                name="markObtained"
                type="number"
                value={formData.markObtained}
                onChange={handleChange}
                required
                size="small"
                disabled={isSubmitting}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.status}
                    onChange={handleStatusChange}
                    color="primary"
                  />
                }
                label="Active"
              />
            </Grid>

            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Link href="/exam-marks" passHref>
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
                  {isSubmitting ? 'Saving...' : 'Save Exam Mark'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}
