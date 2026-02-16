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
  ToggleOn,
  HelpOutline,
  Score,
  Code,
} from "@mui/icons-material";

import { useQuestionAnswerDetailsViewModel } from "@/lib/features/questionAnswer/useQuestionAnswerDetailsViewModel";

export default function QuestionAnswerDetailsPage() {
  const { id } = useParams();

  const { answer, isLoading, error } =
    useQuestionAnswerDetailsViewModel(id as string);

  const formatDate = (dateString: string | null | undefined) => {
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
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Skeleton variant="rectangular" width="100%" height={400} />
      </Container>
    );
  }

  /* ===============================
     Error
  ================================ */

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load answer details
        </Alert>
        <Link href="/questionAnswers">
          <Button startIcon={<ArrowBack />} variant="outlined">
            Back to Answers
          </Button>
        </Link>
      </Container>
    );
  }

  /* ===============================
     Not Found
  ================================ */

  if (!answer) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Question answer not found
        </Alert>
        <Link href="/questionAnswers">
          <Button startIcon={<ArrowBack />} variant="outlined">
            Back to Answers
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
          alignItems: "center",
          justifyContent: "space-between",
          mb: 4,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Link href="/questionAnswers">
            <Button startIcon={<ArrowBack />} variant="outlined" size="small">
              Back
            </Button>
          </Link>

          <Typography variant="h4">
            Question Answer Details
          </Typography>
        </Box>

        <Chip
          label={answer.isActive ? "Active" : "Inactive"}
          color={answer.isActive ? "success" : "default"}
        />
      </Box>

      <Grid container spacing={3}>
        {/* Left Summary Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3 }} elevation={2}>
            <Typography variant="h6" gutterBottom>
              Answer #{answer.questionAnswerId}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Stack spacing={1}>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Event fontSize="small" />
                <Typography variant="body2">
                  Created: {formatDate(answer.createdAt)}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <ToggleOn fontSize="small" />
                <Typography variant="body2">
                  Status: {answer.isActive ? "Active" : "Inactive"}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Score fontSize="small" />
                <Typography variant="body2">
                  Max Score: {answer.maxScore}
                </Typography>
              </Box>
            </Stack>

            <Box sx={{ mt: 3 }}>
              <Link href={`/questionAnswers/${id}/edit`}>
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  fullWidth
                >
                  Edit Answer
                </Button>
              </Link>
            </Box>
          </Paper>
        </Grid>

        {/* Right Details Card */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Answer Information
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Question
                  </Typography>
                  <Typography variant="body2">
                    {answer.questionTitle ??
                      `Question #${answer.questionId}`}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Answer Text
                  </Typography>
                  <Typography variant="body2">
                    {answer.answerText || "Not specified"}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Answer Regex
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Code fontSize="small" />
                    <Typography
                      variant="body2"
                      sx={{ wordBreak: "break-all" }}
                    >
                      {answer.answerRegex || "Not specified"}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Firm ID
                  </Typography>
                  <Typography variant="body2">
                    {answer.firmId}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Question ID
                  </Typography>
                  <Typography variant="body2">
                    {answer.questionId}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                System Information
              </Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Answer ID
                  </Typography>
                  <Typography variant="body2">
                    {answer.questionAnswerId}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Created On
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(answer.createdAt)}
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
