"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { AppDispatch } from "@/lib/store";
import { createQuestionTypeRule } from "./questionTypeRuleThunks";
import {
  ApiError,
  CreateQuestionTypeRuleDto,
} from "./questionTypeRuleTypes";
import { SelectChangeEvent } from "@mui/material";

/* ===============================
   Form State Interface
================================ */

export interface QuestionTypeRuleFormData {
  questionTypeId: number | "";
  minOptions: number | "";
  maxOptions: number | "";
  maxSelections: number | "";
  maxTextLength: number | "";
  isRegexAnswerAllowed: boolean;
}

export default function useCreateQuestionTypeRuleViewModel() {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<QuestionTypeRuleFormData>({
    questionTypeId: "",
    minOptions: "",
    maxOptions: "",
    maxSelections: "",
    maxTextLength: "",
    isRegexAnswerAllowed: false,
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
      [name]:
        name === "questionTypeId" ||
        name === "minOptions" ||
        name === "maxOptions" ||
        name === "maxSelections" ||
        name === "maxTextLength"
          ? value === ""
            ? ""
            : Number(value)
          : value,
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
          : value === ""
          ? ""
          : Number(value),
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

      if (!formData.questionTypeId) {
        throw new Error("Question Type is required");
      }

      /* ---------- Build DTO ---------- */

      const payload: CreateQuestionTypeRuleDto = {
        questionTypeId: Number(formData.questionTypeId),
        minOptions:
          formData.minOptions === ""
            ? undefined
            : Number(formData.minOptions),
        maxOptions:
          formData.maxOptions === ""
            ? undefined
            : Number(formData.maxOptions),
        maxSelections:
          formData.maxSelections === ""
            ? undefined
            : Number(formData.maxSelections),
        maxTextLength:
          formData.maxTextLength === ""
            ? undefined
            : Number(formData.maxTextLength),
        isRegexAnswerAllowed: formData.isRegexAnswerAllowed,
      };

      /* ---------- Dispatch Thunk ---------- */

      const result = await dispatch(
        createQuestionTypeRule(payload)
      ).unwrap();

      if (result.success) {
        toast.success(
          result.message || "Rule created successfully"
        );

        return {
          success: true,
          message:
            result.message || "Rule created successfully",
        };
      }

      throw new Error("Failed to create rule");
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
