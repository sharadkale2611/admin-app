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
  PictureAsPdf,
  Event,
  ToggleOn,
  HelpOutline,
} from "@mui/icons-material";

import { useQuestionAttachmentDetailsViewModel } from "@/lib/features/questionAttachment/useQuestionAttachmentDetailsViewModel";

export default function QuestionAttachmentDetailsPage() {
  const { id } = useParams();

  const { attachment, isLoading, error } =
    useQuestionAttachmentDetailsViewModel(id as string);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isImage = (path?: string | null) =>
    path ? /\.(jpg|jpeg|png|webp)$/i.test(path) : false;

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
          Failed to load attachment details
        </Alert>
        <Link href="/questionAttachments">
          <Button startIcon={<ArrowBack />} variant="outlined">
            Back to Attachments
          </Button>
        </Link>
      </Container>
    );
  }

  /* ===============================
     Not Found
  ================================ */

  if (!attachment) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Attachment not found
        </Alert>
        <Link href="/questionAttachments">
          <Button startIcon={<ArrowBack />} variant="outlined">
            Back to Attachments
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
          <Link href="/questionAttachments">
            <Button startIcon={<ArrowBack />} variant="outlined" size="small">
              Back
            </Button>
          </Link>

          <Typography variant="h4">
            Attachment Details
          </Typography>
        </Box>

        <Chip
          label={attachment.isActive ? "Active" : "Inactive"}
          color={attachment.isActive ? "success" : "default"}
        />
      </Box>

      <Grid container spacing={3}>
        {/* Left Summary Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, textAlign: "center" }} elevation={2}>
            {attachment.uploadMediaPath ? (
              isImage(attachment.uploadMediaPath) ? (
                <Avatar
                  src={attachment.uploadMediaPath}
                  variant="rounded"
                  sx={{
                    width: 140,
                    height: 140,
                    margin: "0 auto",
                    mb: 2,
                  }}
                />
              ) : (
                <PictureAsPdf
                  sx={{
                    fontSize: 100,
                    color: "error.main",
                    mb: 2,
                  }}
                />
              )
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
              Attachment #{attachment.questionAttachmentId}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Stack spacing={1} alignItems="flex-start">
              <Box sx={{ display: "flex", gap: 1 }}>
                <Event fontSize="small" />
                <Typography variant="body2">
                  Created: {formatDate(attachment.createdAt)}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Event fontSize="small" />
                <Typography variant="body2">
                  Updated: {formatDate(attachment.updatedAt)}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <ToggleOn fontSize="small" />
                <Typography variant="body2">
                  Status: {attachment.isActive ? "Active" : "Inactive"}
                </Typography>
              </Box>
            </Stack>

            <Box sx={{ mt: 3 }}>
              <Link href={`/questionAttachments/${id}/edit`}>
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  fullWidth
                >
                  Edit Attachment
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
                Attachment Information
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Question
                  </Typography>
                  <Typography variant="body2">
                    {attachment.questionTitle ??
                      `Question #${attachment.questionId}`}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Firm ID
                  </Typography>
                  <Typography variant="body2">
                    {attachment.firmId}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    File Path
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ wordBreak: "break-all" }}
                  >
                    {attachment.uploadMediaPath}
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
                    Attachment ID
                  </Typography>
                  <Typography variant="body2">
                    {attachment.questionAttachmentId}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Question ID
                  </Typography>
                  <Typography variant="body2">
                    {attachment.questionId}
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
