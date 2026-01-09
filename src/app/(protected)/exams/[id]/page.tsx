"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Skeleton,
  Alert,
  Grid,
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

/* ===== Components ===== */
import { ExamDetailsCard } from "./components/ExamDetailsCard";
import { ExamMarksViewList } from "./components/ExamMarksViewList";
import { ExamMarksEditForm } from "./components/ExamMarksEditForm";

/* ===== Types ===== */

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
};

/* ===== Page ===== */

export default function ViewExamPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const examId = Array.isArray(id) ? Number(id[0]) : Number(id);
  const { exams, isLoading, error } = useExamViewModel();
  const exam = exams.find((e) => e.examId === examId);

  const courses = useSelector(
    (state: RootState) => state.courses.courses || []
  );
  const modules = useSelector(
    (state: RootState) => state.modules.modules || []
  );

  const courseName =
    courses.find((c) => c.courseId === exam?.courseId)?.courseName || "—";
  const moduleName =
    modules.find((m) => m.moduleId === exam?.moduleId)?.moduleName || "—";

  const [students, setStudents] = useState<ExamStudent[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState<string | null>(null);

  const [marks, setMarks] = useState<Record<number, string>>({});
  const [existingMarks, setExistingMarks] = useState<
    Record<number, { examMarkId: number; markObtained: number }>
  >({});

  const [isEditingMarks, setIsEditingMarks] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  /* ===== Fetch Students ===== */

  useEffect(() => {
    if (!exam?.moduleId) return;

    const fetchStudents = async () => {
      try {
        setStudentsLoading(true);
        setStudentsError(null);

        const res = await api.get<ExamStudent[]>(
          `${API_ENDPOINTS.EXAMS.GET_STUDENTS_BY_MODULE}/${exam.moduleId}`,
          { withCredentials: true }
        );

        setStudents(res.data ?? []);
      } catch (err: any) {
        setStudentsError(err.message || "Failed to load students");
      } finally {
        setStudentsLoading(false);
      }
    };

    fetchStudents();
  }, [exam?.moduleId]);

  /* ===== Fetch Existing Marks ===== */

  useEffect(() => {
    if (!exam?.examId) return;

    const fetchMarks = async () => {
      try {
        const query = new URLSearchParams({
          pageNumber: "1",
          pageSize: "1000",
          examId: String(exam.examId),
        });

        const res = await api.get<ExamMarksForExamResponse>(
          `${API_ENDPOINTS.EXAM_MARKS.GET_LIST_PAGINATED}?${query}`,
          { withCredentials: true }
        );

        const map: Record<
          number,
          { examMarkId: number; markObtained: number }
        > = {};

        res.data?.items?.forEach((m) => {
          map[m.studentId] = {
            examMarkId: m.examMarkId,
            markObtained: m.markObtained,
          };
        });

        setExistingMarks(map);

        setMarks((prev) => {
          const next = { ...prev };
          res.data?.items?.forEach((m) => {
            if (!next[m.studentId]) {
              next[m.studentId] = String(m.markObtained);
            }
          });
          return next;
        });
      } catch {
        /* silent */
      }
    };

    fetchMarks();
  }, [exam?.examId]);

  /* ===== Handlers ===== */

  const handleMarkChange = (studentId: number, value: string) => {
    setMarks((prev) => ({ ...prev, [studentId]: value }));
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
        .filter((e) => e.mark !== undefined && e.mark !== "");

      if (!entries.length) {
        throw new Error("Please enter marks for at least one student");
      }

      const hasInvalid = entries.some((e) => {
        const val = Number(e.mark);
        return isNaN(val) || val < 0 || val > exam.examTotalMarks;
      });

      if (hasInvalid) {
        throw new Error(
          `Please review the entered marks. Values must be between 0 and ${exam.examTotalMarks} for this exam.`
        );
      }


      await Promise.all(
        entries.map((e) => {
          const mark = Number(e.mark);

          if (e.existing) {
            const payload: UpdateExamMarkDto = {
              id: e.existing.examMarkId,
              examId: exam.examId,
              studentId: e.studentId,
              markObtained: mark,
              status: true,
            };
            return (dispatch as any)(updateExamMark(payload)).unwrap();
          }

          const payload: CreateExamMarkDto = {
            examMarkId: 0,
            firmId: 0,
            examId: exam.examId,
            studentId: e.studentId,
            grade: "",
            markObtained: mark,
            status: true,
          };
          return (dispatch as any)(createExamMark(payload)).unwrap();
        })
      );

      // ✅ Update existingMarks locally so view updates instantly
      setExistingMarks((prev) => {
        const next = { ...prev };

        entries.forEach((e) => {
          const numericMark = Number(e.mark);

          if (e.existing) {
            next[e.studentId] = {
              examMarkId: e.existing.examMarkId,
              markObtained: numericMark,
            };
          } else {
            // Newly created mark (use temp id if API doesn't return one)
            next[e.studentId] = {
              examMarkId: Date.now(), // safe temporary id
              markObtained: numericMark,
            };
          }
        });

        return next;
      });

      setSubmitSuccess("Marks saved successfully");
      setIsEditingMarks(false);

    } catch (err: any) {
      setSubmitError(err?.message || "Failed to save marks");
    } finally {
      setSubmitLoading(false);
    }
  };

  /* ===== UI States ===== */

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <Skeleton height={40} />
        <Skeleton height={300} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  /* ===== Render ===== */

  return (
    <Container maxWidth="lg" sx={{ mt: 3, mb: 5 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Button component={Link} href="/exams" startIcon={<ArrowBack />}>
          Back
        </Button>

        {/* <Button
          variant="contained"
          startIcon={<Edit />}
          component={Link}
          href={`/exams/${exam?.examId}/edit`}
        >
          Edit Exam
        </Button> */}
      </Box>

      <Grid container spacing={3}>
        {/* LEFT: Exam Details */}
        <Grid size={{ xs: 12, lg: 4 }}>
          {exam && (
            <Box sx={{ position: "sticky", top: 88 }}>
              <ExamDetailsCard
                exam={exam}
                courseName={courseName}
                moduleName={moduleName}
              />
            </Box>
          )}
        </Grid>

        {/* RIGHT: Marks Workspace */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper sx={{ p: 3 }}>
            {/* Header */}
            <Box display="flex" alignItems="center" mb={2}>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Student Marks
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View or update marks for this exam
                </Typography>
              </Box>

              <Box flexGrow={1} />

              <Button
                size="small"
                variant={isEditingMarks ? "outlined" : "contained"}
                onClick={() => setIsEditingMarks((p) => !p)}
              >
                {isEditingMarks ? "Cancel Editing" : "Edit Marks"}
              </Button>
            </Box>

            {/* Alerts */}
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

            {/* Content */}
            {studentsLoading && (
              <Typography color="text.secondary">
                Loading students...
              </Typography>
            )}

            {studentsError && (
              <Alert severity="error">{studentsError}</Alert>
            )}

            {!studentsLoading && !studentsError && !isEditingMarks && (
              <ExamMarksViewList
                students={students}
                existingMarks={existingMarks}
              />
            )}

            {!studentsLoading && !studentsError && isEditingMarks && exam && (
              <ExamMarksEditForm
                students={students}
                marks={marks}
                existingMarks={existingMarks}
                examTotalMarks={exam.examTotalMarks}
                submitLoading={submitLoading}
                onMarkChange={handleMarkChange}
                onSubmit={handleSubmitMarks}
                onCancel={() => setIsEditingMarks(false)}
              />
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
