"use client";

import React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  IconButton,
  Alert,
  Skeleton,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";

import { Add, Refresh } from "@mui/icons-material";
import Link from "next/link";

import { useQuestionViewModel } from "@/lib/features/question/useQuestionViewModel";
import { useDeleteQuestion } from "@/lib/features/question/useDeleteQuestionViewModel";
import useCreateQuestionViewModel from "@/lib/features/question/useCreateQuestionViewModel";

import { ApiError } from "@/lib/features/question/questionTypes";

import QuestionRenderer from "./_components/QuestionRenderer";

export default function QuestionsPage() {
  const { questions, isLoading, error, refetch } =
    useQuestionViewModel();

  const { handleDelete } = useDeleteQuestion();

  /* =========================================
     Dropdown Data (Course + Module)
  ========================================= */
  const { courses, modules, handleChange } =
    useCreateQuestionViewModel();

  /* =========================================
     FILTER STATES
  ========================================= */
  const [selectedCourse, setSelectedCourse] =
    React.useState<string>("");

  const [selectedModule, setSelectedModule] =
    React.useState<string>("");

  const [selectedQuestionType, setSelectedQuestionType] =
    React.useState<string>("");

  const [searchText, setSearchText] =
    React.useState<string>("");

  /* =========================================
     UNIQUE QUESTION TYPES (For Dropdown)
  ========================================= */
  const questionTypes = React.useMemo(() => {
    const map = new Map<number, string>();

    questions.forEach((q) => {
      if (q.questionTypeId && q.questionTypeName) {
        map.set(q.questionTypeId, q.questionTypeName);
      }
    });

    return Array.from(map.entries()).map(([id, name]) => ({
      id,
      name,
    }));
  }, [questions]);

  /* =========================================
     MAIN FILTER LOGIC (All Filters Combined)
  ========================================= */
  const filteredQuestions = React.useMemo(() => {
    return questions.filter((q) => {
      // Course Filter
      if (
        selectedCourse &&
        String(q.courseId) !== String(selectedCourse)
      )
        return false;

      // Module Filter
      if (
        selectedModule &&
        String(q.moduleId) !== String(selectedModule)
      )
        return false;

      // Question Type Filter
      if (
        selectedQuestionType &&
        String(q.questionTypeId) !==
          String(selectedQuestionType)
      )
        return false;

      // Title/Description Search
      if (searchText) {
        const text = searchText.toLowerCase();

        const titleMatch = q.title
          ?.toLowerCase()
          .includes(text);

        const descMatch = q.description
          ?.toLowerCase()
          .includes(text);

        if (!titleMatch && !descMatch) return false;
      }

      return true;
    });
  }, [
    questions,
    selectedCourse,
    selectedModule,
    selectedQuestionType,
    searchText,
  ]);

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
        <Typography variant="h4">Questions</Typography>

        <Stack direction="row" spacing={1}>
          <IconButton onClick={refetch} color="primary">
            <Refresh />
          </IconButton>

          <Link href="/questions/create">
            <Button variant="contained" startIcon={<Add />}>
              Add Question
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
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          {/* Course */}
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Course</InputLabel>
            <Select
              value={selectedCourse}
              label="Course"
              onChange={(e) => {
                handleChange({
                  target: {
                    name: "courseId",
                    value: e.target.value,
                  },
                } as any);

                setSelectedCourse(e.target.value);
                setSelectedModule("");
              }}
            >
              <MenuItem value="">All</MenuItem>
              {courses.map((course: any) => (
                <MenuItem
                  key={course.courseId}
                  value={course.courseId}
                >
                  {course.courseName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Module */}
          <FormControl
            size="small"
            sx={{ minWidth: 200 }}
            disabled={!selectedCourse}
          >
            <InputLabel>Module</InputLabel>
            <Select
              value={selectedModule}
              label="Module"
              onChange={(e) => {
                handleChange({
                  target: {
                    name: "moduleId",
                    value: e.target.value,
                  },
                } as any);

                setSelectedModule(e.target.value);
              }}
            >
              <MenuItem value="">All</MenuItem>
              {modules.map((module: any) => (
                <MenuItem
                  key={module.moduleId}
                  value={module.moduleId}
                >
                  {module.moduleName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Question Type */}
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Question Type</InputLabel>
            <Select
              value={selectedQuestionType}
              label="Question Type"
              onChange={(e) =>
                setSelectedQuestionType(e.target.value)
              }
            >
              <MenuItem value="">All</MenuItem>

              {questionTypes.map((qt) => (
                <MenuItem key={qt.id} value={qt.id}>
                  {qt.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Search */}
          <TextField
            size="small"
            label="Search Title / Description"
            value={searchText}
            onChange={(e) =>
              setSearchText(e.target.value)
            }
          />
        </Stack>
      </Paper>

      {/* ================= QUESTION LIST ================= */}
      <Paper elevation={2} sx={{ p: 2 }}>
        {isLoading ? (
          <Stack spacing={2}>
            {Array.from(new Array(4)).map((_, i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                height={120}
              />
            ))}
          </Stack>
        ) : filteredQuestions.length === 0 ? (
          <Typography align="center" color="text.secondary">
            No questions found
          </Typography>
        ) : (
          <Stack spacing={2}>
            {filteredQuestions.map((q) => (
              <QuestionRenderer
                key={q.questionId}
                question={q}
                onDelete={async (id, title) => {
                  const success = await handleDelete(
                    id,
                    title
                  );
                  if (success) refetch();
                }}
              />
            ))}
          </Stack>
        )}
      </Paper>
    </Container>
  );
}
