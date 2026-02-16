"use client";

import React from "react";
import { useParams } from "next/navigation";
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
  Stack,
} from "@mui/material";

import Link from "next/link";
import {
  ArrowBack,
  Edit,
  Event,
  HelpOutline,
} from "@mui/icons-material";

import { useExamPaperDetailsViewModel } from "@/lib/features/exampaper/useExamPaperDetailsViewModel";

export default function ExamPaperDetailsPage() {
  const { id } = useParams();

  const { examPaper, isLoading, error } =
    useExamPaperDetailsViewModel(id as string);

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "Not specified";

    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  /* ===============================
     Loading
  ================================ */

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Skeleton variant="rectangular" width="100%" height={400} />
      </Container>
    );
  }

  /* ===============================
     Error
  ================================ */

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load exam paper
        </Alert>

        <Link href="/exampapers">
          <Button startIcon={<ArrowBack />} variant="outlined">
            Back
          </Button>
        </Link>
      </Container>
    );
  }

  /* ===============================
     Not Found
  ================================ */

  if (!examPaper) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Exam paper not found
        </Alert>

        <Link href="/exampapers">
          <Button startIcon={<ArrowBack />} variant="outlined">
            Back
          </Button>
        </Link>
      </Container>
    );
  }

  /* ===============================
     Page
  ================================ */

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Link href="/exampapers">
            <Button startIcon={<ArrowBack />} variant="outlined" size="small">
              Back
            </Button>
          </Link>

          <Typography variant="h4">Exam Paper Details</Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Chip
            label={`Total Marks: ${examPaper.totalMarks}`}
            color="primary"
          />
          <Chip
            label={`${examPaper.durationMinutes} min`}
            color="secondary"
          />
        </Stack>
      </Box>

      <Grid container spacing={3}>
        {/* LEFT CARD */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, textAlign: "center" }} elevation={2}>
            <HelpOutline
              sx={{
                fontSize: 80,
                color: "primary.main",
                mb: 2,
              }}
            />

            <Typography variant="h5">
              #{examPaper.examPaperId}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {examPaper.name}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Stack spacing={1} alignItems="flex-start">
              <Box sx={{ display: "flex", gap: 1 }}>
                <Event fontSize="small" />
                <Typography variant="body2">
                  Created: {formatDate(examPaper.createdAt)}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Event fontSize="small" />
                <Typography variant="body2">
                  Updated: {formatDate(examPaper.updatedAt)}
                </Typography>
              </Box>
            </Stack>

            <Box sx={{ mt: 3 }}>
              <Link href={`/exampapers/${id}/edit`}>
                <Button variant="contained" startIcon={<Edit />} fullWidth>
                  Edit Exam Paper
                </Button>
              </Link>
            </Box>
          </Paper>
        </Grid>

        {/* RIGHT CARD */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Exam Paper Information
              </Typography>

              <Typography variant="body1" sx={{ mb: 2 }}>
                {examPaper.name}
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Marks
                  </Typography>
                  <Typography variant="body2">
                    {examPaper.totalMarks}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Duration (Minutes)
                  </Typography>
                  <Typography variant="body2">
                    {examPaper.durationMinutes}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Shuffle Questions
                  </Typography>
                  <Typography variant="body2">
                    {examPaper.shuffleQuestions ? "Yes" : "No"}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Shuffle Options
                  </Typography>
                  <Typography variant="body2">
                    {examPaper.shuffleOptions ? "Yes" : "No"}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6">System Information</Typography>

              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    ExamPaper ID
                  </Typography>
                  <Typography variant="body2">
                    {examPaper.examPaperId}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Firm ID
                  </Typography>
                  <Typography variant="body2">
                    {examPaper.firmId}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
