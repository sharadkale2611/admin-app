'use client';

import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Button,
  Skeleton,
  Alert,
  Grid
} from '@mui/material';

import Link from 'next/link';
import { ArrowBack, Edit } from '@mui/icons-material';
import { useParams } from 'next/navigation';
import { useSelector } from 'react-redux';

import { useExamViewModel } from '@/lib/features/exam/useExamViewModel';
import type { RootState } from '@/lib/store';

export default function ViewExam() {

  const { id } = useParams();

  const examId =
    Array.isArray(id) ? Number(id[0]) : Number(id);

  const { exams, isLoading, error } = useExamViewModel();

  // ✅ Get course & module lists from store
  const courses = useSelector(
    (state: RootState) => state.courses.courses || []
  );

  const modules = useSelector(
    (state: RootState) => state.modules.modules || []
  );

  const exam = exams.find(e => e.examId === examId);

  // ✅ Resolve names
  const courseName =
    courses.find(c => c.courseId === exam?.courseId)?.courseName || '—';

  const moduleName =
    modules.find(m => m.moduleId === exam?.moduleId)?.moduleName || '—';

  // ⏳ Loading
  if (isLoading)
    return (
      <Container maxWidth="md" sx={{ mt: 3 }}>
        <Skeleton variant="text" width={300} height={40} />
        <Skeleton variant="rectangular" width="100%" height={300} />
      </Container>
    );

  // ❌ Error
  if (error)
    return (
      <Container maxWidth="md" sx={{ mt: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );

  // ⚠ Not found
  if (!exam)
    return (
      <Container maxWidth="md" sx={{ mt: 3 }}>
        <Alert severity="warning">Exam not found.</Alert>

        <Box mt={2}>
          <Button component={Link} href="/exams" startIcon={<ArrowBack />}>
            Back to Exams
          </Button>
        </Box>
      </Container>
    );

  return (
    <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button component={Link} href="/exams" startIcon={<ArrowBack />}>
          Back
        </Button>

        <Button
          variant="contained"
          startIcon={<Edit />}
          component={Link}
          href={`/exams/${exam.examId}/edit`}
        >
          Edit Exam
        </Button>
      </Box>

      {/* Card */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight={600}>
          {exam.examName}
        </Typography>

        <Chip
          label={exam.isActive ? 'Active' : 'Inactive'}
          color={exam.isActive ? 'success' : 'error'}
          sx={{ mt: 1 }}
        />

        <Grid container spacing={2} sx={{ mt: 2 }}>

          <Grid size={{ xs: 12 }}>
            <Typography color="text.secondary">Description</Typography>
            <Typography>{exam.examDescription || '—'}</Typography>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Typography color="text.secondary">Duration (hrs)</Typography>
            <Typography>{exam.examDurationHrs}</Typography>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Typography color="text.secondary">Module</Typography>
            <Typography>{moduleName}</Typography>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Typography color="text.secondary">Total Marks</Typography>
            <Typography>{exam.examTotalMarks}</Typography>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Typography color="text.secondary">Passing Marks</Typography>
            <Typography>{exam.examPassingMarks}</Typography>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Typography color="text.secondary">Course</Typography>
            <Typography>{courseName}</Typography>
          </Grid>

        </Grid>
      </Paper>
    </Container>
  );
}
