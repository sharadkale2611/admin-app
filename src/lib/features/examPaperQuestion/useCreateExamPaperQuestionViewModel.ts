"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";

import { createExamPaperQuestion } from "./examPaperQuestionThunks";

// 👇 IMPORT THESE
import { fetchExamPapers } from "@/lib/features/exampaper/examPaperThunks";
import { fetchQuestions } from "@/lib/features/question/questionThunks";

import { CreateExamPaperQuestionDto } from "./examPaperQuestionTypes";

export default function useCreateExamPaperQuestionViewModel() {
  const dispatch = useAppDispatch();

  /* =============================
     FETCH DROPDOWN DATA
  ============================== */

  const examPapers = useAppSelector(
    (state: RootState) => state.examPapers.examPapers ?? []
  );

  const questions = useAppSelector(
    (state: RootState) => state.questions.questions ?? []
  );

  useEffect(() => {
    // 🔥 THIS WAS MISSING
    dispatch(fetchExamPapers());
    dispatch(fetchQuestions());
  }, [dispatch]);

  /* =============================
     FORM STATE
  ============================== */

  const [formData, setFormData] = useState({
    examPaperId: "",
    questionId: "",
    marksOverride: "",
    questionOrder: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* =============================
     SUBMIT
  ============================== */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setError(null);

    try {
      const payload: CreateExamPaperQuestionDto = {
        examPaperId: Number(formData.examPaperId),
        questionId: Number(formData.questionId),
        marksOverride: formData.marksOverride
          ? Number(formData.marksOverride)
          : undefined,
        questionOrder: formData.questionOrder
          ? Number(formData.questionOrder)
          : undefined,
      };

      await dispatch(createExamPaperQuestion(payload)).unwrap();

      return { success: true };
    } catch (err: any) {
      setError(err?.error || "Create failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    examPapers,
    questions,
    formData,
    error,
    isSubmitting,
    handleChange,
    handleSubmit,
  };
}
