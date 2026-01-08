'use client';

import React from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Grid,
  Alert,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import Link from 'next/link';
import useEditExamMarkViewModel from '@/lib/features/examMarks/useEditExamMarkViewModel';

export default function EditExamMark() {
  const {
    formData,
    isSubmitting,
    error,
    loading,
    handleChange,
    handleStatusChange,
    handleSubmit,
  } = useEditExamMarkViewModel();

  return (
    <Container maxWidth="sm" sx={{ mt: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Edit Exam Mark
      </Typography>

      {(error || loading) && (
        <Alert severity={loading ? 'info' : 'error'} sx={{ mb: 2 }}>
          {loading ? 'Loading exam mark...' : error}
        </Alert>
      )}

      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0' }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
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

            <Grid item xs={12}>
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

            <Grid item xs={12} sx={{ mt: 2 }}>
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
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}
