'use client';

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { SelectChangeEvent } from "@mui/material";

import { useAppDispatch } from "@/lib/hooks";
import type { RootState } from "@/lib/store";

import { fetchCoursesListOptions } from "@/lib/features/course/courseThunks";
import { fetchModulesByCourse } from "@/lib/features/courseModules/courseModuleThunks";
import { fetchExamById, updateExam } from "./examThunks";

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
export default function useEditExamViewModel() {
  const router = useRouter();
  const { id } = useParams();
  const dispatch = useAppDispatch();

  /* ============================================================
     Load dropdown data
  ============================================================ */
  useEffect(() => {
    dispatch(fetchCoursesListOptions());
  }, [dispatch]);

  /* ============================================================
     Selectors
  ============================================================ */
  const courses = useSelector(
    (state: RootState) => state.courses.courses || []
  );

  const courseModulesByCourse = useSelector(
    (state: RootState) => state.courseModules.courseModulesByCourse || []
  );

  const modules = courseModulesByCourse.map(cm => ({
    moduleId: cm.moduleId,
    moduleName: cm.moduleName ?? `Module #${cm.moduleId}`,
  }));

  const { currentExam, loading, error: fetchError } = useSelector(
    (state: RootState) => state.exam
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
     Fetch exam by ID
  ============================================================ */
  useEffect(() => {
    if (!id) return;

    const examId = Array.isArray(id) ? Number(id[0]) : Number(id);
    if (!isNaN(examId)) {
      dispatch(fetchExamById(examId));
    }
  }, [dispatch, id]);

  /* ============================================================
     Populate form when exam loads
  ============================================================ */
  useEffect(() => {
    if (currentExam) {
      setFormData({
        examName: currentExam.examName || "",
        examDescription: currentExam.examDescription || "",
        examDurationHrs: String(currentExam.examDurationHrs ?? ""),
        examTotalMarks: String(currentExam.examTotalMarks ?? ""),
        examPassingMarks: String(currentExam.examPassingMarks ?? ""),
        moduleId: String(currentExam.moduleId ?? ""),
        courseId: String(currentExam.courseId ?? ""),
        isActive: currentExam.isActive ?? true
      });

      // Preload modules for the exam's course so module dropdown is in sync
      if (currentExam.courseId) {
        dispatch(fetchModulesByCourse(currentExam.courseId));
      }
    }
  }, [currentExam]);

  /* ============================================================
     Handlers
  ============================================================ */

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent
  ) => {
    const { name, value } = e.target;

    setFormData(prev => {
      const updated = {
        ...prev,
        [name as keyof typeof prev]: value,
      };

      // 🔹 When course changes
      if (name === "courseId") {
        const courseId = Number(value);

        if (!isNaN(courseId) && courseId > 0) {
          dispatch(fetchModulesByCourse(courseId));
        }

        // 🔹 Reset module when course changes
        updated.moduleId = "";
      }

      return updated;
    });
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
      if (!id) throw new Error("Exam ID missing");

      const examId = Array.isArray(id) ? Number(id[0]) : Number(id);

      const payload = {
        id: examId,
        examName: formData.examName,
        examDescription: formData.examDescription,
        examDurationHrs: Number(formData.examDurationHrs),
        examTotalMarks: Number(formData.examTotalMarks),
        examPassingMarks: Number(formData.examPassingMarks),
        moduleId: Number(formData.moduleId),
        courseId: formData.courseId
          ? Number(formData.courseId)
          : null,
        isActive: formData.isActive
      };

      await dispatch(updateExam(payload)).unwrap();

      await Swal.fire({
        icon: "success",
        title: "Exam Updated",
        text: "Exam updated successfully.",
        confirmButtonColor: "#3085d6",
        timer: 2000
      });

      router.push("/exams");

    } catch (err: any) {
      const errorMessage =
        err?.message ||
        err?.error ||
        "Failed to update exam";

      setError(errorMessage);
      toast.error(errorMessage);

    } finally {
      setIsSubmitting(false);
    }
  };

  /* ============================================================
     Expose
  ============================================================ */
  return {
    formData,
    courses,
    modules,
    loading,
    error: error || fetchError,
    isSubmitting,

    handleChange,
    handleStatusChange,
    handleSubmit
  };
}
