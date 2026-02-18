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
} from "@mui/material";

import { Add, Refresh } from "@mui/icons-material";
import Link from "next/link";

import { useQuestionViewModel } from "@/lib/features/question/useQuestionViewModel";
import { useDeleteQuestion } from "@/lib/features/question/useDeleteQuestionViewModel";
import useCreateQuestionViewModel from "@/lib/features/question/useCreateQuestionViewModel";

import { ApiError } from "@/lib/features/question/questionTypes";

import QuestionRenderer from "./_components/QuestionRenderer";

export default function QuestionsPage() {
  const {
    questions,
    isLoading,
    error,
    refetch,
  } = useQuestionViewModel();

  const { handleDelete } = useDeleteQuestion();

  /* =========================================
     Use SAME ViewModel as Create Page
  ========================================= */
  const {
    courses,
    modules,
    handleChange,
  } = useCreateQuestionViewModel();

  const [selectedCourse, setSelectedCourse] =
    React.useState<string>("");
  const [selectedModule, setSelectedModule] =
    React.useState<string>("");

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

      {/* ================= COURSE + MODULE FILTER ================= */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2}>
          {/* Course Dropdown */}
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
              <MenuItem value="">None</MenuItem>
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

          {/* Module Dropdown */}
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
              <MenuItem value="">None</MenuItem>
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
        </Stack>
      </Paper>

      {/* ================= QUESTION LIST ================= */}
      <Paper elevation={2} sx={{ p: 2 }}>
        {!selectedCourse || !selectedModule ? (
          <Typography color="text.secondary">
            Please select course and module to view questions.
          </Typography>
        ) : isLoading ? (
          <Stack spacing={2}>
            {Array.from(new Array(4)).map((_, i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                height={120}
              />
            ))}
          </Stack>
        ) : questions.length === 0 ? (
          <Typography align="center" color="text.secondary">
            No questions found
          </Typography>
        ) : (
          <Stack spacing={2}>
            {questions.map((q) => (
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
