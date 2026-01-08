"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/lib/hooks";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { fetchStudentList } from "@/lib/features/student/studentThunks";
import { fetchAllExams } from "@/lib/features/exam/examThunks";

interface SimpleExam {
  examId: number;
  examName: string;
}

interface SimpleStudent {
  studentId: number;
  firstName: string;
  lastName: string;
}

/**
 * Helper hook to load Exams and Students for Exam Marks filters and forms.
 * Assumes there's an endpoint /api/Exams returning at least { examId, examName }.
 */
export const useExamMarksListSupport = () => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> =
    useAppDispatch();

  const [exams, setExams] = useState<SimpleExam[]>([]);
  const [students, setStudents] = useState<SimpleStudent[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const studentsRes = await dispatch(fetchStudentList()).unwrap();
        setStudents(
          studentsRes.map((s) => ({
            studentId: Number(s.studentId),
            firstName: s.firstName,
            lastName: s.lastName,
          }))
        );

        const examsRes = await dispatch(fetchAllExams()).unwrap();
        setExams(
          examsRes.map((ex) => ({
            examId: ex.examId,
            examName: ex.examName,
          }))
        );
      } catch (e) {
        console.error("Failed to load dropdown data for exam marks", e);
      }
    }
    load();
  }, [dispatch]);

  return { exams, students };
};

export default useExamMarksListSupport;
