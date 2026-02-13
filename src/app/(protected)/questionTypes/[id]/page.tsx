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
  Quiz,
  Event,
  Info,
  ToggleOn,
  Settings,
} from "@mui/icons-material";

import { useQuestionTypeDetailsViewModel } from "@/lib/features/questionType/useQuestionTypeDetailsViewModel";

export default function QuestionTypeDetails() {
  const { id } = useParams();
  const { questionType, isLoading, error } =
    useQuestionTypeDetailsViewModel(id as string);

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
          Failed to load question type details
        </Alert>
        <Link href="/questionTypes" passHref>
          <Button startIcon={<ArrowBack />} variant="outlined">
            Back to Question Types
          </Button>
        </Link>
      </Container>
    );
  }

  /* ===============================
     Not Found
  ================================ */

  if (!questionType) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Question type not found
        </Alert>
        <Link href="/questionTypes" passHref>
          <Button startIcon={<ArrowBack />} variant="outlined">
            Back to Question Types
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
          <Link href="/questionTypes" passHref>
            <Button startIcon={<ArrowBack />} variant="outlined" size="small">
              Back
            </Button>
          </Link>
          <Typography variant="h4">Question Type Details</Typography>
        </Box>

        <Chip
          label={questionType.isActive ? "Active" : "Inactive"}
          color={questionType.isActive ? "success" : "default"}
          variant="filled"
        />
      </Box>

      <Grid container spacing={3}>
        {/* Left Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, textAlign: "center" }} elevation={2}>
            <Quiz
              sx={{
                fontSize: 80,
                color: "primary.main",
                mb: 2,
              }}
            />

            <Typography variant="h5" gutterBottom>
              {questionType.code}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {questionType.name}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Stack spacing={1} alignItems="flex-start">
              <Box sx={{ display: "flex", gap: 1 }}>
                <Settings fontSize="small" />
                <Typography variant="body2">
                  Evaluation: {questionType.evaluationMode}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Event fontSize="small" />
                <Typography variant="body2">
                  {formatDate(questionType.createdAt)}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <ToggleOn fontSize="small" />
                <Typography variant="body2">
                  Status: {questionType.isActive ? "Active" : "Inactive"}
                </Typography>
              </Box>
            </Stack>

            <Box sx={{ mt: 3 }}>
              <Link
                href={`/questionTypes/${id}/edit`}
                passHref
              >
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  fullWidth
                >
                  Edit Question Type
                </Button>
              </Link>
            </Box>
          </Paper>
        </Grid>

        {/* Right Card */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Question Type Information
              </Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Supports Options
                  </Typography>
                  <Chip
                    label={
                      questionType.supportsOptions ? "Yes" : "No"
                    }
                    color={
                      questionType.supportsOptions
                        ? "success"
                        : "default"
                    }
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Supports Attachments
                  </Typography>
                  <Chip
                    label={
                      questionType.supportsAttachments
                        ? "Yes"
                        : "No"
                    }
                    color={
                      questionType.supportsAttachments
                        ? "success"
                        : "default"
                    }
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                System Information
              </Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Question Type ID
                  </Typography>
                  <Typography variant="body2">
                    {questionType.questionTypeId}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Evaluation Mode
                  </Typography>
                  <Typography variant="body2">
                    {questionType.evaluationMode}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Created On
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(questionType.createdAt)}
                  </Typography>
                </Grid>

                {questionType.updatedAt && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                    >
                      Updated On
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(questionType.updatedAt)}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
