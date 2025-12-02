'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

import {
    Container,
    Typography,
    Paper,
    Skeleton,
    Alert,
    Button,
    Box,
    Chip,
    Avatar,
    Divider,
    Stack,
    Grid
} from '@mui/material';

import {
    ArrowBack,
    Edit,
    AttachMoney,
    CalendarToday,
    Update,
    Business,
    Category,
    CheckCircle,
    Cancel,
    School
} from '@mui/icons-material';

import { useCourseFeeDetailsViewModel } from '@/lib/features/fees/useCourseFeeDetailsViewModel';

export default function CourseFeeDetailsPage() {
    const { id } = useParams();
    const { fee, course, isLoading, error } = useCourseFeeDetailsViewModel(id as string);

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return 'Not specified';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getLevelColor = (level?: string) => {
        switch (level) {
            case 'Beginner': return 'success';
            case 'Intermediate': return 'warning';
            case 'Expert': return 'error';
            default: return 'default';
        }
    };

    if (isLoading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Skeleton variant="rectangular" width="100%" height={400} />
            </Container>
        );
    }

    if (error || !fee) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error || 'Course Fee Not Found'}
                </Alert>
                <Link href="/fees" passHref>
                    <Button startIcon={<ArrowBack />} variant="outlined">
                        Back to Course Fee List
                    </Button>
                </Link>
            </Container>
        );
    }

    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Link href="/fees" passHref>
              <Button startIcon={<ArrowBack />} variant="outlined" size="small">
                Back
              </Button>
            </Link>
            <Typography variant="h4">Course Fee Details</Typography>
          </Stack>

          <Chip
            label={fee.totalFee > 0 ? "Active" : "Inactive"}
            color={fee.totalFee > 0 ? "success" : "error"}
            icon={fee.totalFee > 0 ? <CheckCircle /> : <Cancel />}
          />
        </Box>

        <Grid container spacing={3}>
          {/* Main Fee Info */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 3 }}>
              <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: "primary.main", width: 60, height: 60 }}>
                  <School sx={{ fontSize: 30 }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" gutterBottom>
                    {course?.courseName}
                  </Typography>
                  <Chip
                    label={course?.courseLevel}
                    color={getLevelColor(course?.courseLevel) as any}
                    variant="outlined"
                    size="small"
                  />
                </Box>
              </Stack>

              <Divider sx={{ my: 2 }} />

              {/* Fee Details */}
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2">
                    Fee Amount (Before GST)
                  </Typography>
                  <Typography variant="body1">₹ {fee.feeAmount}</Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2">GST Percentage</Typography>
                  <Typography variant="body1">{fee.gstPercentage}%</Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2">Final Fee</Typography>
                  <Typography variant="h6" color="primary">
                    ₹ {fee.totalFee}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2">
                    Total Installments
                  </Typography>
                  <Typography variant="body1">
                    {fee.totalInstallments}
                  </Typography>
                </Grid>


                {course?.courseCategoryName && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="subtitle2">Category</Typography>
                    </Box>
                    <Typography variant="h6" color="primary">
                      {course.courseCategoryName}
                    </Typography>
                  </Grid>
                )}

                {fee.branchName && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Business color="primary" />
                      <Typography variant="subtitle2">Branch</Typography>
                    </Box>
                    <Typography>{fee.branchName}</Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h6" gutterBottom>
                Actions
              </Typography>

              <Stack spacing={2} sx={{ mb: 3 }}>
                <Link href={`/fees/${id}/edit`}>
                  <Button variant="contained" startIcon={<Edit />} fullWidth>
                    Edit Fee
                  </Button>
                </Link>
              </Stack>

              <Divider sx={{ my: 2 }} />

              {/* System Info */}
              <Typography variant="h6" gutterBottom>
                System Information
              </Typography>

              <Stack spacing={1} alignItems="flex-start">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarToday fontSize="small" />
                  <Typography variant="body2">
                    Created: {formatDate(fee.createdAt)}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Update fontSize="small" />
                  <Typography variant="body2">
                    Updated:{" "}
                    {fee.updatedAt ? formatDate(fee.updatedAt) : "Never"}
                  </Typography>
                </Box>

                <Typography variant="body2">
                  Fee ID: {fee.courseFeeId}
                </Typography>
                <Typography variant="body2">
                  Course ID: {fee.courseId}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
}
