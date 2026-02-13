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
  Avatar,
} from "@mui/material";
import {
  Add,
  Refresh,
  Visibility,
  Edit,
  Delete,
  Image as ImageIcon,
} from "@mui/icons-material";
import Link from "next/link";

import { useQuestionOptionViewModel } from "@/lib/features/questionOption/useQuestionOptionViewModel";
import { useDeleteQuestionOptionViewModel } from "@/lib/features/questionOption/useDeleteQuestionOptionViewModel";

import {
  ApiError,
  QuestionOption,
} from "@/lib/features/questionOption/questionOptionTypes";

export default function QuestionOptionsPage() {
  const {
    options,
    isLoading,
    error,
    refetch,
  } = useQuestionOptionViewModel();

  const { handleDelete } = useDeleteQuestionOptionViewModel();

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
        <Typography variant="h4">Question Options</Typography>

        <Stack direction="row" spacing={1}>
          <IconButton onClick={refetch} color="primary">
            <Refresh />
          </IconButton>

          <Link href="/questionOptions/create" passHref>
            <Button variant="contained" startIcon={<Add />}>
              Add Option
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
                <TableCell>Option Text</TableCell>
                <TableCell>Media</TableCell>
                <TableCell>Order</TableCell>
                <TableCell>Correct</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created On</TableCell>
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
              ) : options.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No options found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                options.map((option: QuestionOption) => (
                  <TableRow key={option.optionId} hover>
                    <TableCell>
                      <Typography fontWeight="medium">
                        #{option.optionId}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      {option.questionTitle || `#${option.questionId}`}
                    </TableCell>

                    <TableCell>{option.optionText}</TableCell>

                    <TableCell>
                      {option.optionMediaPath ? (
                        <Avatar
                          src={option.optionMediaPath}
                          variant="rounded"
                          sx={{ width: 40, height: 40 }}
                        />
                      ) : (
                        <ImageIcon color="disabled" />
                      )}
                    </TableCell>

                    <TableCell>{option.optionOrder}</TableCell>

                    <TableCell>
                      <Chip
                        label={option.isCorrect ? "Yes" : "No"}
                        size="small"
                        color={option.isCorrect ? "success" : "default"}
                      />
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={option.isActive ? "Active" : "Inactive"}
                        size="small"
                        color={option.isActive ? "success" : "default"}
                      />
                    </TableCell>

                    <TableCell>
                      {formatDate(option.createdAt)}
                    </TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Link
                          href={`/questionOptions/${option.optionId}`}
                          passHref
                        >
                          <IconButton size="small" color="primary">
                            <Visibility />
                          </IconButton>
                        </Link>

                        <Link
                          href={`/questionOptions/${option.optionId}/edit`}
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
                              option.optionId,
                              option.optionText
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
