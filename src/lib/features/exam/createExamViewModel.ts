'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { createExam } from "./examThunks";
import type { RootState } from "@/lib/store";

export interface ExamFormData {
  examName: string;
  examDescription: string;
  examDurationHrs: string;
  examTotalMarks: string;
  examPassingMarks: string;

  moduleId: string;
  courseId: string;

  isActive: boolean;
}

export default function useCreateExamViewModel() {

  const router = useRouter();
  const dispatch = useDispatch();

  const firmId = useSelector(
    (state: RootState) => state.auth.user?.firmId
  );

  const [formData, setFormData] = useState<ExamFormData>({
    examName: "",
    examDescription: "",
    examDurationHrs: "",
    examTotalMarks: "",
    examPassingMarks: "",
    moduleId: "",
    courseId: "",
    isActive: true   // default same as module
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ⭐ SAME AS MODULE create dialog
  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      isActive: e.target.checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {

      if (!firmId) {
        throw new Error("Firm is not linked to user");
      }

      if (
        !formData.examName ||
        !formData.examDurationHrs ||
        !formData.examTotalMarks ||
        !formData.examPassingMarks ||
        !formData.moduleId
      ) {
        throw new Error("Please fill all required fields");
      }

      const payload = {
        firmId: Number(firmId),

        moduleId: Number(formData.moduleId),
        courseId: formData.courseId
          ? Number(formData.courseId)
          : null,

        examName: formData.examName,
        examDescription: formData.examDescription,

        examDurationHrs: Number(formData.examDurationHrs),
        examTotalMarks: Number(formData.examTotalMarks),
        examPassingMarks: Number(formData.examPassingMarks),

        isActive: formData.isActive
      };

      await dispatch<any>(createExam(payload)).unwrap();

      toast.success("Exam created successfully");
      router.push("/exams");

    } catch (err: any) {

      let errorMessage = "";

      if (typeof err === "string") errorMessage = err;
      else if (err?.message) errorMessage = err.message;
      else if (err?.errors)
        errorMessage = Object.values(err.errors).flat().join(", ");
      else
        errorMessage = "Server error";

      setError(errorMessage);
      toast.error(errorMessage);
    }
    finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    error,
    isSubmitting,

    handleChange,
    handleStatusChange,   // 👈 export like module
    handleSubmit
  };
}
