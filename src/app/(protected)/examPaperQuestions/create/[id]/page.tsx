"use client";

import React, { useMemo, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Stack,
  Checkbox,
  FormControlLabel,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";

import { useParams, useRouter } from "next/navigation";

import { useQuestionViewModel } from "@/lib/features/question/useQuestionViewModel";
import useCreateQuestionViewModel from "@/lib/features/question/useCreateQuestionViewModel";
import { useAppDispatch } from "@/lib/hooks";
import { createExamPaperQuestion } from "@/lib/features/examPaperQuestion/examPaperQuestionThunks";

export default function CreateExamPaperQuestionPage() {
  const router = useRouter();
  const params = useParams();

  // ✅ Safe examPaperId
  const examPaperId = Number(params?.id);

  const dispatch = useAppDispatch();

  const { questions, isLoading } = useQuestionViewModel();

  const { courses, modules, handleChange } =
    useCreateQuestionViewModel();

  const [selectedCourse, setSelectedCourse] =
    useState<string>("");

  const [selectedModule, setSelectedModule] =
    useState<string>("");

  const [selectedQuestions, setSelectedQuestions] =
    useState<number[]>([]);

  const [saving, setSaving] = useState(false);

  /* =========================
     FILTER QUESTIONS (FIXED)
  ========================= */
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      // Course filter
      if (
        selectedCourse &&
        String(q.courseId) !== String(selectedCourse)
      )
        return false;

      // ✅ MODULE FIX (null safe)
      if (selectedModule) {
        if (!q.moduleId) return false;
        if (String(q.moduleId) !== String(selectedModule))
          return false;
      }

      return true;
    });
  }, [questions, selectedCourse, selectedModule]);

  /* =========================
     TOGGLE SINGLE QUESTION
  ========================= */
  const toggleQuestion = (id: number) => {
    setSelectedQuestions((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  /* =========================
     SELECT ALL
  ========================= */
  const handleSelectAll = () => {
    if (
      selectedQuestions.length === filteredQuestions.length
    ) {
      setSelectedQuestions([]);
    } else {
      setSelectedQuestions(
        filteredQuestions.map((q) => q.questionId)
      );
    }
  };

  /* =========================
     SAVE SELECTED QUESTIONS
  ========================= */
  const handleSave = async () => {
    if (!examPaperId) return;

    try {
      setSaving(true);

      for (const questionId of selectedQuestions) {
        await dispatch(
          createExamPaperQuestion({
            examPaperId,
            questionId,
          })
        ).unwrap();
      }

      // ✅ Requirement 7
      router.push(`/exampapers/${examPaperId}`);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Select Questions For Exam Paper
      </Typography>

      {!examPaperId && (
        <Alert severity="error">
          Invalid Exam Paper Id
        </Alert>
      )}

      {/* ================= FILTER BAR ================= */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2}>
          {/* COURSE */}
          <FormControl size="small" sx={{ minWidth: 250 }}>
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
              {courses.map((c: any) => (
                <MenuItem
                  key={c.courseId}
                  value={c.courseId}
                >
                  {c.courseName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* MODULE */}
          <FormControl size="small" sx={{ minWidth: 250 }}>
            <InputLabel>Module</InputLabel>
            <Select
              value={selectedModule}
              label="Module"
              onChange={(e) =>
                setSelectedModule(e.target.value)
              }
            >
              <MenuItem value="">All</MenuItem>
              {modules.map((m: any) => (
                <MenuItem
                  key={m.moduleId}
                  value={m.moduleId}
                >
                  {m.moduleName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* ================= QUESTION LIST ================= */}
      <Paper sx={{ p: 2 }}>
        {isLoading ? (
          <Typography>Loading Questions...</Typography>
        ) : filteredQuestions.length === 0 ? (
          <Typography color="text.secondary">
            No questions found for selected filter
          </Typography>
        ) : (
          <>
            {/* SELECT ALL */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={
                    selectedQuestions.length ===
                      filteredQuestions.length &&
                    filteredQuestions.length > 0
                  }
                  onChange={handleSelectAll}
                />
              }
              label="Select All"
            />

            {/* QUESTIONS */}
            <Stack>
              {filteredQuestions.map((q) => (
                <FormControlLabel
                  key={q.questionId}
                  control={
                    <Checkbox
                      checked={selectedQuestions.includes(
                        q.questionId
                      )}
                      onChange={() =>
                        toggleQuestion(q.questionId)
                      }
                    />
                  }
                  label={q.title}
                />
              ))}
            </Stack>

            {/* SAVE BUTTON */}
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              disabled={
                selectedQuestions.length === 0 || saving
              }
              onClick={handleSave}
            >
              {saving
                ? "Saving..."
                : "Save Selected Questions"}
            </Button>
          </>
        )}
      </Paper>
    </Container>
  );
}
