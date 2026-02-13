"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { RootState } from "@/lib/store";
import { useAppDispatch } from "@/lib/hooks";

import {
  fetchQuestionAnswerById,
  updateQuestionAnswer,
} from "./questionAnswerThunks";

import { fetchQuestions } from "@/lib/features/question/questionThunks";
import { ApiError } from "./questionAnswerTypes";

/* ===============================
   Form Interface
================================ */

export interface EditQuestionAnswerFormData {
  questionId: string;
  answerText: string;
  answerRegex: string;
  maxScore: string;
  isActive: boolean;
}

/* ===============================
   ViewModel
================================ */

export default function useEditQuestionAnswerViewModel() {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  /* ===============================
     Load Questions (Dropdown)
  ================================ */

  useEffect(() => {
    dispatch(fetchQuestions());
  }, [dispatch]);

  /* ===============================
     Store Selectors
  ================================ */

  const { currentAnswer, loading } = useSelector(
    (state: RootState) => state.questionAnswers
  );

  const questions = useSelector(
    (state: RootState) => state.questions.questions || []
  );

  /* ===============================
     Local State
  ================================ */

  const [formData, setFormData] =
    useState<EditQuestionAnswerFormData>({
      questionId: "",
      answerText: "",
      answerRegex: "",
      maxScore: "",
      isActive: true,
    });

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState<ApiError | null>(null);

  /* ===============================
     Load Answer
  ================================ */

  useEffect(() => {
    if (id) {
      dispatch(
        fetchQuestionAnswerById(Number(id))
      );
    }
  }, [dispatch, id]);

  /* ===============================
     Populate Form
  ================================ */

  useEffect(() => {
    if (currentAnswer) {
      setFormData({
        questionId:
          currentAnswer.questionId?.toString() ||
          "",
        answerText:
          currentAnswer.answerText || "",
        answerRegex:
          currentAnswer.answerRegex || "",
        maxScore:
          currentAnswer.maxScore?.toString() ||
          "",
        isActive: currentAnswer.isActive,
      });
    }
  }, [currentAnswer]);

  /* ===============================
     Change Handlers
  ================================ */

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const target =
      e.currentTarget as HTMLInputElement;
    const { name, value, type } = target;
    const checked =
      type === "checkbox"
        ? target.checked
        : false;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : value,
    }));
  };

  /* ===============================
     Submit
  ================================ */

  const handleSubmit = async (
    e: React.FormEvent
  ): Promise<
    { success: boolean; message: string } | undefined
  > => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!id)
        throw new Error("Answer ID missing");

      if (!formData.maxScore)
        throw new Error("Max Score is required");

      await dispatch(
        updateQuestionAnswer({
          id: Number(id),
          dto: {
            answerText:
              formData.answerText || undefined,
            answerRegex:
              formData.answerRegex || undefined,
            maxScore: Number(formData.maxScore),
            isActive: formData.isActive,
          },
        })
      ).unwrap();

      return {
        success: true,
        message:
          "Question answer updated successfully",
      };
    } catch (err: any) {
      const message =
        err?.message ||
        err?.error ||
        "Failed to update question answer";

      setError({ error: message, errors: null });
      toast.error(message);
      return undefined;
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ===============================
     Expose
  ================================ */

  return {
    formData,
    questions, // 🔥 Question dropdown support
    loading,
    isSubmitting,
    error,

    handleChange,
    handleSubmit,
  };
}
