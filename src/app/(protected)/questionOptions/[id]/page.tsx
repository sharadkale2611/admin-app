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
  Avatar,
} from "@mui/material";
import Link from "next/link";
import {
  ArrowBack,
  Edit,
  Image as ImageIcon,
  Event,
  ToggleOn,
  CheckCircle,
  FormatListNumbered,
  HelpOutline,
} from "@mui/icons-material";

import { useQuestionOptionDetailsViewModel } from "@/lib/features/questionOption/useQuestionOptionDetailsViewModel";

export default function QuestionOptionDetailsPage() {
  const { id } = useParams();

  const { option, isLoading, error } =
    useQuestionOptionDetailsViewModel(id as string);

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
          Failed to load option details
        </Alert>
        <Link href="/questionOptions">
          <Button startIcon={<ArrowBack />} variant="outlined">
            Back to Options
          </Button>
        </Link>
      </Container>
    );
  }

  /* ===============================
     Not Found
  ================================ */

  if (!option) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Option not found
        </Alert>
        <Link href="/questionOptions">
          <Button startIcon={<ArrowBack />} variant="outlined">
            Back to Options
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
          <Link href="/questionOptions">
            <Button startIcon={<ArrowBack />} variant="outlined" size="small">
              Back
            </Button>
          </Link>
          <Typography variant="h4">
            Option Details
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Chip
            label={option.isCorrect ? "Correct" : "Not Correct"}
            color={option.isCorrect ? "success" : "default"}
          />
          <Chip
            label={option.isActive ? "Active" : "Inactive"}
            color={option.isActive ? "success" : "default"}
          />
        </Stack>
      </Box>

      <Grid container spacing={3}>
        {/* Left Summary Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, textAlign: "center" }} elevation={2}>
            {option.optionMediaPath ? (
              <Avatar
                src={option.optionMediaPath}
                variant="rounded"
                sx={{
                  width: 120,
                  height: 120,
                  margin: "0 auto",
                  mb: 2,
                }}
              />
            ) : (
              <ImageIcon
                sx={{
                  fontSize: 80,
                  color: "primary.main",
                  mb: 2,
                }}
              />
            )}

            <Typography variant="h6" gutterBottom>
              Option #{option.optionId}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Order: {option.optionOrder}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Stack spacing={1} alignItems="flex-start">
              <Box sx={{ display: "flex", gap: 1 }}>
                <Event fontSize="small" />
                <Typography variant="body2">
                  Created: {formatDate(option.createdAt)}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Event fontSize="small" />
                <Typography variant="body2">
                  Updated: {formatDate(option.updatedAt)}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <ToggleOn fontSize="small" />
                <Typography variant="body2">
                  Status: {option.isActive ? "Active" : "Inactive"}
                </Typography>
              </Box>
            </Stack>

            <Box sx={{ mt: 3 }}>
              <Link href={`/questionOptions/${id}/edit`}>
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  fullWidth
                >
                  Edit Option
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
                Option Information
              </Typography>

              <Typography variant="body1" sx={{ mb: 3 }}>
                {option.optionText}
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Question
                  </Typography>
                  <Typography variant="body2">
                    {option.questionTitle ??
                      `Question #${option.questionId}`}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Option Order
                  </Typography>
                  <Typography variant="body2">
                    {option.optionOrder}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Is Correct
                  </Typography>
                  <Typography variant="body2">
                    {option.isCorrect ? "Yes" : "No"}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Firm ID
                  </Typography>
                  <Typography variant="body2">
                    {option.firmId}
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
                    Option ID
                  </Typography>
                  <Typography variant="body2">
                    {option.optionId}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Question ID
                  </Typography>
                  <Typography variant="body2">
                    {option.questionId}
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
