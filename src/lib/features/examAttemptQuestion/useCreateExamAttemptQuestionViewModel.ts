"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

import { useAppDispatch } from "@/lib/hooks";
import type { RootState } from "@/lib/store";

import { fetchExamAttempts } from "@/lib/features/examAttempt/examAttemptThunks";
import { fetchQuestions } from "@/lib/features/question/questionThunks";
import { fetchQuestionTypes } from "@/lib/features/questionType/questionTypeThunks";

import { createExamAttemptQuestion } from "./examAttemptQuestionThunks";
import { CreateExamAttemptQuestionDto } from "./examAttemptQuestionTypes";

/* ============================================================
   Form Type
============================================================ */

export interface ExamAttemptQuestionFormData {
  examAttemptId: string;
  questionId: string;
  questionTypeId: string;
  maxMarks: string;
}

/* ============================================================
   ViewModel
============================================================ */

export default function useCreateExamAttemptQuestionViewModel() {
  const dispatch = useAppDispatch();

  /* ============================================================
     Load Required Data Once
  ============================================================ */

  useEffect(() => {
    dispatch(fetchExamAttempts());

    dispatch(fetchQuestions());

    dispatch(fetchQuestionTypes());
  }, [dispatch]);

  /* ============================================================
     Store Selectors
  ============================================================ */

  const examAttempts = useSelector(
    (state: RootState) =>
      state.examAttempts.attempts || []
  );

  const allQuestions = useSelector(
    (state: RootState) =>
      state.questions.questions || []
  );

  const questionTypes = useSelector(
    (state: RootState) =>
      state.questionTypes.questionTypes || []
  );

  /* ============================================================
     Local State
  ============================================================ */

  const [formData, setFormData] =
    useState<ExamAttemptQuestionFormData>({
      examAttemptId: "",
      questionId: "",
      questionTypeId: "",
      maxMarks: "",
    });

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [questions, setQuestions] = useState<any[]>([]);

  /* ============================================================
     Change Handler
  ============================================================ */

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
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
      if (!formData.examAttemptId)
        throw new Error(
          "Exam Attempt is required"
        );

      if (!formData.questionId)
        throw new Error(
          "Question is required"
        );

      if (!formData.questionTypeId)
        throw new Error(
          "Question Type is required"
        );

      if (!formData.maxMarks)
        throw new Error(
          "Max Marks is required"
        );

      const payload: CreateExamAttemptQuestionDto =
        {
          examAttemptId: Number(
            formData.examAttemptId
          ),

          questionId: Number(
            formData.questionId
          ),

          questionTypeId: Number(
            formData.questionTypeId
          ),

          maxMarks: Number(
            formData.maxMarks
          ),
        };

      await dispatch(
        createExamAttemptQuestion(payload)
      ).unwrap();

      toast.success(
        "Attempt question created successfully"
      );

      return { success: true };
    } catch (err: any) {
      const msg =
        err?.message ||
        err?.error ||
        "Failed to create attempt question";

      setError(msg);

      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ============================================================
     Filter Questions by Type
  ============================================================ */

  useEffect(() => {
    const qt = formData.questionTypeId ? Number(formData.questionTypeId) : null;

    if (!qt) {
      setQuestions([]);
      return;
    }

    setQuestions(allQuestions.filter(q => Number(q.questionTypeId) === qt));
  }, [formData.questionTypeId, allQuestions]);

  return {
    formData,

    examAttempts,

    questions,

    questionTypes,

    error,

    isSubmitting,

    handleChange,

    handleSubmit,

  };

}
