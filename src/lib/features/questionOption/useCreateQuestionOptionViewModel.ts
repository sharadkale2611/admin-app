"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

import { useAppDispatch } from "@/lib/hooks";
import type { RootState } from "@/lib/store";
import { fetchQuestions } from "@/lib/features/question/questionThunks";

import { createQuestionOption } from "./questionOptionThunks";

import { CreateQuestionOptionDto } from "./questionOptionTypes";

/* ============================================================
   Form Type
============================================================ */

export interface QuestionOptionFormData {
  questionId: string;
  optionText: string;
  optionOrder: string;
  isCorrect: boolean;
  optionMedia: File | null;
}

/* ============================================================
   ViewModel
============================================================ */

export default function useCreateQuestionOptionViewModel() {
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
    (state: RootState) => state.questions.questions || [],
  );

  /* ============================================================
     Local State
  ============================================================ */

  const [formData, setFormData] = useState<QuestionOptionFormData>({
    questionId: "",
    optionText: "",
    optionOrder: "",
    isCorrect: false,
    optionMedia: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /* ============================================================
     Change Handler
  ============================================================ */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { name, value, type } = target;
    const checked =
      type === "checkbox" ? (target as HTMLInputElement).checked : false;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* ============================================================
     File Change Handler
  ============================================================ */

  const handleFileChange = (file: File | null) => {
    setFormData((prev) => ({
      ...prev,
      optionMedia: file,
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
      if (!formData.questionId) throw new Error("Question is required");

      if (!formData.optionText) throw new Error("Option text is required");

      if (!formData.optionOrder) throw new Error("Option order is required");

      const payload: CreateQuestionOptionDto = {
        questionId: Number(formData.questionId),
        optionText: formData.optionText,
        isCorrect: formData.isCorrect,
        optionOrder: Number(formData.optionOrder),
        optionMedia: formData.optionMedia || undefined,
      };

      await dispatch(createQuestionOption(payload)).unwrap();

      toast.success("Question option created successfully");

      return { success: true };
    } catch (err: any) {
      const msg = err?.message || err?.error || "Failed to create option";

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
    handleFileChange,
    handleSubmit,
  };
}
