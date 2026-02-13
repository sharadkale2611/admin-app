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
  HelpOutline,
  Event,
  ToggleOn,
  School,
  MenuBook,
  FormatListNumbered,
} from "@mui/icons-material";

import { useQuestionDetailsViewModel } from "@/lib/features/question/useQuestionDetailsViewModel";

export default function QuestionDetailsPage() {
  const { id } = useParams();
  const { question, isLoading, error } =
    useQuestionDetailsViewModel(id as string);

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
          Failed to load question details
        </Alert>
        <Link href="/questions">
          <Button startIcon={<ArrowBack />} variant="outlined">
            Back to Questions
          </Button>
        </Link>
      </Container>
    );
  }

  /* ===============================
     Not Found
  ================================ */

  if (!question) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Question not found
        </Alert>
        <Link href="/questions">
          <Button startIcon={<ArrowBack />} variant="outlined">
            Back to Questions
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
          <Link href="/questions">
            <Button startIcon={<ArrowBack />} variant="outlined" size="small">
              Back
            </Button>
          </Link>
          <Typography variant="h4">
            Question Details
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Chip
            label={question.difficultyLevel}
            color={
              question.difficultyLevel === "EASY"
                ? "success"
                : question.difficultyLevel === "MEDIUM"
                ? "warning"
                : "error"
            }
          />

          <Chip
            label={question.isActive ? "Active" : "Inactive"}
            color={question.isActive ? "success" : "default"}
          />
        </Stack>
      </Box>

      <Grid container spacing={3}>
        {/* Left Summary Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, textAlign: "center" }} elevation={2}>
            <HelpOutline
              sx={{
                fontSize: 80,
                color: "primary.main",
                mb: 2,
              }}
            />

            <Typography variant="h5" gutterBottom>
              Question #{question.questionId}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Version: {question.questionVersion}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Stack spacing={1} alignItems="flex-start">
              <Box sx={{ display: "flex", gap: 1 }}>
                <Event fontSize="small" />
                <Typography variant="body2">
                  Created: {formatDate(question.createdAt)}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Event fontSize="small" />
                <Typography variant="body2">
                  Updated: {formatDate(question.updatedAt)}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <ToggleOn fontSize="small" />
                <Typography variant="body2">
                  Status: {question.isActive ? "Active" : "Inactive"}
                </Typography>
              </Box>
            </Stack>

            <Box sx={{ mt: 3 }}>
              <Link href={`/questions/${id}/edit`}>
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  fullWidth
                >
                  Edit Question
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
                Question Information
              </Typography>

              <Typography variant="body1" sx={{ mb: 2 }}>
                {question.title}
              </Typography>

              {question.description && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  {question.description}
                </Typography>
              )}

              <Divider sx={{ my: 3 }} />

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Marks
                  </Typography>
                  <Typography variant="body2">
                    {question.marks}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Negative Marks
                  </Typography>
                  <Typography variant="body2">
                    {question.negativeMarks}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Question Type
                  </Typography>
                  <Typography variant="body2">
                    {question.questionTypeName ?? "-"}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Course
                  </Typography>
                  <Typography variant="body2">
                    {question.courseName ?? "Not Assigned"}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Module
                  </Typography>
                  <Typography variant="body2">
                    {question.moduleName ?? "Not Assigned"}
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
                    Question ID
                  </Typography>
                  <Typography variant="body2">
                    {question.questionId}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Firm ID
                  </Typography>
                  <Typography variant="body2">
                    {question.firmId}
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
