"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { RootState, AppDispatch } from "@/lib/store";
import {
  fetchQuestionTypeById,
  updateQuestionType,
} from "./questionTypeThunks";
import { ApiError } from "./questionTypeTypes";

/* ===============================
   Form Data Interface
================================ */

export interface QuestionTypeFormData {
  code: string;
  name: string;
  evaluationMode: "AUTO" | "MANUAL" | "HYBRID";
  supportsOptions: boolean;
  supportsAttachments: boolean;
  isActive: boolean;
}

/* ===============================
   ViewModel
================================ */

export default function useEditQuestionTypeViewModel() {
  const router = useRouter();
  const { id } = useParams();
  const dispatch: AppDispatch = useDispatch();

  const {
    currentQuestionType,
    loading,
    error: fetchError,
  } = useSelector((state: RootState) => state.questionTypes);

  const [formData, setFormData] = useState<QuestionTypeFormData>({
    code: "",
    name: "",
    evaluationMode: "AUTO",
    supportsOptions: false,
    supportsAttachments: false,
    isActive: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  /* ===============================
     Load Question Type
  ================================ */

  useEffect(() => {
    if (id) {
      dispatch(fetchQuestionTypeById(Number(id)));
    }
  }, [dispatch, id]);

  /* ===============================
     Populate Form
  ================================ */

  useEffect(() => {
    if (currentQuestionType) {
      setFormData({
        code: currentQuestionType.code || "",
        name: currentQuestionType.name || "",
        evaluationMode:
          currentQuestionType.evaluationMode || "AUTO",
        supportsOptions:
          currentQuestionType.supportsOptions ?? false,
        supportsAttachments:
          currentQuestionType.supportsAttachments ?? false,
        isActive: currentQuestionType.isActive ?? true,
      });
    }
  }, [currentQuestionType]);

  /* ===============================
     Handlers
  ================================ */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBooleanChange = (e: {
    target: { name: string; checked: boolean };
  }) => {
    const { name, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSelectChange = (e: {
    target: { name: string; value: any };
  }) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ===============================
     Submit
  ================================ */

  const handleSubmit = async (
    e: React.FormEvent
  ): Promise<{ success: boolean; message: string } | undefined> => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!id) throw new Error("Question Type ID is required");

      if (!formData.name || !formData.evaluationMode) {
        throw new Error("Name and Evaluation Mode are required");
      }

      const result = await dispatch(
        updateQuestionType({
          id: Number(id),
          name: formData.name.trim(),
          evaluationMode: formData.evaluationMode,
          supportsOptions: formData.supportsOptions,
          supportsAttachments: formData.supportsAttachments,
          isActive: formData.isActive,
        })
      ).unwrap();

      return {
        success: true,
        message:
          result.message || "Question type updated successfully",
      };
    } catch (err: unknown) {
      let errorMessage = "An unknown error occurred";

      if (err instanceof Error) errorMessage = err.message;

      setError({ error: errorMessage, errors: null });
      toast.error(errorMessage);
      return undefined;
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ===============================
     Expose API
  ================================ */

  return {
    formData,
    isSubmitting,
    error: error || fetchError,
    errors: error || fetchError,
    loading,

    handleChange,
    handleBooleanChange,
    handleSelectChange,
    handleSubmit,
  };
}
