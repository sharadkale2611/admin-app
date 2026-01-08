'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { SelectChangeEvent } from "@mui/material";

import { useAppDispatch } from "@/lib/hooks";
import type { RootState } from "@/lib/store";

import { fetchCoursesListOptions } from "@/lib/features/course/courseThunks";
import { fetchModules } from "@/lib/features/module/moduleThunks";
import { createExam } from "./examThunks";

/* ============================================================
   Types
============================================================ */
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

/* ============================================================
   View Model
============================================================ */
export default function useCreateExamViewModel() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  /* ============================================================
     Load dropdown data (once)
  ============================================================ */
  useEffect(() => {
    dispatch(fetchCoursesListOptions());
    dispatch(fetchModules());
  }, [dispatch]);

  /* ============================================================
     Store selectors
  ============================================================ */
  const courses = useSelector(
    (state: RootState) => state.courses.courses || []
  );

  const modules = useSelector(
    (state: RootState) => state.modules.modules || []
  );

  const firmId = useSelector(
    (state: RootState) => state.auth.user?.firmId
  );

  /* ============================================================
     Local state
  ============================================================ */
  const [formData, setFormData] = useState<ExamFormData>({
    examName: "",
    examDescription: "",
    examDurationHrs: "",
    examTotalMarks: "",
    examPassingMarks: "",
    moduleId: "",
    courseId: "",
    isActive: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ============================================================
     Handlers
  ============================================================ */
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target as HTMLInputElement;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      isActive: e.target.checked
    }));
  };

  /* ============================================================
     Submit
  ============================================================ */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!firmId) throw new Error("Firm is not linked to user");

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

      await dispatch(createExam(payload)).unwrap();

      /* ✅ SUCCESS POPUP (same as delete) */
      await Swal.fire({
        icon: "success",
        title: "Exam Created",
        text: "Exam has been created successfully.",
        confirmButtonColor: "#3085d6",
        timer: 2000,
        showConfirmButton: true
      });

      router.push("/exams");

    } catch (err: any) {
      const errorMessage =
        err?.message ||
        err?.error ||
        "Failed to create exam";

      setError(errorMessage);
      toast.error(errorMessage);

    } finally {
      setIsSubmitting(false);
    }
  };

  /* ============================================================
     Expose to UI
  ============================================================ */
  return {
    formData,
    courses,
    modules,
    error,
    isSubmitting,

    handleChange,
    handleStatusChange,
    handleSubmit
  };
}
