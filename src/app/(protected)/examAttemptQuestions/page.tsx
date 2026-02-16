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

import { useExamAttemptQuestionViewModel } from "@/lib/features/examAttemptQuestion/useExamAttemptQuestionViewModel";
import { useDeleteExamAttemptQuestionViewModel } from "@/lib/features/examAttemptQuestion/useDeleteExamAttemptQuestionViewModel";

import {
  ApiError,
  ExamAttemptQuestion,
} from "@/lib/features/examAttemptQuestion/examAttemptQuestionTypes";

export default function ExamAttemptQuestionsPage() {
  const {
    attemptQuestions,
    isLoading,
    error,
    refetch,
  } = useExamAttemptQuestionViewModel();

  const { handleDelete } =
    useDeleteExamAttemptQuestionViewModel();

  const formatMarks = (marks?: number | null) => {
    if (marks === null || marks === undefined)
      return "—";

    return marks.toFixed(2);
  };

  function renderErrorContent(error: ApiError | null) {
    if (!error) return null;

    if (error.error) {
      return <div>{error.error}</div>;
    }

    if (error.errors && typeof error.errors === "object") {
      return Object.entries(error.errors).map(
        ([key, value], i) => (
          <div key={i}>
            <strong>{key}:</strong>{" "}
            {Array.isArray(value)
              ? value.join(", ")
              : value}
          </div>
        )
      );
    }

    return null;
  }

  const getEvaluationChip = (isEvaluated: boolean) => {
    return isEvaluated ? (
      <Chip
        label="Evaluated"
        color="success"
        size="small"
      />
    ) : (
      <Chip
        label="Pending"
        color="warning"
        size="small"
      />
    );
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
          Exam Attempt Questions
        </Typography>

        <Stack direction="row" spacing={1}>
          <IconButton
            onClick={refetch}
            color="primary"
          >
            <Refresh />
          </IconButton>

          <Link
            href="/examAttemptQuestions/create"
            passHref
          >
            <Button
              variant="contained"
              startIcon={<Add />}
            >
              Add Question
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

                <TableCell>Attempt ID</TableCell>

                <TableCell>Question</TableCell>

                <TableCell>Type</TableCell>

                <TableCell>Assigned Marks</TableCell>

                <TableCell>Max Marks</TableCell>

                <TableCell>Status</TableCell>

                <TableCell>Actions</TableCell>

              </TableRow>
            </TableHead>

            <TableBody>

              {isLoading ? (

                Array.from(new Array(5)).map(
                  (_, i) => (
                    <TableRow key={i}>
                      {Array.from(
                        new Array(8)
                      ).map((__, j) => (
                        <TableCell key={j}>
                          <Skeleton variant="text" />
                        </TableCell>
                      ))}
                    </TableRow>
                  )
                )

              ) : attemptQuestions.length === 0 ? (

                <TableRow>

                  <TableCell
                    colSpan={8}
                    align="center"
                    sx={{ py: 4 }}
                  >
                    <Typography color="text.secondary">
                      No attempt questions found
                    </Typography>
                  </TableCell>

                </TableRow>

              ) : (

                attemptQuestions.map(
                  (
                    item: ExamAttemptQuestion
                  ) => (

                    <TableRow
                      key={
                        item.attemptQuestionId
                      }
                      hover
                    >

                      <TableCell>
                        <Typography fontWeight="medium">
                          #
                          {
                            item.attemptQuestionId
                          }
                        </Typography>
                      </TableCell>

                      <TableCell>
                        #
                        {
                          item.examAttemptId
                        }
                      </TableCell>

                      <TableCell>
                        {item.questionTitle ||
                          `#${item.questionId}`}
                      </TableCell>

                      <TableCell>
                        {item.questionTypeName ||
                          `#${item.questionTypeId}`}
                      </TableCell>

                      <TableCell>
                        {formatMarks(
                          item.marksAssigned
                        )}
                      </TableCell>

                      <TableCell>
                        {formatMarks(
                          item.maxMarks
                        )}
                      </TableCell>

                      <TableCell>
                        {getEvaluationChip(
                          item.isEvaluated
                        )}
                      </TableCell>

                      <TableCell>

                        <Stack
                          direction="row"
                          spacing={1}
                        >

                          <Link
                            href={`/examAttemptQuestions/${item.attemptQuestionId}`}
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
                            href={`/examAttemptQuestions/${item.attemptQuestionId}/edit`}
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
                                  item.attemptQuestionId,
                                  item.questionTitle ||
                                    `Question #${item.questionId}`
                                );

                              if (success)
                                refetch();
                            }}
                          >
                            <Delete />
                          </IconButton>

                        </Stack>

                      </TableCell>

                    </TableRow>

                  )
                )

              )}

            </TableBody>

          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}
