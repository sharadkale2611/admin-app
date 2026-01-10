"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
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
  Delete,
  Event,
  Info,
  Group,
  Assignment as AssignmentIcon,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";

import { useStudentBatchAssignmentDetailsViewModel } from "@/lib/features/studentBatchAssignment/useStudentBatchAssignmentDetailsViewModel";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { useDeleteStudentBatchAssignment } from "@/lib/features/studentBatchAssignment/useDeleteStudentBatchAssignment";


export default function StudentBatchAssignmentDetails() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { assignment, isLoading, error } =
    useStudentBatchAssignmentDetailsViewModel(id as any);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Not specified";
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return "Not specified";
    return d.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };



const { handleDelete } = useDeleteStudentBatchAssignment();

const handleDeleteClick = async () => {
  if (!assignment) return;

  const success = await handleDelete(
    assignment.studentBatchAssignmentId,
    assignment.studentName ?? "Student"
  );

  if (success) {
    router.push("/studentBatchAssignments");
  }
};


  // ------------------------------
  // Loading state
  // ------------------------------
  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Skeleton variant="rectangular" width="100%" height={260} />
      </Container>
    );
  }

  // ------------------------------
  // Error state
  // ------------------------------
  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>

        <Link href="/studentBatchAssignments" passHref>
          <Button startIcon={<ArrowBack />} variant="outlined">
            Back to Assignments List
          </Button>
        </Link>
      </Container>
    );
  }

  // ------------------------------
  // Not found
  // ------------------------------
  if (!assignment) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Assignment not found
        </Alert>
        <Link href="/studentBatchAssignments" passHref>
          <Button startIcon={<ArrowBack />} variant="outlined">
            Back to Assignments List
          </Button>
        </Link>
      </Container>
    );
  }

  // ------------------------------
  // MAIN RENDER
  // ------------------------------
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Link href="/studentBatchAssignments" passHref>
            <Button startIcon={<ArrowBack />} variant="outlined" size="small">
              Back
            </Button>
          </Link>
          <Typography variant="h5" component="h1">
            Student Batch Assignment Details
          </Typography>
        </Box>

        <Chip
          label={assignment.isActive ? "Active" : "Inactive"}
          color={assignment.isActive ? "success" : "error"}
          variant="filled"
        />
      </Box>

      <Grid container spacing={3}>
        {/* Left: Main Assignment Info */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Assignment Information
              </Typography>

              <Divider sx={{ mb: 2 }} />

              {/* Label / Value Rows */}
              <Stack spacing={2}>
                {/* Student Name */}
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Group fontSize="small" color="primary" />
                    <Typography variant="subtitle2">Student Name</Typography>
                  </Box>
                  <Typography variant="body1" textAlign="right">
                    {assignment.studentName || "N/A"}
                  </Typography>
                </Box>

                {/* Enrollment Id */}
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AssignmentIcon fontSize="small" color="primary" />
                    <Typography variant="subtitle2">Enrollment</Typography>
                  </Box>
                  <Typography variant="body1" textAlign="right">
                    #{assignment.studentEnrollmentId}
                  </Typography>
                </Box>

                {/* Batch */}
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AssignmentIcon fontSize="small" color="primary" />
                    <Typography variant="subtitle2">Batch</Typography>
                  </Box>
                  <Typography variant="body1" textAlign="right">
                    {assignment.batchCode
                      ? `${assignment.batchCode} (ID: ${assignment.batchId})`
                      : `#${assignment.batchId}`}
                  </Typography>
                </Box>

                {/* Assignment Date */}
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Event fontSize="small" color="primary" />
                    <Typography variant="subtitle2">Assignment Date</Typography>
                  </Box>
                  <Typography variant="body1" textAlign="right">
                    {formatDate(assignment.assignmentDate as any)}
                  </Typography>
                </Box>

                {/* Type */}
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Info fontSize="small" color="primary" />
                    <Typography variant="subtitle2">Type</Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    textAlign="right"
                    sx={{ textTransform: "capitalize" }}
                  >
                    {assignment.assignmentType || "N/A"}
                  </Typography>
                </Box>

                {/* Remark */}
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Info fontSize="small" color="primary" />
                    <Typography variant="subtitle2">Remark</Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    textAlign="right"
                    sx={{ whiteSpace: "pre-wrap" }}
                  >
                    {assignment.remark && assignment.remark.trim() !== ""
                      ? assignment.remark
                      : "-"}
                  </Typography>
                </Box>

                {/* Active */}
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {assignment.isActive ? (
                      <CheckCircle fontSize="small" color="success" />
                    ) : (
                      <Cancel fontSize="small" color="error" />
                    )}
                    <Typography variant="subtitle2">Active</Typography>
                  </Box>
                  <Typography variant="body1" textAlign="right">
                    {assignment.isActive ? "Yes" : "No"}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Right: System Info + Actions */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3 }} elevation={2}>
            <Typography variant="h6" gutterBottom>
              System Info
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={1.5}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Assignment ID
                </Typography>
                <Typography variant="body2">
                  {assignment.studentBatchAssignmentId}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Created At
                </Typography>
                <Typography variant="body2">
                  {formatDate(assignment.createdAt as any)}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Last Updated
                </Typography>
                <Typography variant="body2">
                  {assignment.updatedAt
                    ? formatDate(assignment.updatedAt as any)
                    : "Never"}
                </Typography>
              </Box>
            </Stack>

            {/* Buttons */}
            <Box
              sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 1 }}
            >
              {/* Edit */}
              <Link
                href={`/studentBatchAssignments/${assignment.studentBatchAssignmentId}/edit`}
                passHref
              >
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  fullWidth
                  size="small"
                >
                  Edit
                </Button>
              </Link>

              {/* Delete */}
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                fullWidth
                size="small"
                onClick={handleDeleteClick}
              >
                Delete
              </Button>

              {/* Back */}
              <Link href="/studentBatchAssignments" passHref>
                <Button
                  variant="text"
                  startIcon={<ArrowBack />}
                  fullWidth
                  size="small"
                  sx={{ mt: 1 }}
                >
                  Back to List
                </Button>
              </Link>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
