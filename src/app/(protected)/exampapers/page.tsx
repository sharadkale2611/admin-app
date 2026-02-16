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

import { useExamPaperViewModel } from "@/lib/features/exampaper/useExamPaperViewModel";
import { useDeleteExamPaper } from "@/lib/features/exampaper/useDeleteExamPaperViewModel";

import { ApiError, ExamPaper } from "@/lib/features/exampaper/examPaperTypes";

export default function ExamPapersPage() {
  const {
    examPapers,
    isLoading,
    error,
    refetch,
  } = useExamPaperViewModel();

  const { handleDelete } = useDeleteExamPaper();

  const formatDate = (dateString: string) => {
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

    if (error.errors) {
      return Object.entries(error.errors).map(([k, v]) =>
        v.map((msg, i) => <div key={`${k}-${i}`}>{msg}</div>)
      );
    }

    return null;
  }

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
        <Typography variant="h4">Exam Papers</Typography>

        <Stack direction="row" spacing={1}>
          <IconButton onClick={refetch} color="primary">
            <Refresh />
          </IconButton>

          <Link href="/exampapers/create" passHref>
            <Button variant="contained" startIcon={<Add />}>
              Add Exam Paper
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
                <TableCell>Name</TableCell>
                <TableCell>Total Marks</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Shuffle</TableCell>
                <TableCell>Created On</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading ? (
                Array.from(new Array(5)).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from(new Array(7)).map((__, j) => (
                      <TableCell key={j}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : examPapers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No exam papers found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                examPapers.map((paper: ExamPaper) => (
                  <TableRow key={paper.examPaperId} hover>
                    <TableCell>
                      <Typography fontWeight="medium">
                        #{paper.examPaperId}
                      </Typography>
                    </TableCell>

                    <TableCell>{paper.name}</TableCell>

                    <TableCell>{paper.totalMarks}</TableCell>

                    <TableCell>
                      {paper.durationMinutes} min
                    </TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Chip
                          size="small"
                          label={
                            paper.shuffleQuestions
                              ? "Q Shuffle"
                              : "No Q Shuffle"
                          }
                          color={
                            paper.shuffleQuestions
                              ? "success"
                              : "default"
                          }
                        />
                        <Chip
                          size="small"
                          label={
                            paper.shuffleOptions
                              ? "Opt Shuffle"
                              : "No Opt Shuffle"
                          }
                          color={
                            paper.shuffleOptions
                              ? "success"
                              : "default"
                          }
                        />
                      </Stack>
                    </TableCell>

                    <TableCell>
                      {formatDate(paper.createdAt)}
                    </TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Link
                          href={`/exampapers/${paper.examPaperId}`}
                        >
                          <IconButton size="small" color="primary">
                            <Visibility />
                          </IconButton>
                        </Link>

                        <Link
                          href={`/exampapers/${paper.examPaperId}/edit`}
                        >
                          <IconButton size="small" color="secondary">
                            <Edit />
                          </IconButton>
                        </Link>

                        <IconButton
                          size="small"
                          color="error"
                          onClick={async () => {
                            const success = await handleDelete(
                              paper.examPaperId,
                              paper.name
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
