"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/lib/hooks";
import type { RootState, AppDispatch } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { fetchStudentList } from "@/lib/features/student/studentThunks";
import { useSelector } from "react-redux";

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
      } catch (e) {
        console.error("Failed to load students for exam marks", e);
      }
    }
    load();
  }, [dispatch]);

  // TODO: Replace with real Exams thunk when available
  useEffect(() => {
    async function loadExams() {
      try {
        // If you already have an Exams thunk, import and use here.
        // For now, keep exams empty to avoid broken calls.
        setExams([]);
      } catch (e) {
        console.error("Failed to load exams for exam marks", e);
      }
    }
    loadExams();
  }, []);

  return { exams, students };
};

export default useExamMarksListSupport;
