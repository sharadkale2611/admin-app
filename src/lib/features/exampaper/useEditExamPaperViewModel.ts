"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useAppDispatch } from "@/lib/hooks";

import {
  fetchExamPaperById,
  updateExamPaper,
} from "./examPaperThunks";

export default function useEditExamPaperViewModel() {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const { currentExamPaper, loading } = useSelector(
    (state: RootState) => state.examPapers
  );

  const [formData, setFormData] = useState({
    name: "",
    totalMarks: "",
    durationMinutes: "",
    shuffleQuestions: true,
    shuffleOptions: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchExamPaperById(Number(id)));
  }, [dispatch, id]);

  useEffect(() => {
    if (currentExamPaper) {
      setFormData({
        name: currentExamPaper.name,
        totalMarks: currentExamPaper.totalMarks.toString(),
        durationMinutes:
          currentExamPaper.durationMinutes.toString(),
        shuffleQuestions:
          currentExamPaper.shuffleQuestions,
        shuffleOptions:
          currentExamPaper.shuffleOptions,
      });
    }
  }, [currentExamPaper]);

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

    try {
      await dispatch(
        updateExamPaper({
          id: Number(id),
          dto: {
            name: formData.name,
            totalMarks: Number(formData.totalMarks),
            durationMinutes: Number(formData.durationMinutes),
            shuffleQuestions: formData.shuffleQuestions,
            shuffleOptions: formData.shuffleOptions,
          },
        })
      ).unwrap();

      return {
        success: true,
        message: "Exam paper updated successfully",
      };
    } catch (err: any) {
      toast.error(err?.error || "Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    loading,
    isSubmitting,
    handleChange,
    handleSubmit,
  };
}
