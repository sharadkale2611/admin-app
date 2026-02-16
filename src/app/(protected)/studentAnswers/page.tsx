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

import { useStudentAnswerViewModel } from "@/lib/features/studentAnswer/useStudentAnswerViewModel";
import { useDeleteStudentAnswerViewModel } from "@/lib/features/studentAnswer/useDeleteStudentAnswerViewModel";

import {
  ApiError,
  StudentAnswer,
} from "@/lib/features/studentAnswer/studentAnswerTypes";

export default function StudentAnswersPage() {
  const {
    studentAnswers,
    isLoading,
    error,
    refetch,
  } = useStudentAnswerViewModel();

  const { handleDelete } =
    useDeleteStudentAnswerViewModel();

  const formatScore = (score?: number | null) => {
    if (score === null || score === undefined)
      return "—";

    return score.toFixed(2);
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

  const getEvaluationChip = (
    isCorrect?: boolean | null
  ) => {
    if (isCorrect === true) {
      return (
        <Chip
          label="Correct"
          color="success"
          size="small"
        />
      );
    }

    if (isCorrect === false) {
      return (
        <Chip
          label="Incorrect"
          color="error"
          size="small"
        />
      );
    }

    return (
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
          Student Answers
        </Typography>

        <Stack direction="row" spacing={1}>

          <IconButton
            onClick={refetch}
            color="primary"
          >
            <Refresh />
          </IconButton>

          <Link
            href="/studentAnswers/create"
            passHref
          >
            <Button
              variant="contained"
              startIcon={<Add />}
            >
              Add Answer
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

                <TableCell>Attempt Question</TableCell>

                <TableCell>Answer</TableCell>

                <TableCell>File</TableCell>

                <TableCell>Score</TableCell>

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
                        new Array(7)
                      ).map((__, j) => (
                        <TableCell key={j}>
                          <Skeleton variant="text" />
                        </TableCell>
                      ))}
                    </TableRow>
                  )
                )

              ) : studentAnswers.length === 0 ? (

                <TableRow>

                  <TableCell
                    colSpan={7}
                    align="center"
                    sx={{ py: 4 }}
                  >

                    <Typography color="text.secondary">
                      No student answers found
                    </Typography>

                  </TableCell>

                </TableRow>

              ) : (

                studentAnswers.map(
                  (item: StudentAnswer) => (

                    <TableRow
                      key={
                        item.studentAnswerId
                      }
                      hover
                    >

                      <TableCell>

                        <Typography fontWeight="medium">

                          #
                          {
                            item.studentAnswerId
                          }

                        </Typography>

                      </TableCell>

                      <TableCell>

                        #
                        {
                          item.attemptQuestionId
                        }

                      </TableCell>

                      <TableCell>

                        {item.answerText ||
                          "—"}

                      </TableCell>

                      <TableCell>

                        {item.uploadedFilePath ? (

                          <Link
                            href={
                              item.uploadedFilePath
                            }
                            target="_blank"
                          >
                            View File
                          </Link>

                        ) : (

                          "—"

                        )}

                      </TableCell>

                      <TableCell>

                        {formatScore(
                          item.score
                        )}

                      </TableCell>

                      <TableCell>

                        {getEvaluationChip(
                          item.isCorrect
                        )}

                      </TableCell>

                      <TableCell>

                        <Stack
                          direction="row"
                          spacing={1}
                        >

                          <Link
                            href={`/studentAnswers/${item.studentAnswerId}`}
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
                            href={`/studentAnswers/${item.studentAnswerId}/edit`}
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
                                  item.studentAnswerId,
                                  item.answerText ||
                                    `Answer #${item.studentAnswerId}`
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
