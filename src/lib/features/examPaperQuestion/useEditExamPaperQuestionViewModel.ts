"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useAppDispatch } from "@/lib/hooks";

import {
  fetchExamPaperQuestionById,
  updateExamPaperQuestion,
} from "./examPaperQuestionThunks";

import { fetchExamPapers } from "@/lib/features/exampaper/examPaperThunks";
import { fetchQuestions } from "@/lib/features/question/questionThunks";

export default function useEditExamPaperQuestionViewModel() {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  /* ✅ SAME REDUX STYLE AS YOUR REFERENCE */
  const { currentExamPaperQuestion, loading } = useSelector(
    (state: RootState) => state.examPaperQuestions
  );

  const examPapers =
    useSelector((state: RootState) => state.examPapers.examPapers) || [];

  const questions =
    useSelector((state: RootState) => state.questions.questions) || [];

  const [formData, setFormData] = useState({
    examPaperId: "",
    questionId: "",
    marksOverride: "",
    questionOrder: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  /* =========================
     FETCH DATA
  ========================== */
  useEffect(() => {
    if (id) {
      dispatch(fetchExamPaperQuestionById(Number(id)));
    }

    dispatch(fetchExamPapers());
    dispatch(fetchQuestions());
  }, [dispatch, id]);

  /* =========================
     PREFILL FORM
  ========================== */
  useEffect(() => {
    if (currentExamPaperQuestion) {
      setFormData({
        examPaperId:
          currentExamPaperQuestion.examPaperId?.toString() || "",
        questionId:
          currentExamPaperQuestion.questionId?.toString() || "",
        marksOverride:
          currentExamPaperQuestion.marksOverride?.toString() || "",
        questionOrder:
          currentExamPaperQuestion.questionOrder?.toString() || "",
      });
    }
  }, [currentExamPaperQuestion]);

  /* =========================
     HANDLE CHANGE
  ========================== */
  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================
     SUBMIT
  ========================== */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await dispatch(
        updateExamPaperQuestion({
          id: Number(id),
          dto: {
            marksOverride: formData.marksOverride
              ? Number(formData.marksOverride)
              : undefined,
            questionOrder: formData.questionOrder
              ? Number(formData.questionOrder)
              : undefined,
          },
        })
      ).unwrap();

      /* ✅ SAME PATTERN AS YOUR EXAMPAPER FILE */
      return {
        success: true,
        message: "Exam paper question updated successfully",
      };
    } catch (err: any) {
      toast.error(err?.error || "Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    examPapers,
    questions,
    loading,
    isSubmitting,
    handleChange,
    handleSubmit,
  };
}
