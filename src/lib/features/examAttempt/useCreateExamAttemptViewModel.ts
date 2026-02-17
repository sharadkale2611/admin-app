"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

import { useAppDispatch } from "@/lib/hooks";
import type { RootState } from "@/lib/store";

import { fetchExamPapers } from "@/lib/features/exampaper/examPaperThunks";
import { fetchStudentList } from "@/lib/features/student/studentThunks";

import { createExamAttempt } from "./examAttemptThunks";
import { CreateExamAttemptDto } from "./examAttemptTypes";

/* ============================================================
   Form Type
============================================================ */

export interface ExamAttemptFormData {
  examPaperId: string;
  studentId: string;
}

/* ============================================================
   ViewModel
============================================================ */

export default function useCreateExamAttemptViewModel() {
  const dispatch = useAppDispatch();

  /* ============================================================
     Load Exam Papers and Students Once
  ============================================================ */

  useEffect(() => {
    dispatch(fetchExamPapers());
    dispatch(fetchStudentList());
  }, [dispatch]);

  /* ============================================================
     Store Selectors
  ============================================================ */

  const examPapers = useSelector(
    (state: RootState) => state.examPapers.examPapers || []
  );

  const students = useSelector(
    (state: RootState) => state.students.students || []
  );

  /* ============================================================
     Local State
  ============================================================ */

  const [formData, setFormData] =
    useState<ExamAttemptFormData>({
      examPaperId: "",
      studentId: "",
    });

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  /* ============================================================
     Change Handler
  ============================================================ */

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ============================================================
     Submit
  ============================================================ */

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setIsSubmitting(true);
    setError(null);

    try {

      if (!formData.examPaperId)
        throw new Error("Exam Paper is required");

      if (!formData.studentId)
        throw new Error("Student is required");

      const payload: CreateExamAttemptDto = {
        examPaperId: Number(formData.examPaperId),
        studentId: Number(formData.studentId),
      };

      await dispatch(
        createExamAttempt(payload)
      ).unwrap();

      toast.success(
        "Exam attempt started successfully"
      );

      return { success: true };

    } catch (err: any) {

      const msg =
        err?.message ||
        err?.error ||
        "Failed to start exam attempt";

      setError(msg);

      toast.error(msg);

    } finally {

      setIsSubmitting(false);

    }
  };

  return {

    formData,

    examPapers,

    students,

    error,

    isSubmitting,

    handleChange,

    handleSubmit,

  };
}
