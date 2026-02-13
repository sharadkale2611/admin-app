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
  Settings,
  Event,
  Rule,
  ToggleOn,
  FormatListNumbered,
} from "@mui/icons-material";

import { useQuestionTypeRuleDetailsViewModel } from "@/lib/features/questionTypeRule/useQuestionTypeRuleDetailsViewModel";

export default function QuestionTypeRuleDetails() {
  const { id } = useParams();
  const { questionTypeRule, isLoading, error } =
    useQuestionTypeRuleDetailsViewModel(id as string);

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
          Failed to load rule details
        </Alert>
        <Link href="/questionTypeRules">
          <Button startIcon={<ArrowBack />} variant="outlined">
            Back to Rules
          </Button>
        </Link>
      </Container>
    );
  }

  /* ===============================
     Not Found
  ================================ */

  if (!questionTypeRule) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Rule not found
        </Alert>
        <Link href="/questionTypeRules">
          <Button startIcon={<ArrowBack />} variant="outlined">
            Back to Rules
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
          <Link href="/questionTypeRules">
            <Button startIcon={<ArrowBack />} variant="outlined" size="small">
              Back
            </Button>
          </Link>
          <Typography variant="h4">
            Question Type Rule Details
          </Typography>
        </Box>

        <Chip
          label={
            questionTypeRule.isRegexAnswerAllowed
              ? "Regex Enabled"
              : "Regex Disabled"
          }
          color={
            questionTypeRule.isRegexAnswerAllowed
              ? "success"
              : "default"
          }
          variant="filled"
        />
      </Box>

      <Grid container spacing={3}>
        {/* Left Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, textAlign: "center" }} elevation={2}>
            <Rule
              sx={{
                fontSize: 80,
                color: "primary.main",
                mb: 2,
              }}
            />

            <Typography variant="h5" gutterBottom>
              Rule #{questionTypeRule.ruleId}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Question Type ID:{" "}
              {questionTypeRule.questionTypeId}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Stack spacing={1} alignItems="flex-start">
              <Box sx={{ display: "flex", gap: 1 }}>
                <Event fontSize="small" />
                <Typography variant="body2">
                  Created:{" "}
                  {formatDate(questionTypeRule.createdAt)}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <ToggleOn fontSize="small" />
                <Typography variant="body2">
                  Regex:{" "}
                  {questionTypeRule.isRegexAnswerAllowed
                    ? "Allowed"
                    : "Not Allowed"}
                </Typography>
              </Box>
            </Stack>

            <Box sx={{ mt: 3 }}>
              <Link
                href={`/questionTypeRules/${id}/edit`}
              >
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  fullWidth
                >
                  Edit Rule
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
                Rule Configuration
              </Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Minimum Options
                  </Typography>
                  <Typography variant="body2">
                    {questionTypeRule.minOptions ?? "Not Set"}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Maximum Options
                  </Typography>
                  <Typography variant="body2">
                    {questionTypeRule.maxOptions ?? "Not Set"}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Maximum Selections
                  </Typography>
                  <Typography variant="body2">
                    {questionTypeRule.maxSelections ?? "Not Set"}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Maximum Text Length
                  </Typography>
                  <Typography variant="body2">
                    {questionTypeRule.maxTextLength ?? "Not Set"}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                System Information
              </Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Rule ID
                  </Typography>
                  <Typography variant="body2">
                    {questionTypeRule.ruleId}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Question Type ID
                  </Typography>
                  <Typography variant="body2">
                    {questionTypeRule.questionTypeId}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Created On
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(questionTypeRule.createdAt)}
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
