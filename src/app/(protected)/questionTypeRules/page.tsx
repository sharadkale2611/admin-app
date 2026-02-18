"use client";

import React, { useMemo, useState } from "react";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import {
  Add,
  Refresh,
  Visibility,
  Edit,
} from "@mui/icons-material";

import Link from "next/link";

import { useQuestionTypeRuleViewModel } from "@/lib/features/questionTypeRule/useQuestionTypeRuleViewModel";

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

  /* ==========================
     Filter State (NUMBER SAFE)
  ========================== */
  const [selectedType, setSelectedType] =
    useState<number | "">("");

  /* ==========================
     Unique Question Types
  ========================== */
  const questionTypes = useMemo(() => {
    const map = new Map<number, string>();

    questionTypeRules.forEach((r) => {
      if (r.questionType) {
        map.set(
          r.questionType.questionTypeId,
          r.questionType.name
        );
      }
    });

    return Array.from(map.entries()).map(([id, name]) => ({
      id,
      name,
    }));
  }, [questionTypeRules]);

  /* ==========================
     Filtered Rules
  ========================== */
  const filteredRules = useMemo(() => {
    return questionTypeRules.filter((rule) => {
      if (
        selectedType !== "" &&
        rule.questionType?.questionTypeId !== selectedType
      ) {
        return false;
      }
      return true;
    });
  }, [questionTypeRules, selectedType]);

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
          {typeof e === "string"
            ? e
            : JSON.stringify(e)}
        </div>
      ));
    }

    return null;
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* ================= HEADER ================= */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">
          Question Type Rules
        </Typography>

        <Stack direction="row" spacing={1}>
          <IconButton onClick={refetch} color="primary">
            <Refresh />
          </IconButton>

          <Link href="/questionTypeRules/create">
            <Button
              variant="contained"
              startIcon={<Add />}
            >
              Add Rule
            </Button>
          </Link>
        </Stack>
      </Box>

      {/* ================= ERROR ================= */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {renderErrorContent(error)}
        </Alert>
      )}

      {/* ================= FILTER BAR ================= */}
      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 250 }}>
          <InputLabel>Question Type</InputLabel>

          <Select<number | "">
            value={selectedType}
            label="Question Type"
            onChange={(e) => {
              const value = e.target.value;
              setSelectedType(
                value === "" ? "" : Number(value)
              );
            }}
          >
            <MenuItem value="">All</MenuItem>

            {questionTypes.map((qt) => (
              <MenuItem key={qt.id} value={qt.id}>
                {qt.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {/* ================= TABLE ================= */}
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
                    {Array.from(new Array(9)).map(
                      (__, j) => (
                        <TableCell key={j}>
                          <Skeleton variant="text" />
                        </TableCell>
                      )
                    )}
                  </TableRow>
                ))
              ) : filteredRules.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    align="center"
                    sx={{ py: 4 }}
                  >
                    <Typography color="text.secondary">
                      No rules found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRules.map(
                  (rule: QuestionTypeRule) => (
                    <TableRow key={rule.ruleId} hover>
                      <TableCell>
                        #{rule.ruleId}
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
                          >
                            <IconButton size="small">
                              <Visibility />
                            </IconButton>
                          </Link>

                          <Link
                            href={`/questionTypeRules/${rule.ruleId}/edit`}
                          >
                            <IconButton size="small">
                              <Edit />
                            </IconButton>
                          </Link>
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
