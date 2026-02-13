"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { RootState, AppDispatch } from "@/lib/store";
import {
  fetchQuestionTypeRuleById,
  updateQuestionTypeRule,
} from "./questionTypeRuleThunks";
import { ApiError } from "./questionTypeRuleTypes";

/* ===============================
   Form Data Interface
================================ */

export interface QuestionTypeRuleFormData {
  questionTypeId: number | "";
  minOptions: number | "";
  maxOptions: number | "";
  maxSelections: number | "";
  maxTextLength: number | "";
  isRegexAnswerAllowed: boolean;
}

/* ===============================
   ViewModel
================================ */

export default function useEditQuestionTypeRuleViewModel() {
  const router = useRouter();
  const { id } = useParams();
  const dispatch: AppDispatch = useDispatch();

  const {
    currentRule,
    loading,
    error: fetchError,
  } = useSelector((state: RootState) => state.questionTypeRules);

  const [formData, setFormData] =
    useState<QuestionTypeRuleFormData>({
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
     Load Rule
  ================================ */

  useEffect(() => {
    if (id) {
      dispatch(fetchQuestionTypeRuleById(Number(id)));
    }
  }, [dispatch, id]);

  /* ===============================
     Populate Form
  ================================ */

  useEffect(() => {
    if (currentRule) {
      setFormData({
        questionTypeId:
          currentRule.questionTypeId ?? "",
        minOptions: currentRule.minOptions ?? "",
        maxOptions: currentRule.maxOptions ?? "",
        maxSelections:
          currentRule.maxSelections ?? "",
        maxTextLength:
          currentRule.maxTextLength ?? "",
        isRegexAnswerAllowed:
          currentRule.isRegexAnswerAllowed ?? false,
      });
    }
  }, [currentRule]);

  /* ===============================
     Handlers
  ================================ */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        value === ""
          ? ""
          : name === "questionTypeId" ||
            name === "minOptions" ||
            name === "maxOptions" ||
            name === "maxSelections" ||
            name === "maxTextLength"
          ? Number(value)
          : value,
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
      [name]:
        value === ""
          ? ""
          : value === "true"
          ? true
          : value === "false"
          ? false
          : Number(value),
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
      if (!id) throw new Error("Rule ID is required");

      if (!formData.questionTypeId) {
        throw new Error("Question Type is required");
      }

      const result = await dispatch(
        updateQuestionTypeRule({
          id: Number(id),
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
          isRegexAnswerAllowed:
            formData.isRegexAnswerAllowed,
        })
      ).unwrap();

      return {
        success: true,
        message:
          result.message || "Rule updated successfully",
      };
    } catch (err: unknown) {
      let errorMessage = "An unknown error occurred";

      if (err instanceof Error)
        errorMessage = err.message;

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
