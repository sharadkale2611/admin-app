"use client";

import React from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Box,
  Paper,
  Skeleton,
  Alert,
  Divider,
} from "@mui/material";
import Link from "next/link";
import { ArrowBack, School, Person, Edit } from "@mui/icons-material";
import { useParams } from "next/navigation";
import { useAdmissionDetailsViewModel } from "@/lib/features/admission/useAdmissionDetailsViewModel";
import {
  AdmissionStatus,
  PaymentStatus,
  EnrollmentType,
} from "@/lib/features/admission/admissionTypes";

export default function AdmissionDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const { admission, isLoading, error } = useAdmissionDetailsViewModel(id);

  // Loading
  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Skeleton variant="rectangular" width="100%" height={300} />
      </Container>
    );
  }

  // Error
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          component={Link}
          href="/admissions"
          startIcon={<ArrowBack />}
          variant="outlined"
        >
          Back to Admissions
        </Button>
      </Container>
    );
  }

  // Not Found
  if (!admission) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Admission not found
        </Alert>
        <Button
          component={Link}
          href="/admissions"
          startIcon={<ArrowBack />}
          variant="outlined"
        >
          Back to Admissions
        </Button>
      </Container>
    );
  }

  // Status color
  const statusColor =
    admission.status === AdmissionStatus.Active ? "success" : "error";

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 4,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            component={Link}
            href="/admissions"
            startIcon={<ArrowBack />}
            variant="outlined"
            size="small"
          >
            Back
          </Button>
          <Typography variant="h4">Admission Details</Typography>
        </Box>

        <Chip label={admission.status} color={statusColor} variant="filled" />
      </Box>

      {/* CONTENT */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
        }}
      >
        {/* LEFT PANEL */}
        <Box sx={{ flexBasis: { xs: "100%", md: "30%" } }}>
          <Paper sx={{ p: 3, textAlign: "center" }} elevation={2}>
            <Person
              sx={{
                width: 80,
                height: 80,
                margin: "auto",
                mb: 2,
                color: "primary.main",
              }}
            />

            <Typography variant="h5" gutterBottom>
              {admission.studentName}
            </Typography>

            <Typography variant="body1" color="secondary">
              Student ID: {admission.studentId}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mt: 3 }}>
              <Button
                component={Link}
                href={`/admissions/${admission.admissionId}/edit`}
                variant="contained"
                startIcon={<Edit />}
                fullWidth
              >
                Edit Admission
              </Button>
            </Box>
          </Paper>
        </Box>

        {/* RIGHT PANEL */}
        <Box sx={{ flexBasis: { xs: "100%", md: "70%" } }}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Admission Information
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Course */}
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <School fontSize="small" color="primary" />
                    <Typography variant="subtitle2">Course</Typography>
                  </Box>
                  <Typography variant="body1">
                    {admission.courseName}
                  </Typography>
                </Box>

                {/* Enrollment Type */}
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Enrollment Type
                  </Typography>
                  <Typography variant="body1">
                    {admission.enrollmentType}
                  </Typography>
                </Box>

                {/* Payment Status */}
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Payment Status
                  </Typography>
                  <Typography variant="body1">
                    {admission.paymentStatus}
                  </Typography>
                </Box>

                {/* Amounts */}
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Amounts
                  </Typography>
                  <Typography variant="body1">
                    Total: {admission.totalAmount} | Paid:{" "}
                    {admission.paidAmount} | Final: {admission.finalAmount}
                  </Typography>
                </Box>

                {/* Enrollment Date */}
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Enrollment Date
                  </Typography>
                  <Typography variant="body1">
                    {admission.enrollmentDate}
                  </Typography>
                </Box>

                {/* Admission ID */}
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Admission ID
                  </Typography>
                  <Typography variant="body1">
                    {admission.admissionId}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
}
