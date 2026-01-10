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
  Campaign,
  Group,
  Person,
  Event,
  Description,
} from "@mui/icons-material";

import { useNoticeDetailsViewModel } from "@/lib/features/notice/useNoticeDetailsViewModel";

export default function NoticeDetails() {
  const { id } = useParams();
  const { notice, isLoading, error } = useNoticeDetailsViewModel(id as string);

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
          Failed to load notice details
        </Alert>
        <Link href="/notices" passHref>
          <Button startIcon={<ArrowBack />} variant="outlined">
            Back to Notices
          </Button>
        </Link>
      </Container>
    );
  }

  /* ===============================
     Not Found
  ================================ */

  if (!notice) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Notice not found
        </Alert>
        <Link href="/notices" passHref>
          <Button startIcon={<ArrowBack />} variant="outlined">
            Back to Notices
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
          <Link href="/notices" passHref>
            <Button startIcon={<ArrowBack />} variant="outlined" size="small">
              Back
            </Button>
          </Link>
          <Typography variant="h4">Notice Details</Typography>
        </Box>

        <Chip
          label={notice.createdFor}
          color={notice.createdFor === "BATCH" ? "primary" : "secondary"}
          variant="filled"
        />
      </Box>

      <Grid container spacing={3}>
        {/* Left Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, textAlign: "center" }} elevation={2}>
            <Campaign
              sx={{
                fontSize: 80,
                color: "primary.main",
                mb: 2,
              }}
            />

            <Typography variant="h5" gutterBottom>
              {notice.title}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Created By: {notice.createdBy || "Unknown"}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Stack spacing={1} alignItems="flex-start">
              <Box sx={{ display: "flex", gap: 1 }}>
                <Event fontSize="small" />
                <Typography variant="body2">
                  {formatDate(notice.createdAt)}
                </Typography>
              </Box>

              {notice.batchName && (
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Group fontSize="small" />
                  <Typography variant="body2">
                    Batch: {notice.batchName}
                  </Typography>
                </Box>
              )}

              {notice.studentName && (
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Person fontSize="small" />
                  <Typography variant="body2">
                    Student: {notice.studentName}
                  </Typography>
                </Box>
              )}
            </Stack>

            <Box sx={{ mt: 3 }}>
              <Link href={`/notices/${id}/edit`} passHref>
                <Button variant="contained" startIcon={<Edit />} fullWidth>
                  Edit Notice
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
                Notice Information
              </Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                    <Description fontSize="small" color="primary" />
                    <Typography variant="subtitle2">
                      Description
                    </Typography>
                  </Box>
                  <Typography variant="body1">
                    {notice.description || "No description"}
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
                    Notice ID
                  </Typography>
                  <Typography variant="body2">{notice.noticeId}</Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Created For
                  </Typography>
                  <Typography variant="body2">
                    {notice.createdFor}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Created On
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(notice.createdAt)}
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
