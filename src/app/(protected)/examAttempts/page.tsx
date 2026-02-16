"use client";

import React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Alert,
  Skeleton,
  Stack,
  Chip,
} from "@mui/material";

import {
  Add,
  Refresh,
  Visibility,
  Edit,
  Delete,
} from "@mui/icons-material";

import Link from "next/link";

import { useExamAttemptViewModel } from "@/lib/features/examAttempt/useExamAttemptViewModel";
import { useDeleteExamAttemptViewModel } from "@/lib/features/examAttempt/useDeleteExamAttemptViewModel";

import {
  ApiError,
  ExamAttempt,
} from "@/lib/features/examAttempt/examAttemptTypes";

export default function ExamAttemptsPage() {
  const { attempts, isLoading, error, refetch } =
    useExamAttemptViewModel();

  const { handleDelete } = useDeleteExamAttemptViewModel();

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "—";

    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  function renderErrorContent(error: ApiError | null) {
    if (!error) return null;

    if (error.error) {
      return <div>{error.error}</div>;
    }

    if (error.errors && typeof error.errors === "object") {
      return Object.entries(error.errors).map(([key, value], i) => (
        <div key={i}>
          <strong>{key}:</strong>{" "}
          {Array.isArray(value) ? value.join(", ") : value}
        </div>
      ));
    }

    return null;
  }

  const getStatusChip = (status: string) => {
    switch (status) {
      case "IN_PROGRESS":
        return <Chip label="In Progress" color="warning" size="small" />;

      case "SUBMITTED":
        return <Chip label="Submitted" color="info" size="small" />;

      case "EVALUATED":
        return <Chip label="Evaluated" color="success" size="small" />;

      default:
        return <Chip label={status} size="small" />;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">
          Exam Attempts
        </Typography>

        <Stack direction="row" spacing={1}>
          <IconButton onClick={refetch} color="primary">
            <Refresh />
          </IconButton>

          <Link href="/examAttempts/create" passHref>
            <Button
              variant="contained"
              startIcon={<Add />}
            >
              Start Exam
            </Button>
          </Link>
        </Stack>
      </Box>

      {/* Error */}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {renderErrorContent(error)}
        </Alert>
      )}

      {/* Table */}

      <Paper elevation={2}>
        <TableContainer>
          <Table>

            <TableHead>
              <TableRow>

                <TableCell>ID</TableCell>

                <TableCell>Student</TableCell>

                <TableCell>Exam Paper</TableCell>

                <TableCell>Attempt No</TableCell>

                <TableCell>Status</TableCell>

                <TableCell>Score</TableCell>

                <TableCell>Started</TableCell>

                <TableCell>Submitted</TableCell>

                <TableCell>Actions</TableCell>

              </TableRow>
            </TableHead>

            <TableBody>

              {isLoading ? (
                Array.from(new Array(5)).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from(new Array(9)).map((__, j) => (
                      <TableCell key={j}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : attempts.length === 0 ? (

                <TableRow>

                  <TableCell
                    colSpan={9}
                    align="center"
                    sx={{ py: 4 }}
                  >
                    <Typography color="text.secondary">
                      No exam attempts found
                    </Typography>
                  </TableCell>

                </TableRow>

              ) : (

                attempts.map((attempt: ExamAttempt) => (

                  <TableRow
                    key={attempt.examAttemptId}
                    hover
                  >

                    <TableCell>
                      <Typography fontWeight="medium">
                        #{attempt.examAttemptId}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      {attempt.studentName ||
                        `#${attempt.studentId}`}
                    </TableCell>

                    <TableCell>
                      {attempt.examPaperName ||
                        `#${attempt.examPaperId}`}
                    </TableCell>

                    <TableCell>
                      Attempt {attempt.attemptNo}
                    </TableCell>

                    <TableCell>
                      {getStatusChip(attempt.status)}
                    </TableCell>

                    <TableCell>
                      {attempt.totalScore ?? "—"}
                    </TableCell>

                    <TableCell>
                      {formatDate(attempt.startedAt)}
                    </TableCell>

                    <TableCell>
                      {formatDate(attempt.submittedAt)}
                    </TableCell>

                    <TableCell>

                      <Stack direction="row" spacing={1}>

                        <Link
                          href={`/examAttempts/${attempt.examAttemptId}`}
                          passHref
                        >
                          <IconButton
                            size="small"
                            color="primary"
                          >
                            <Visibility />
                          </IconButton>
                        </Link>

                        <Link
                          href={`/examAttempts/${attempt.examAttemptId}/edit`}
                          passHref
                        >
                          <IconButton
                            size="small"
                            color="secondary"
                          >
                            <Edit />
                          </IconButton>
                        </Link>

                        <IconButton
                          size="small"
                          color="error"
                          onClick={async () => {

                            const success =
                              await handleDelete(
                                attempt.examAttemptId,
                                `${attempt.studentName} - Attempt ${attempt.attemptNo}`
                              );

                            if (success) refetch();
                          }}
                        >
                          <Delete />
                        </IconButton>

                      </Stack>

                    </TableCell>

                  </TableRow>

                ))

              )}

            </TableBody>

          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}
