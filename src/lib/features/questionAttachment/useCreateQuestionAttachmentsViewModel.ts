"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

import { useAppDispatch } from "@/lib/hooks";
import type { RootState } from "@/lib/store";
import { fetchQuestions } from "@/lib/features/question/questionThunks";

import { createQuestionAttachment } from "./questionAttachmentThunks";
import { CreateQuestionAttachmentDto } from "./questionAttachmentTypes";

/* ============================================================
   Form Type
============================================================ */

export interface QuestionAttachmentFormData {
  questionId: string;
  file: File | null;
}

/* ============================================================
   ViewModel
============================================================ */

export default function useCreateQuestionAttachmentsViewModel() {
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

  const [formData, setFormData] = useState<QuestionAttachmentFormData>({
    questionId: "",
    file: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /* ============================================================
     Change Handler
  ============================================================ */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ============================================================
     File Change Handler
  ============================================================ */

  const handleFileChange = (file: File | null) => {
    setFormData((prev) => ({
      ...prev,
      file,
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

      if (!formData.file)
        throw new Error("File is required");

      const payload: CreateQuestionAttachmentDto = {
        questionId: Number(formData.questionId),
        file: formData.file,
      };

      await dispatch(createQuestionAttachment(payload)).unwrap();

      toast.success("Question attachment uploaded successfully");

      return { success: true };
    } catch (err: any) {
      const msg =
        err?.message || err?.error || "Failed to upload attachment";

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
