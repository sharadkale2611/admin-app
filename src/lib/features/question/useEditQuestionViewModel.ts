"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { SelectChangeEvent } from "@mui/material";

import { RootState } from "@/lib/store";
import { useAppDispatch } from "@/lib/hooks";

import {
  fetchQuestionById,
  updateQuestion,
} from "./questionThunks";

import { fetchCoursesListOptions } from "@/lib/features/course/courseThunks";
import { fetchModulesByCourse } from "@/lib/features/courseModules/courseModuleThunks";

import { ApiError } from "./questionTypes";

/* ===============================
   Form Interface
================================ */

export interface EditQuestionFormData {
  questionTypeId: string;
  courseId: string;
  moduleId: string;

  title: string;
  description: string;

  marks: string;
  difficultyLevel: string;
  negativeMarks: string;

  isActive: boolean;
}

/* ===============================
   ViewModel
================================ */

export default function useEditQuestionViewModel() {
  const router = useRouter();
  const { id } = useParams();
  const dispatch = useAppDispatch();

  /* ===============================
     Load Courses Once
  ================================ */

  useEffect(() => {
    dispatch(fetchCoursesListOptions());
  }, [dispatch]);

  /* ===============================
     Store Selectors
  ================================ */

  const { currentQuestion, loading } = useSelector(
    (state: RootState) => state.questions
  );

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

  /* ===============================
     Local State
  ================================ */

  const [formData, setFormData] =
    useState<EditQuestionFormData>({
      questionTypeId: "",
      courseId: "",
      moduleId: "",
      title: "",
      description: "",
      marks: "",
      difficultyLevel: "",
      negativeMarks: "",
      isActive: true,
    });

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState<ApiError | null>(null);

  /* ===============================
     Load Question
  ================================ */

  useEffect(() => {
    if (id) {
      dispatch(fetchQuestionById(Number(id)));
    }
  }, [dispatch, id]);

  /* ===============================
     Populate Form + Load Modules
  ================================ */

  useEffect(() => {
    if (currentQuestion) {
      setFormData({
        questionTypeId:
          currentQuestion.questionTypeId?.toString() ||
          "",
        courseId:
          currentQuestion.courseId?.toString() || "",
        moduleId:
          currentQuestion.moduleId?.toString() || "",
        title: currentQuestion.title || "",
        description:
          currentQuestion.description || "",
        marks:
          currentQuestion.marks?.toString() || "",
        difficultyLevel:
          currentQuestion.difficultyLevel || "",
        negativeMarks:
          currentQuestion.negativeMarks?.toString() ||
          "",
        isActive: currentQuestion.isActive,
      });

      // 🔥 Load modules for existing course
      if (currentQuestion.courseId) {
        dispatch(
          fetchModulesByCourse(
            currentQuestion.courseId
          )
        );
      }
    }
  }, [currentQuestion, dispatch]);

  /* ===============================
     Change Handler (Cascading)
  ================================ */

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

      if (name === "courseId") {
        if (value) {
          const numericCourseId = Number(value);
          if (!isNaN(numericCourseId)) {
            dispatch(
              fetchModulesByCourse(numericCourseId)
            );
          }
        }

        updated.moduleId = "";
      }

      return updated;
    });
  };

  const handleBooleanChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      isActive: e.target.checked,
    }));
  };

  /* ===============================
     Submit
  ================================ */

  const handleSubmit = async (
    e: React.FormEvent
  ): Promise<
    { success: boolean; message: string } | undefined
  > => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!id)
        throw new Error("Question ID missing");

      if (!formData.title)
        throw new Error("Title is required");

      if (!formData.marks)
        throw new Error("Marks is required");

      if (!formData.difficultyLevel)
        throw new Error(
          "Difficulty Level is required"
        );

      await dispatch(
        updateQuestion({
          id: Number(id),
          dto: {
            title: formData.title,
            description:
              formData.description || undefined,
            marks: Number(formData.marks),
            difficultyLevel:
              formData.difficultyLevel as any,
            negativeMarks:
              formData.negativeMarks
                ? Number(formData.negativeMarks)
                : 0,
            isActive: formData.isActive,
          },
        })
      ).unwrap();

      return {
        success: true,
        message: "Question updated successfully",
      };
    } catch (err: any) {
      const message =
        err?.message ||
        err?.error ||
        "Failed to update question";

      setError({ error: message, errors: null });
      toast.error(message);
      return undefined;
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ===============================
     Expose
  ================================ */

  return {
    formData,
    courses,
    modules,
    loading,
    isSubmitting,
    error,

    handleChange,
    handleBooleanChange,
    handleSubmit,
  };
}
