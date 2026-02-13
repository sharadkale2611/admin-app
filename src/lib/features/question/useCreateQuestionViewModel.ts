"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SelectChangeEvent } from "@mui/material";
import { toast } from "react-toastify";

import { useAppDispatch } from "@/lib/hooks";
import type { RootState } from "@/lib/store";

import { fetchCoursesListOptions } from "@/lib/features/course/courseThunks";
import { fetchModulesByCourse } from "@/lib/features/courseModules/courseModuleThunks";
import { createQuestion } from "./questionThunks";

import { CreateQuestionDto } from "./questionTypes";

/* ============================================================
   Form Type
============================================================ */

export interface QuestionFormData {
  questionTypeId: string;
  courseId: string;
  moduleId: string;

  title: string;
  description: string;

  marks: string;
  difficultyLevel: string;
  negativeMarks: string;
}

/* ============================================================
   ViewModel
============================================================ */

export default function useCreateQuestionViewModel() {
  const dispatch = useAppDispatch();

  /* ============================================================
     Load Courses Once (IMPORTANT)
  ============================================================ */
  useEffect(() => {
    dispatch(fetchCoursesListOptions());
  }, [dispatch]);

  /* ============================================================
     Store Selectors
  ============================================================ */

  const courses = useSelector(
    (state: RootState) => state.courses.courses || []
  );

  const courseModulesByCourse = useSelector(
    (state: RootState) =>
      state.courseModules.courseModulesByCourse || []
  );

  const modules = courseModulesByCourse.map((cm) => ({
    moduleId: cm.moduleId,
    moduleName:
      cm.moduleName ?? `Module #${cm.moduleId}`,
  }));

  /* ============================================================
     Local State
  ============================================================ */

  const [formData, setFormData] =
    useState<QuestionFormData>({
      questionTypeId: "",
      courseId: "",
      moduleId: "",
      title: "",
      description: "",
      marks: "",
      difficultyLevel: "",
      negativeMarks: "",
    });

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  /* ============================================================
     Change Handler (CASCADING LOGIC HERE)
  ============================================================ */

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } =
      e.target as HTMLInputElement;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      // 🔥 When Course Changes
      if (name === "courseId") {
        if (value) {
          const numericCourseId = Number(value);
          if (!isNaN(numericCourseId)) {
            dispatch(
              fetchModulesByCourse(numericCourseId)
            );
          }
        }

        // Reset module when course changes
        updated.moduleId = "";
      }

      return updated;
    });
  };

  /* ============================================================
     Submit
  ============================================================ */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!formData.questionTypeId)
        throw new Error("Question Type is required");

      if (!formData.title)
        throw new Error("Title is required");

      if (!formData.marks)
        throw new Error("Marks is required");

      if (!formData.difficultyLevel)
        throw new Error(
          "Difficulty Level is required"
        );

      const payload: CreateQuestionDto = {
        questionTypeId: Number(
          formData.questionTypeId
        ),
        courseId: formData.courseId
          ? Number(formData.courseId)
          : undefined,
        moduleId: formData.moduleId
          ? Number(formData.moduleId)
          : undefined,
        title: formData.title,
        description:
          formData.description || undefined,
        marks: Number(formData.marks),
        difficultyLevel:
          formData.difficultyLevel as any,
        negativeMarks: formData.negativeMarks
          ? Number(formData.negativeMarks)
          : 0,
      };

      await dispatch(
        createQuestion(payload)
      ).unwrap();

      toast.success(
        "Question created successfully"
      );

      return { success: true };
    } catch (err: any) {
      const msg =
        err?.message ||
        err?.error ||
        "Failed to create question";

      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    courses,
    modules,
    error,
    isSubmitting,
    handleChange,
    handleSubmit,
  };
}
