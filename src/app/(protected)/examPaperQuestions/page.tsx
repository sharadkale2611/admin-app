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
} from "@mui/material";

import {
  Add,
  Refresh,
  Visibility,
  Edit,
  Delete,
} from "@mui/icons-material";

import Link from "next/link";

import { useExamPaperQuestionViewModel } from "@/lib/features/examPaperQuestion/useExamPaperQuestionViewModel";
import { useDeleteExamPaperQuestion } from "@/lib/features/examPaperQuestion/useDeleteExamPaperQuestionViewModel";

import {
  ExamPaperQuestion,
  ApiError,
} from "@/lib/features/examPaperQuestion/examPaperQuestionTypes";

export default function ExamPaperQuestionsPage() {
  const {
    examPaperQuestions,
    isLoading,
    error,
    refetch,
  } = useExamPaperQuestionViewModel();

  const { handleDelete } = useDeleteExamPaperQuestion();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  function renderErrorContent(error: ApiError | null) {
    if (!error) return null;

    if (error.error) return <div>{error.error}</div>;

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
        <Typography variant="h4">
          Exam Paper Questions
        </Typography>

        <Stack direction="row" spacing={1}>
          <IconButton onClick={refetch} color="primary">
            <Refresh />
          </IconButton>

          <Link href="/examPaperQuestions/create">
            <Button variant="contained" startIcon={<Add />}>
              Add
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
                <TableCell>Exam Paper</TableCell>
                <TableCell>Question</TableCell>
                <TableCell>Marks Override</TableCell>
                <TableCell>Order</TableCell>
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
              ) : examPaperQuestions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No records found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                examPaperQuestions.map((row: ExamPaperQuestion) => (
                  <TableRow key={row.examPaperQuestionId} hover>
                    <TableCell>
                      #{row.examPaperQuestionId}
                    </TableCell>

                    {/* ⭐ NAME INSTEAD OF ID */}
                    <TableCell>
                      {row.examPaperName ?? `#${row.examPaperId}`}
                    </TableCell>

                    <TableCell>
                      {row.questionTitle ?? `#${row.questionId}`}
                    </TableCell>

                    <TableCell>
                      {row.marksOverride ?? "-"}
                    </TableCell>

                    <TableCell>
                      {row.questionOrder ?? "-"}
                    </TableCell>

                    <TableCell>
                      {formatDate(row.createdAt)}
                    </TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Link
                          href={`/examPaperQuestions/${row.examPaperQuestionId}`}
                        >
                          <IconButton size="small" color="primary">
                            <Visibility />
                          </IconButton>
                        </Link>

                        <Link
                          href={`/examPaperQuestions/${row.examPaperQuestionId}/edit`}
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
                              row.examPaperQuestionId,
                              row.questionTitle || "Question"
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
