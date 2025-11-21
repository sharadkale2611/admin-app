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
  Avatar,
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
  Email,
  Phone,
  Person,
  Cake,
  School,
  Event,
  Code,
} from "@mui/icons-material";
import { useStudentDetailsViewModel } from "@/lib/features/student/useStudentDetailsViewModel";

export default function StudentDetails() {
  const { id } = useParams();
  const { student, isLoading, error } = useStudentDetailsViewModel(
    id as string
  );

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Skeleton variant="rectangular" width="100%" height={400} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {/* {error} */}
        </Alert>
        <Link href="/students" passHref>
          <Button startIcon={<ArrowBack />} variant="outlined">
            Back to Students List
          </Button>
        </Link>
      </Container>
    );
  }

  if (!student) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Student not found
        </Alert>
        <Link href="/students" passHref>
          <Button startIcon={<ArrowBack />} variant="outlined">
            Back to Students List
          </Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 4,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Link href="/students" passHref>
            <Button startIcon={<ArrowBack />} variant="outlined" size="small">
              Back
            </Button>
          </Link>
          <Typography variant="h4" component="h1">
            Student Details
          </Typography>
        </Box>
        <Chip
          label={student.isActive ? "Active" : "Inactive"}
          color={student.isActive ? "success" : "error"}
          variant="filled"
        />
      </Box>

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, textAlign: "center" }} elevation={2}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                margin: "auto",
                mb: 2,
                fontSize: "2rem",
                bgcolor: "secondary.main",
              }}
            >
              {student.firstName?.charAt(0)}
              {student.lastName?.charAt(0)}
            </Avatar>

            <Typography variant="h5" gutterBottom>
              {student.firstName} {student.lastName}
            </Typography>

            <Typography variant="body1" color="secondary" gutterBottom>
              {student.studentCode || "No student code"}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Stack spacing={1} alignItems="flex-start">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Email fontSize="small" color="action" />
                <Typography variant="body2">
                  {student.email || "No email"}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Phone fontSize="small" color="action" />
                <Typography variant="body2">
                  {student.mobileNumber || "No phone"}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Person fontSize="small" color="action" />
                <Typography variant="body2">@{student.userName}</Typography>
              </Box>
            </Stack>

            <Box sx={{ mt: 3 }}>
              <Link href={`/students/${id}/edit`} passHref>
                <Button variant="contained" startIcon={<Edit />} fullWidth>
                  Edit Profile
                </Button>
              </Link>
            </Box>
          </Paper>
        </Grid>

        {/* Details Card */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Personal Information
              </Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Code fontSize="small" color="primary" />
                    <Typography variant="subtitle2">Student Code</Typography>
                  </Box>
                  <Typography variant="body1">
                    {student.studentCode || "Not specified"}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Cake fontSize="small" color="primary" />
                    <Typography variant="subtitle2">Date of Birth</Typography>
                  </Box>
                  <Typography variant="body1">
                    {formatDate(student.dateOfBirth)}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Person fontSize="small" color="primary" />
                    <Typography variant="subtitle2">Gender</Typography>
                  </Box>
                  <Typography variant="body1">
                    {student.gender === "M"
                      ? "Male"
                      : student.gender === "F"
                      ? "Female"
                      : student.gender || "Not specified"}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <School fontSize="small" color="primary" />
                    <Typography variant="subtitle2">Status</Typography>
                  </Box>
                  <Typography variant="body1">
                    {student.isActive ? "Active Student" : "Inactive Student"}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                System Information
              </Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Student ID
                  </Typography>
                  <Typography variant="body2">{student.studentId}</Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    User ID
                  </Typography>
                  <Typography variant="body2">{student.userId}</Typography>
                </Grid>

                {student.firmId && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Firm
                    </Typography>
                    <Typography variant="body2">
                      {student.firmName} ({student.firmCode})
                    </Typography>
                  </Grid>
                )}

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Created
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(student.createdAt)}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Last Updated
                  </Typography>
                  <Typography variant="body2">
                    {student.updatedAt
                      ? formatDate(student.updatedAt)
                      : "Never"}
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
