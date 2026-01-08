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

import { useExamViewModel } from '@/lib/features/exam/useExamViewModel';

export default function ViewExam() {

  const { id } = useParams();

  const examId =
    Array.isArray(id) ? Number(id[0]) : Number(id);

  const { exams, isLoading, error } = useExamViewModel();

  const exam = exams.find(e => e.examId === examId);

  // ⏳ Loading skeleton
  if (isLoading)
    return (
      <Container maxWidth="md" sx={{ mt: 3 }}>
        <Skeleton variant="text" width={300} height={40} />
        <Skeleton variant="rectangular" width="100%" height={300} />
      </Container>
    );

  // ❌ API error
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
            <Typography color="text.secondary">Module ID</Typography>
            <Typography>{exam.moduleId}</Typography>
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
            <Typography color="text.secondary">Course ID</Typography>
            <Typography>{exam.courseId ?? '—'}</Typography>
          </Grid>

        </Grid>
      </Paper>
    </Container>
  );
}
