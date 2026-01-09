'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Box,
  Paper,
  Grid,
  Skeleton,
  Alert,
  Divider,
} from '@mui/material';
import Link from 'next/link';
import { ArrowBack } from '@mui/icons-material';
import { useExamMarkDetailsViewModel } from '@/lib/features/examMarks/useExamMarkDetailsViewModel';

export default function ExamMarkDetails() {
  const params = useParams();
  const idParam = params?.id as string | undefined;
  const id = idParam ? Number(idParam) : NaN;

  const { examMark, isLoading, error } = useExamMarkDetailsViewModel(id);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Skeleton variant="rectangular" width="100%" height={300} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Link href="/exam-marks" passHref>
          <Button startIcon={<ArrowBack />} variant="outlined">
            Back to Exam Marks
          </Button>
        </Link>
      </Container>
    );
  }

  if (!examMark || Number.isNaN(id)) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Exam mark not found
        </Alert>
        <Link href="/exam-marks" passHref>
          <Button startIcon={<ArrowBack />} variant="outlined">
            Back to Exam Marks
          </Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Link href="/exam-marks" passHref>
            <Button startIcon={<ArrowBack />} variant="outlined" size="small">
              Back
            </Button>
          </Link>
          <Typography variant="h5" component="h1">
            Exam Mark Details
          </Typography>
        </Box>
        <Chip
          label={examMark.status ? 'Active' : 'Inactive'}
          color={examMark.status ? 'success' : 'error'}
          variant="filled"
        />
      </Box>

      <Paper elevation={2} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid  size={{ xs: 12, sm: 6 }} >
            <Typography variant="subtitle2" color="text.secondary">
              Exam
            </Typography>
            <Typography variant="body1">
              {examMark.examName || `Exam #${examMark.examId}`}
            </Typography>
          </Grid>

          <Grid  size={{ xs: 12, sm: 6 }} >
            <Typography variant="subtitle2" color="text.secondary">
              Student
            </Typography>
            <Typography variant="body1">
              {examMark.studentName || `Student #${examMark.studentId}`}
            </Typography>
          </Grid>

          <Grid  size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Marks Obtained
            </Typography>
            <Typography variant="body1">{examMark.markObtained}</Typography>
          </Grid>

          <Grid  size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Grade (calculated)
            </Typography>
            <Typography variant="body1">{examMark.grade ?? '-'}</Typography>
          </Grid>

          {/* <Grid  size={{ xs: 12, sm: 4 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Firm
            </Typography>
            <Typography variant="body1">
              {examMark.firmName || `Firm #${examMark.firmId}`}
            </Typography>
          </Grid> */}
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          {/* <Grid  size={{ xs: 12, sm: 4 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Exam Mark ID
            </Typography>
            <Typography variant="body2">{examMark.examMarkId}</Typography>
          </Grid> */}

          <Grid  size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Created At
            </Typography>
            <Typography variant="body2">
              {formatDate(examMark.createdAt)}
            </Typography>
          </Grid>

          <Grid  size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Updated At
            </Typography>
            <Typography variant="body2">
              {formatDate(examMark.updatedAt ?? null)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
