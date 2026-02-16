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

import { useQuestionAnswerViewModel } from "@/lib/features/questionAnswer/useQuestionAnswerViewModel";
import { useDeleteQuestionAnswerViewModel } from "@/lib/features/questionAnswer/useDeleteQuestionAnswerViewModel";

import {
  ApiError,
  QuestionAnswer,
} from "@/lib/features/questionAnswer/questionAnswerTypes";

export default function QuestionAnswersPage() {
  const { answers, isLoading, error, refetch } =
    useQuestionAnswerViewModel();

  const { handleDelete } = useDeleteQuestionAnswerViewModel();

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

  const getAnswerPreview = (answer: QuestionAnswer) => {
    if (answer.answerText) {
      return answer.answerText.length > 40
        ? answer.answerText.substring(0, 40) + "..."
        : answer.answerText;
    }

    if (answer.answerRegex) {
      return `Regex: ${answer.answerRegex}`;
    }

    return "—";
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
        <Typography variant="h4">Question Answers</Typography>

        <Stack direction="row" spacing={1}>
          <IconButton onClick={refetch} color="primary">
            <Refresh />
          </IconButton>

          <Link href="/questionAnswers/create" passHref>
            <Button variant="contained" startIcon={<Add />}>
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
                <TableCell>Question</TableCell>
                <TableCell>Answer Preview</TableCell>
                <TableCell>Max Score</TableCell>
                <TableCell>Status</TableCell>
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
              ) : answers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No answers found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                answers.map((answer: QuestionAnswer) => (
                  <TableRow
                    key={answer.questionAnswerId}
                    hover
                  >
                    <TableCell>
                      <Typography fontWeight="medium">
                        #{answer.questionAnswerId}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      {answer.questionTitle ||
                        `#${answer.questionId}`}
                    </TableCell>

                    <TableCell>
                      {getAnswerPreview(answer)}
                    </TableCell>

                    <TableCell>
                      <Typography fontWeight="medium">
                        {answer.maxScore}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={
                          answer.isActive
                            ? "Active"
                            : "Inactive"
                        }
                        size="small"
                        color={
                          answer.isActive
                            ? "success"
                            : "default"
                        }
                      />
                    </TableCell>

                    <TableCell>
                      {formatDate(answer.createdAt)}
                    </TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Link
                          href={`/questionAnswers/${answer.questionAnswerId}`}
                          passHref
                        >
                          <IconButton size="small" color="primary">
                            <Visibility />
                          </IconButton>
                        </Link>

                        <Link
                          href={`/questionAnswers/${answer.questionAnswerId}/edit`}
                          passHref
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
                              answer.questionAnswerId,
                              answer.answerText ||
                                `Answer #${answer.questionAnswerId}`
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
