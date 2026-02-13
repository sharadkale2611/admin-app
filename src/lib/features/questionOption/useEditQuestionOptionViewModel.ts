"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { RootState } from "@/lib/store";
import { useAppDispatch } from "@/lib/hooks";

import {
  fetchQuestionOptionById,
  updateQuestionOption,
} from "./questionOptionThunks";

import { fetchQuestions } from "@/lib/features/question/questionThunks";
import { ApiError } from "./questionOptionTypes";

/* ===============================
   Form Interface
================================ */

export interface EditQuestionOptionFormData {
  questionId: string;
  optionText: string;
  optionOrder: string;
  isCorrect: boolean;
  isActive: boolean;
  optionMedia: File | null;
}

/* ===============================
   ViewModel
================================ */

export default function useEditQuestionOptionViewModel() {
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

  const { currentOption, loading } = useSelector(
    (state: RootState) => state.questionOptions
  );

  const questions = useSelector(
    (state: RootState) => state.questions.questions || []
  );

  /* ===============================
     Local State
  ================================ */

  const [formData, setFormData] =
    useState<EditQuestionOptionFormData>({
      questionId: "",
      optionText: "",
      optionOrder: "",
      isCorrect: false,
      isActive: true,
      optionMedia: null,
    });

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState<ApiError | null>(null);

  const [existingImage, setExistingImage] =
    useState<string | null>(null);

  /* ===============================
     Load Option
  ================================ */

  useEffect(() => {
    if (id) {
      dispatch(fetchQuestionOptionById(Number(id)));
    }
  }, [dispatch, id]);

  /* ===============================
     Populate Form
  ================================ */

  useEffect(() => {
    if (currentOption) {
      setFormData({
        questionId:
          currentOption.questionId?.toString() || "",
        optionText:
          currentOption.optionText || "",
        optionOrder:
          currentOption.optionOrder?.toString() ||
          "",
        isCorrect: currentOption.isCorrect,
        isActive: currentOption.isActive,
        optionMedia: null,
      });

      setExistingImage(
        currentOption.optionMediaPath || null
      );
    }
  }, [currentOption]);

  /* ===============================
     Change Handlers
  ================================ */

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const target = e.currentTarget as
      | HTMLInputElement
      | HTMLTextAreaElement;
    const { name, value, type } = target;
    const checked =
      type === "checkbox"
        ? (target as HTMLInputElement).checked
        : false;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (
    file: File | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      optionMedia: file,
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
        throw new Error("Option ID missing");

      if (!formData.optionText)
        throw new Error("Option text is required");

      if (!formData.optionOrder)
        throw new Error("Option order is required");

      await dispatch(
        updateQuestionOption({
          id: Number(id),
          dto: {
            optionText: formData.optionText,
            optionOrder: Number(
              formData.optionOrder
            ),
            isCorrect: formData.isCorrect,
            isActive: formData.isActive,
            optionMedia:
              formData.optionMedia || undefined,
          },
        })
      ).unwrap();

      return {
        success: true,
        message:
          "Question option updated successfully",
      };
    } catch (err: any) {
      const message =
        err?.message ||
        err?.error ||
        "Failed to update option";

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
    existingImage,
    loading,
    isSubmitting,
    error,

    handleChange,
    handleFileChange,
    handleSubmit,
  };
}
