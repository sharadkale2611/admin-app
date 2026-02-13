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

import { useQuestionViewModel } from "@/lib/features/question/useQuestionViewModel";
import { useDeleteQuestion } from "@/lib/features/question/useDeleteQuestionViewModel";

import {
  ApiError,
  Question,
} from "@/lib/features/question/questionTypes";

export default function QuestionsPage() {
  const {
    questions,
    isLoading,
    error,
    refetch,
  } = useQuestionViewModel();

  const { handleDelete } = useDeleteQuestion();

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

    if (Array.isArray(error.errors)) {
      return error.errors.map((e, i) => (
        <div key={i}>
          {typeof e === "string" ? e : JSON.stringify(e)}
        </div>
      ));
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
        <Typography variant="h4">Questions</Typography>

        <Stack direction="row" spacing={1}>
          <IconButton onClick={refetch} color="primary">
            <Refresh />
          </IconButton>

          <Link href="/questions/create" passHref>
            <Button variant="contained" startIcon={<Add />}>
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
                <TableCell>Title</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Module</TableCell>
                <TableCell>Marks</TableCell>
                <TableCell>Difficulty</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created On</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading ? (
                Array.from(new Array(5)).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from(new Array(10)).map((__, j) => (
                      <TableCell key={j}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : questions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No questions found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                questions.map((question: Question) => (
                  <TableRow key={question.questionId} hover>
                    <TableCell>
                      <Typography fontWeight="medium">
                        #{question.questionId}
                      </Typography>
                    </TableCell>

                    <TableCell>{question.title}</TableCell>

                    <TableCell>
                      {question.questionTypeName || "-"}
                    </TableCell>

                    <TableCell>
                      {question.courseName || "-"}
                    </TableCell>

                    <TableCell>
                      {question.moduleName || "-"}
                    </TableCell>

                    <TableCell>{question.marks}</TableCell>

                    <TableCell>
                      <Chip
                        label={question.difficultyLevel}
                        size="small"
                        color={
                          question.difficultyLevel === "EASY"
                            ? "success"
                            : question.difficultyLevel === "MEDIUM"
                            ? "warning"
                            : "error"
                        }
                      />
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={
                          question.isActive ? "Active" : "Inactive"
                        }
                        size="small"
                        color={
                          question.isActive ? "success" : "default"
                        }
                      />
                    </TableCell>

                    <TableCell>
                      {formatDate(question.createdAt)}
                    </TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Link
                          href={`/questions/${question.questionId}`}
                          passHref
                        >
                          <IconButton size="small" color="primary">
                            <Visibility />
                          </IconButton>
                        </Link>

                        <Link
                          href={`/questions/${question.questionId}/edit`}
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
                              question.questionId,
                              question.title
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
