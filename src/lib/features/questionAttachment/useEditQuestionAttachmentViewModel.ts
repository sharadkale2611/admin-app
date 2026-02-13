"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { RootState } from "@/lib/store";
import { useAppDispatch } from "@/lib/hooks";

import {
  fetchQuestionAttachmentById,
  updateQuestionAttachment,
} from "./questionAttachmentThunks";

import { fetchQuestions } from "@/lib/features/question/questionThunks";
import { ApiError } from "./questionAttachmentTypes";

/* ===============================
   Form Interface
================================ */

export interface EditQuestionAttachmentFormData {
  questionId: string;
  isActive: boolean;
  file: File | null;
}

/* ===============================
   ViewModel
================================ */

export default function useEditQuestionAttachmentViewModel() {
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

  const { currentAttachment, loading } = useSelector(
    (state: RootState) => state.questionAttachments
  );

  const questions = useSelector(
    (state: RootState) => state.questions.questions || []
  );

  /* ===============================
     Local State
  ================================ */

  const [formData, setFormData] =
    useState<EditQuestionAttachmentFormData>({
      questionId: "",
      isActive: true,
      file: null,
    });

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState<ApiError | null>(null);

  const [existingFile, setExistingFile] =
    useState<string | null>(null);

  /* ===============================
     Load Attachment
  ================================ */

  useEffect(() => {
    if (id) {
      dispatch(
        fetchQuestionAttachmentById(Number(id))
      );
    }
  }, [dispatch, id]);

  /* ===============================
     Populate Form
  ================================ */

  useEffect(() => {
    if (currentAttachment) {
      setFormData({
        questionId:
          currentAttachment.questionId?.toString() ||
          "",
        isActive: currentAttachment.isActive,
        file: null,
      });

      setExistingFile(
        currentAttachment.uploadMediaPath ||
          null
      );
    }
  }, [currentAttachment]);

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

  const handleFileChange = (
    file: File | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      file,
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
        throw new Error("Attachment ID missing");

      await dispatch(
        updateQuestionAttachment({
          id: Number(id),
          dto: {
            isActive: formData.isActive,
            file: formData.file || undefined,
          },
        })
      ).unwrap();

      return {
        success: true,
        message:
          "Question attachment updated successfully",
      };
    } catch (err: any) {
      const message =
        err?.message ||
        err?.error ||
        "Failed to update attachment";

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
    existingFile,
    loading,
    isSubmitting,
    error,

    handleChange,
    handleFileChange,
    handleSubmit,
  };
}

