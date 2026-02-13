"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/lib/hooks";
import { createExamPaper } from "./examPaperThunks";
import { CreateExamPaperDto } from "./examPaperTypes";

export interface ExamPaperFormData {
  name: string;
  totalMarks: string;
  durationMinutes: string;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
}

export default function useCreateExamPaperViewModel() {
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState<ExamPaperFormData>({
    name: "",
    totalMarks: "",
    durationMinutes: "",
    shuffleQuestions: true,
    shuffleOptions: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const payload: CreateExamPaperDto = {
        name: formData.name,
        totalMarks: Number(formData.totalMarks),
        durationMinutes: Number(formData.durationMinutes),
        shuffleQuestions: formData.shuffleQuestions,
        shuffleOptions: formData.shuffleOptions,
      };

      await dispatch(createExamPaper(payload)).unwrap();

      toast.success("Exam paper created successfully");

      return { success: true };
    } catch (err: any) {
      const msg = err?.error || "Create failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    error,
    isSubmitting,
    handleChange,
    handleSubmit,
  };
}
