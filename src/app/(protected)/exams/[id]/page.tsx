"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Button,
  Skeleton,
  Alert,
  Grid,
  TextField,
} from "@mui/material";

import Link from "next/link";
import { ArrowBack, Edit } from "@mui/icons-material";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { useExamViewModel } from "@/lib/features/exam/useExamViewModel";
import type { RootState } from "@/lib/store";
import API_ENDPOINTS from "@/lib/config/apiConfig";
import api from "@/lib/services/apiService";
import {
  createExamMark,
  updateExamMark,
} from "@/lib/features/examMarks/examMarksThunks";
import type {
  CreateExamMarkDto,
  UpdateExamMarkDto,
} from "@/lib/features/examMarks/examMarksTypes";

type ExamStudent = {
  studentId: number;
  studentName: string;
  studentCode: string;
  batchId: number;
  batchCode: string;
  enrollmentId: number;
};

type ExamMarkSummary = {
  examMarkId: number;
  studentId: number;
  markObtained: number;
};

type ExamMarksForExamResponse = {
  items: ExamMarkSummary[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
};

export default function ViewExam() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const examId = Array.isArray(id) ? Number(id[0]) : Number(id);

  const { exams, isLoading, error } = useExamViewModel();

  const [students, setStudents] = useState<ExamStudent[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState<string | null>(null);
  const [marks, setMarks] = useState<Record<number, string>>({});
  const [existingMarks, setExistingMarks] = useState<
    Record<number, { examMarkId: number; markObtained: number }>
  >({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [isEditingMarks, setIsEditingMarks] = useState(false);

  // ✅ Get course & module lists from store
  const courses = useSelector(
    (state: RootState) => state.courses.courses || []
  );

  const modules = useSelector(
    (state: RootState) => state.modules.modules || []
  );

  const exam = exams.find((e) => e.examId === examId);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!exam?.moduleId) return;

      try {
        setStudentsLoading(true);
        setStudentsError(null);

        const response = await api.get<ExamStudent[]>(
          `${API_ENDPOINTS.EXAMS.GET_STUDENTS_BY_MODULE}/${exam.moduleId}`,
          { withCredentials: true }
        );

        const data = response.data ?? [];
        setStudents(data);
      } catch (err: any) {
        setStudentsError(
          err.message || "Failed to load students for this exam"
        );
        setStudents([]);
      } finally {
        setStudentsLoading(false);
      }
    };

    fetchStudents();
  }, [exam?.moduleId]);

  useEffect(() => {
    const fetchExamMarks = async () => {
      if (!exam?.examId) return;

      try {
        const query = new URLSearchParams({
          pageNumber: "1",
          pageSize: "1000",
          examId: String(exam.examId),
        }).toString();

        const response = await api.get<ExamMarksForExamResponse>(
          `${API_ENDPOINTS.EXAM_MARKS.GET_LIST_PAGINATED}?${query}`,
          { withCredentials: true }
        );

        const items = response.data?.items ?? [];

        const map: Record<
          number,
          { examMarkId: number; markObtained: number }
        > = {};
        items.forEach((m) => {
          map[m.studentId] = {
            examMarkId: m.examMarkId,
            markObtained: m.markObtained,
          };
        });

        setExistingMarks(map);

        // Prefill marks for existing records without overwriting manual edits
        setMarks((prev) => {
          const next = { ...prev };
          items.forEach((m) => {
            if (next[m.studentId] === undefined || next[m.studentId] === "") {
              next[m.studentId] = String(m.markObtained);
            }
          });
          return next;
        });
      } catch {
        // If this fails, we simply won't prefill/edit existing marks
      }
    };

    fetchExamMarks();
  }, [exam?.examId]);

  const handleMarkChange = (studentId: number, value: string) => {
    setMarks((prev) => ({
      ...prev,
      [studentId]: value,
    }));
  };

  const handleSubmitMarks = async () => {
    if (!exam) return;

    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const entries = students
        .map((s) => ({
          studentId: s.studentId,
          mark: marks[s.studentId],
          existing: existingMarks[s.studentId],
        }))
        .filter((x) => x.mark !== undefined && x.mark !== "");

      if (entries.length === 0) {
        throw new Error("Please enter marks for at least one student");
      }

      // Synchronous validation before hitting API
      const invalid = entries.filter((entry) => {
        const numericMark = Number(entry.mark);
        const hasValue = entry.mark !== "";
        const maxMarks = exam.examTotalMarks;

        if (!hasValue || Number.isNaN(numericMark)) return true;
        if (numericMark < 0) return true;
        if (numericMark > maxMarks) return true;
        return false;
      });

      if (invalid.length > 0) {
        throw new Error(
          "Some marks are invalid. Please correct highlighted fields and try again."
        );
      }

      const results = await Promise.allSettled(
        entries.map((entry) => {
          const numericMark = Number(entry.mark);
          if (entry.existing) {
            const payload: UpdateExamMarkDto = {
              id: entry.existing.examMarkId,
              examId: exam.examId,
              studentId: entry.studentId,
              markObtained: numericMark,
              status: true,
            };

            return (dispatch as any)(updateExamMark(payload)).unwrap();
          }

          const payload: CreateExamMarkDto = {
            examMarkId: 0,
            firmId: 0,
            examId: exam.examId,
            studentId: entry.studentId,
            grade: "",
            markObtained: numericMark,
            status: true,
          };

          return (dispatch as any)(createExamMark(payload)).unwrap();
        })
      );

      const failed = results.filter((r) => r.status === "rejected");

      if (failed.length === 0) {
        setSubmitSuccess("Exam marks saved successfully");
        setSubmitError(null);
      } else if (failed.length === entries.length) {
        const errorMessages = failed
          .map((r) => (r as PromiseRejectedResult).reason)
          .map((reason: any) =>
            typeof reason === "string" ? reason : reason?.message || ""
          )
          .filter(Boolean);

        const uniqueMessages = Array.from(new Set(errorMessages));

        setSubmitError(
          `Failed to save marks for all selected students. ${
            uniqueMessages.length ? uniqueMessages.join(" | ") : ""
          }`.trim()
        );
      } else {
        const successCount = entries.length - failed.length;
        const errorMessages = failed
          .map((r) => (r as PromiseRejectedResult).reason)
          .map((reason: any) =>
            typeof reason === "string" ? reason : reason?.message || ""
          )
          .filter(Boolean);

        const uniqueMessages = Array.from(new Set(errorMessages));

        setSubmitSuccess(
          `Saved marks for ${successCount} of ${entries.length} students.`
        );
        setSubmitError(
          `Some marks failed to save. ${
            uniqueMessages.length ? uniqueMessages.join(" | ") : ""
          }`.trim()
        );
      }
    } catch (err: any) {
      const message =
        typeof err === "string"
          ? err
          : err?.message || "Failed to save exam marks";
      setSubmitError(message);
    } finally {
      setSubmitLoading(false);
    }
  };

  // ✅ Resolve names
  const courseName =
    courses.find((c) => c.courseId === exam?.courseId)?.courseName || "—";

  const moduleName =
    modules.find((m) => m.moduleId === exam?.moduleId)?.moduleName || "—";

  // ⏳ Loading
  if (isLoading)
    return (
      <Container maxWidth="md" sx={{ mt: 3 }}>
        <Skeleton variant="text" width={300} height={40} />
        <Skeleton variant="rectangular" width="100%" height={300} />
      </Container>
    );

  //  Error
  if (error)
    return (
      <Container maxWidth="md" sx={{ mt: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Box mt={2}>
          <Button component={Link} href="/exams" startIcon={<ArrowBack />}>
            Back to Exams
          </Button>
        </Box>
      </Container>
    );

  return (
    <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button component={Link} href="/exams" startIcon={<ArrowBack />}>
          Back
        </Button>

        <Button
          variant="contained"
          startIcon={<Edit />}
          component={Link}
          href={`/exams/${exam?.examId}/edit`}
        >
          Edit Exam
        </Button>
      </Box>

      {/* Card */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight={600}>
          {exam?.examName}
        </Typography>

        <Chip
          label={exam?.isActive ? "Active" : "Inactive"}
          color={exam?.isActive ? "success" : "error"}
          sx={{ mt: 1 }}
        />

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12 }}>
            <Typography color="text.secondary">Description</Typography>
            <Typography>{exam?.examDescription || "—"}</Typography>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Typography color="text.secondary">Duration (hrs)</Typography>
            <Typography>{exam?.examDurationHrs}</Typography>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Typography color="text.secondary">Module</Typography>
            <Typography>{moduleName}</Typography>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Typography color="text.secondary">Total Marks</Typography>
            <Typography>{exam?.examTotalMarks}</Typography>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Typography color="text.secondary">Passing Marks</Typography>
            <Typography>{exam?.examPassingMarks}</Typography>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Typography color="text.secondary">Course</Typography>
            <Typography>{courseName}</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Students for this exam's module */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Students for this Module
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <Button
            variant="outlined"
            onClick={() => setIsEditingMarks((prev) => !prev)}
            sx={{
              color: isEditingMarks ? "#d32f2f" : "#f9a825",
              borderColor: isEditingMarks ? "#d32f2f" : "#f9a825",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: isEditingMarks
                  ? "rgba(211, 47, 47, 0.08)"
                  : "rgba(249, 168, 37, 0.08)",
              },
            }}
          >
            {isEditingMarks ? "Cancel" : "Edit Marks"}
          </Button>
        </Box>

        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}

        {submitSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {submitSuccess}
          </Alert>
        )}

        {studentsLoading && (
          <Typography color="text.secondary">Loading students...</Typography>
        )}

        {studentsError && !studentsLoading && (
          <Alert severity="error">{studentsError}</Alert>
        )}

        {!studentsLoading && !studentsError && students.length === 0 && (
          <Typography color="text.secondary">
            No students found for this module.
          </Typography>
        )}

        {!studentsLoading &&
          !studentsError &&
          students.length > 0 &&
          isEditingMarks && (
            <Box mt={2}>
              {students.map((s) => (
                <Box
                  key={`${s.enrollmentId}-${s.batchId}`}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 1,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    gap: 2,
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography fontWeight={500}>{s.studentName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Code: {s.studentCode}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Batch: {s.batchCode}
                    </Typography>
                  </Box>
                  <Box sx={{ width: 160 }}>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      label="Obtained Marks"
                      value={marks[s.studentId] ?? ""}
                      onChange={(e) =>
                        handleMarkChange(s.studentId, e.target.value)
                      }
                      inputProps={{ min: 0, max: exam?.examTotalMarks }}
                    />
                    {existingMarks[s.studentId] && (
                      <Typography variant="caption" color="text.secondary">
                        Existing marks recorded – editing will update.
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}

              <Box mt={3} display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmitMarks}
                  disabled={submitLoading || students.length === 0}
                >
                  {submitLoading ? "Saving Marks..." : "Submit Marks"}
                </Button>
              </Box>
            </Box>
          )}
      </Paper>
    </Container>
  );
}
