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

import { useExamPaperQuestionDetailsViewModel } 
from "@/lib/features/examPaperQuestion/useExamPaperQuestionDetailsViewModel";

export default function ExamPaperQuestionDetailsPage() {
  const { id } = useParams();

  const { examPaperQuestion, isLoading, error } =
    useExamPaperQuestionDetailsViewModel(id as string);

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
        <Alert severity="error">Failed to load details</Alert>
      </Container>
    );
  }

  if (!examPaperQuestion) return null;

  /* ===============================
     PAGE UI (MATCHING YOUR DESIGN)
  ================================ */

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <Link href="/examPaperQuestions">
          <Button startIcon={<ArrowBack />} variant="outlined" size="small">
            Back
          </Button>
        </Link>

        <Typography variant="h4">
          Exam Paper Question Details
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* ================= LEFT CARD ================= */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, textAlign: "center" }} elevation={2}>
            <HelpOutline
              sx={{ fontSize: 80, color: "primary.main", mb: 2 }}
            />

            <Typography variant="h5">
              #{examPaperQuestion.examPaperQuestionId}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {examPaperQuestion.examPaperName}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Stack spacing={1} alignItems="flex-start">
              <Box sx={{ display: "flex", gap: 1 }}>
                <Event fontSize="small" />
                <Typography variant="body2">
                  Created: {formatDate(examPaperQuestion.createdAt)}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Event fontSize="small" />
                <Typography variant="body2">
                  Updated: {formatDate(examPaperQuestion.updatedAt)}
                </Typography>
              </Box>
            </Stack>

            <Box sx={{ mt: 3 }}>
              <Link href={`/examPaperQuestions/${id}/edit`}>
                <Button variant="contained" startIcon={<Edit />} fullWidth>
                  Edit Mapping
                </Button>
              </Link>
            </Box>
          </Paper>
        </Grid>

        {/* ================= RIGHT CARD ================= */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Mapping Information
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Exam Paper
                  </Typography>
                  <Typography>
                    {examPaperQuestion.examPaperName ?? "-"}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Question
                  </Typography>
                  <Typography>
                    {examPaperQuestion.questionTitle ?? "-"}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Marks Override
                  </Typography>
                  <Typography>
                    {examPaperQuestion.marksOverride ?? "-"}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Question Order
                  </Typography>
                  <Typography>
                    {examPaperQuestion.questionOrder ?? "-"}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6">System Information</Typography>

              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Mapping ID
                  </Typography>
                  <Typography>
                    {examPaperQuestion.examPaperQuestionId}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Firm ID
                  </Typography>
                  <Typography>
                    {examPaperQuestion.firmId}
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
