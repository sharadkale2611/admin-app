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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Add, Refresh, Visibility, Edit, Delete } from "@mui/icons-material";
import Link from "next/link";

import { useQuestionTypeViewModel } from "@/lib/features/questionType/useQuestionTypeViewModel";
import { useDeleteQuestionType } from "@/lib/features/questionType/useDeleteQuestionTypeViewModel";

import { ApiError, QuestionType } from "@/lib/features/questionType/questionTypeTypes";

export default function QuestionTypesPage() {
  const { questionTypes, isLoading, error, refetch } = useQuestionTypeViewModel();
  const { handleDelete } = useDeleteQuestionType();

  // ✅ Filters
  const [codeSearch, setCodeSearch] = React.useState("");
  const [evaluationModeFilter, setEvaluationModeFilter] = React.useState<string>("");

  const evaluationModes = React.useMemo(() => {
    const set = new Set<string>();
    questionTypes.forEach((qt) => {
      if (qt.evaluationMode) set.add(String(qt.evaluationMode));
    });
    return Array.from(set.values()).sort();
  }, [questionTypes]);

  const filteredQuestionTypes = React.useMemo(() => {
    const term = codeSearch.trim().toLowerCase();

    return questionTypes.filter((qt) => {
      if (evaluationModeFilter && String(qt.evaluationMode) !== evaluationModeFilter) return false;
      if (term && !(qt.code ?? "").toLowerCase().includes(term)) return false;
      return true;
    });
  }, [questionTypes, codeSearch, evaluationModeFilter]);

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

    if (Array.isArray(error.errors)) {
      return error.errors.map((e, i) => (
        <div key={i}>{typeof e === "string" ? e : JSON.stringify(e)}</div>
      ));
    }

    return null;
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4">Question Types</Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton onClick={refetch} color="primary">
            <Refresh />
          </IconButton>

          <Link href="/questionTypes/create" passHref>
            <Button variant="contained" startIcon={<Add />}>
              Add Question Type
            </Button>
          </Link>
        </Stack>
      </Box>

      {/* ✅ Filter Bar (Code + Evaluation Mode) */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <TextField
            size="small"
            label="Search Code"
            value={codeSearch}
            onChange={(e) => setCodeSearch(e.target.value)}
          />

          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel>Evaluation Mode</InputLabel>
            <Select
              value={evaluationModeFilter}
              label="Evaluation Mode"
              onChange={(e) => setEvaluationModeFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {evaluationModes.map((m) => (
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Paper>

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
                <TableCell>Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Evaluation Mode</TableCell>
                <TableCell>Options</TableCell>
                <TableCell>Attachments</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created On</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading ? (
                Array.from(new Array(5)).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from(new Array(8)).map((__, j) => (
                      <TableCell key={j}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filteredQuestionTypes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No question types found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredQuestionTypes.map((qt: QuestionType) => (
                  <TableRow key={qt.questionTypeId} hover>
                    <TableCell>
                      <Typography fontWeight="medium">{qt.code}</Typography>
                    </TableCell>

                    <TableCell>{qt.name}</TableCell>

                    <TableCell>
                      <Chip
                        label={qt.evaluationMode}
                        size="small"
                        color={
                          qt.evaluationMode === "AUTO"
                            ? "success"
                            : qt.evaluationMode === "MANUAL"
                            ? "warning"
                            : "info"
                        }
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={qt.supportsOptions ? "Yes" : "No"}
                        size="small"
                        color={qt.supportsOptions ? "success" : "default"}
                      />
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={qt.supportsAttachments ? "Yes" : "No"}
                        size="small"
                        color={qt.supportsAttachments ? "success" : "default"}
                      />
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={qt.isActive ? "Active" : "Inactive"}
                        size="small"
                        color={qt.isActive ? "success" : "default"}
                      />
                    </TableCell>

                    <TableCell>{formatDate(qt.createdAt)}</TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Link href={`/questionTypes/${qt.questionTypeId}`} passHref>
                          <IconButton size="small" color="primary">
                            <Visibility />
                          </IconButton>
                        </Link>

                        <Link href={`/questionTypes/${qt.questionTypeId}/edit`} passHref>
                          <IconButton size="small" color="secondary">
                            <Edit />
                          </IconButton>
                        </Link>

                        {/* Uncomment if you want delete enabled */}
                        
                        {/* <IconButton
                          size="small"
                          color="error"
                          onClick={async () => {
                            const success = await handleDelete(
                              qt.questionTypeId,
                              qt.name
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
