"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { AppDispatch } from "@/lib/store";
import { createQuestionType } from "./questionTypeThunks";
import {
  ApiError,
  CreateQuestionTypeDto,
} from "./questionTypeTypes";
import { SelectChangeEvent } from "@mui/material";

/* ===============================
   Form State Interface
================================ */

export interface QuestionTypeFormData {
  code: string;
  name: string;
  evaluationMode: "AUTO" | "MANUAL" | "HYBRID";
  supportsOptions: boolean;
  supportsAttachments: boolean;
}

export default function useCreateQuestionTypeViewModel() {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<QuestionTypeFormData>({
    code: "",
    name: "",
    evaluationMode: "AUTO",
    supportsOptions: false,
    supportsAttachments: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  /* ===============================
     Input Handlers
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

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        value === "true"
          ? true
          : value === "false"
          ? false
          : value,
    }));
  };

  /* ===============================
     Submit Handler
  ================================ */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      /* ---------- Validation ---------- */

      if (!formData.code || !formData.name || !formData.evaluationMode) {
        throw new Error("Code, Name and Evaluation Mode are required");
      }

      /* ---------- Build DTO ---------- */

      const payload: CreateQuestionTypeDto = {
        code: formData.code.trim(),
        name: formData.name.trim(),
        evaluationMode: formData.evaluationMode,
        supportsOptions: formData.supportsOptions,
        supportsAttachments: formData.supportsAttachments,
      };

      /* ---------- Dispatch Thunk ---------- */

      const result = await dispatch(
        createQuestionType(payload)
      ).unwrap();

      if (result.success) {
        toast.success(
          result.message || "Question type created successfully"
        );

        return {
          success: true,
          message:
            result.message ||
            "Question type created successfully",
        };
      }

      throw new Error("Failed to create question type");
    } catch (err: any) {
      /* ---------- Thunk Error ---------- */
      if (err?.error) {
        toast.error(err.error);
        setError(err);
        return;
      }

      /* ---------- Axios / Unknown Error ---------- */
      const apiMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Something went wrong";

      toast.error(apiMessage);
      setError({ error: apiMessage, errors: null });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ===============================
     Exposed API
  ================================ */

  return {
    formData,
    isSubmitting,
    error,
    handleChange,
    handleSelectChange,
    handleSubmit,
  };
}
