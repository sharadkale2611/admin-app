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

import { useQuestionTypeRuleViewModel } from "@/lib/features/questionTypeRule/useQuestionTypeRuleViewModel";
import { useDeleteQuestionTypeRule } from "@/lib/features/questionTypeRule/useDeleteQuestionTypeRuleViewModel";

import {
  ApiError,
  QuestionTypeRule,
} from "@/lib/features/questionTypeRule/questionTypeRuleTypes";

export default function QuestionTypeRulesPage() {
  const {
    questionTypeRules,
    isLoading,
    error,
    refetch,
  } = useQuestionTypeRuleViewModel();

  const { handleDelete } = useDeleteQuestionTypeRule();

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
        <Typography variant="h4">Question Type Rules</Typography>

        <Stack direction="row" spacing={1}>
          <IconButton onClick={refetch} color="primary">
            <Refresh />
          </IconButton>

          <Link href="/questionTypeRules/create" passHref>
            <Button variant="contained" startIcon={<Add />}>
              Add Rule
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
                <TableCell>Rule ID</TableCell>
                <TableCell>Question Type</TableCell>
                <TableCell>Min Options</TableCell>
                <TableCell>Max Options</TableCell>
                <TableCell>Max Selections</TableCell>
                <TableCell>Max Text Length</TableCell>
                <TableCell>Regex Allowed</TableCell>
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
              ) : questionTypeRules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No rules found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                questionTypeRules.map((rule: QuestionTypeRule) => (
                  <TableRow key={rule.ruleId} hover>
                    <TableCell>
                      <Typography fontWeight="medium">
                        #{rule.ruleId}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      {rule.questionType?.name || "-"}
                    </TableCell>

                    <TableCell>
                      {rule.minOptions ?? "-"}
                    </TableCell>

                    <TableCell>
                      {rule.maxOptions ?? "-"}
                    </TableCell>

                    <TableCell>
                      {rule.maxSelections ?? "-"}
                    </TableCell>

                    <TableCell>
                      {rule.maxTextLength ?? "-"}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={
                          rule.isRegexAnswerAllowed
                            ? "Allowed"
                            : "Not Allowed"
                        }
                        size="small"
                        color={
                          rule.isRegexAnswerAllowed
                            ? "success"
                            : "default"
                        }
                      />
                    </TableCell>

                    <TableCell>
                      {formatDate(rule.createdAt)}
                    </TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Link
                          href={`/questionTypeRules/${rule.ruleId}`}
                          passHref
                        >
                          <IconButton size="small" color="primary">
                            <Visibility />
                          </IconButton>
                        </Link>

                        <Link
                          href={`/questionTypeRules/${rule.ruleId}/edit`}
                          passHref
                        >
                          <IconButton size="small" color="secondary">
                            <Edit />
                          </IconButton>
                        </Link>

                        {/* Uncomment to enable delete */}
                        {/* <IconButton
                          size="small"
                          color="error"
                          onClick={async () => {
                            const success = await handleDelete(
                              rule.ruleId,
                              `Rule #${rule.ruleId}`
                            );
                            if (success) refetch();
                          }}
                        >
                          <Delete />
                        </IconButton> */}
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
