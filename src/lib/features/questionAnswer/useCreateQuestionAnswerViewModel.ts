"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

import { useAppDispatch } from "@/lib/hooks";
import type { RootState } from "@/lib/store";
import { fetchQuestions } from "@/lib/features/question/questionThunks";

import { createQuestionAnswer } from "./questionAnswerThunks";
import { CreateQuestionAnswerDto } from "./questionAnswerTypes";

/* ============================================================
   Form Type
============================================================ */

export interface QuestionAnswerFormData {
  questionId: string;
  answerText: string;
  answerRegex: string;
  maxScore: string;
}

/* ============================================================
   ViewModel
============================================================ */

export default function useCreateQuestionAnswerViewModel() {
  const dispatch = useAppDispatch();

  /* ============================================================
     Load Questions Once
  ============================================================ */

  useEffect(() => {
    dispatch(fetchQuestions());
  }, [dispatch]);

  /* ============================================================
     Store Selectors
  ============================================================ */

  const questions = useSelector(
    (state: RootState) => state.questions.questions || []
  );

  /* ============================================================
     Local State
  ============================================================ */

  const [formData, setFormData] = useState<QuestionAnswerFormData>({
    questionId: "",
    answerText: "",
    answerRegex: "",
    maxScore: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!formData.questionId)
        throw new Error("Question is required");

      if (!formData.maxScore)
        throw new Error("Max Score is required");

      const payload: CreateQuestionAnswerDto = {
        questionId: Number(formData.questionId),
        answerText: formData.answerText || undefined,
        answerRegex: formData.answerRegex || undefined,
        maxScore: Number(formData.maxScore),
      };

      await dispatch(createQuestionAnswer(payload)).unwrap();

      toast.success("Question answer created successfully");

      return { success: true };
    } catch (err: any) {
      const msg =
        err?.message || err?.error || "Failed to create question answer";

      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    questions,
    error,
    isSubmitting,
    handleChange,
    handleSubmit,
  };
}
