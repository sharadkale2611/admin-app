"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

import { useAppDispatch } from "@/lib/hooks";
import type { RootState } from "@/lib/store";

import {
  fetchExamAttemptQuestions,
} from "@/lib/features/examAttemptQuestion/examAttemptQuestionThunks";

import {
  fetchQuestionOptionsByQuestionId,
} from "@/lib/features/questionOption/questionOptionThunks";

import {
  fetchStudentAnswerById,
  updateStudentAnswer,
} from "./studentAnswerThunks";

import {
  UpdateStudentAnswerDto,
} from "./studentAnswerTypes";


/* ============================================================
   Form Type
============================================================ */

export interface EditStudentAnswerFormData {

  attemptQuestionId: string;

  answerText: string;

  file: File | null;

  score: string;

  isCorrect: boolean;

}


/* ============================================================
   ViewModel
============================================================ */

export default function useEditStudentAnswerViewModel(
  studentAnswerId: number
) {

  const dispatch = useAppDispatch();


  type QuestionOptionDto = {

    optionId: number;

    questionId: number;

    optionText: string;

    isCorrect: boolean;

  };


  const [questionOptions, setQuestionOptions] =
    useState<QuestionOptionDto[]>([]);

  const [optionsLoading, setOptionsLoading] =
    useState(false);

  const [selectedOptions, setSelectedOptions] =
    useState<number[]>([]);


  /* ============================================================
     Load attempt questions
  ============================================================ */

  useEffect(() => {

    dispatch(fetchExamAttemptQuestions());

  }, [dispatch]);


  /* ============================================================
     Store selectors
  ============================================================ */

  const attemptQuestions = useSelector(
    (state: RootState) =>
      state.examAttemptQuestions.attemptQuestions || []
  );



  /* ============================================================
     Local State
  ============================================================ */

  const [formData, setFormData] =
    useState<EditStudentAnswerFormData>({

      attemptQuestionId: "",

      answerText: "",

      file: null,

      score: "",

      isCorrect: false,

    });

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);



  /* ============================================================
     Load student answer
  ============================================================ */

  useEffect(() => {

    if (!studentAnswerId)
      return;

    (async () => {

      try {

        const result = await dispatch(
          fetchStudentAnswerById(
            studentAnswerId
          )
        ).unwrap();


        setFormData({

          attemptQuestionId:
            result.attemptQuestionId.toString(),

          answerText:
            result.answerText || "",

          file: null,

          score:
            result.score?.toString() || "",

          isCorrect:
            result.isCorrect || false,

        });


        if (result.selectedOptionIds) {

          setSelectedOptions(
            result.selectedOptionIds
              .split(",")
              .map(Number)
          );

        }

      }

      finally {

        setIsLoading(false);

      }

    })();

  }, [studentAnswerId]);



  /* ============================================================
     Load Options
  ============================================================ */

  useEffect(() => {

    const attemptQuestionId =
      Number(formData.attemptQuestionId);

    if (!attemptQuestionId)
      return;

    const aq = attemptQuestions.find(
      (x: any) =>
        x.attemptQuestionId ===
        attemptQuestionId
    );

    const questionId =
      aq?.questionId || 0;

    if (!questionId)
      return;

    (async () => {

      try {

        setOptionsLoading(true);

        const result =
          await dispatch(
            fetchQuestionOptionsByQuestionId(
              questionId
            )
          ).unwrap();

        setQuestionOptions(result);

      }

      finally {

        setOptionsLoading(false);

      }

    })();

  }, [formData.attemptQuestionId, attemptQuestions]);



  /* ============================================================
     Handlers
  ============================================================ */

  const handleChange = (
    e: React.ChangeEvent<any>
  ) => {

    const { name, value, type, checked } =
      e.target;

    setFormData(prev => ({

      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : value,

    }));

  };


  const handleOptionToggle =
    (optionId: number) => {

      setSelectedOptions(prev =>

        prev.includes(optionId)

          ? prev.filter(
              x => x !== optionId
            )

          : [...prev, optionId]

      );

    };


  const handleFileChange =
    (e: React.ChangeEvent<HTMLInputElement>) => {

      const file =
        e.target.files?.[0] || null;

      setFormData(prev => ({
        ...prev,
        file,
      }));

    };



  /* ============================================================
     Submit
  ============================================================ */

  const handleSubmit =
    async (e: React.FormEvent) => {

      e.preventDefault();

      setIsSubmitting(true);

      setError(null);

      try {

        const payload:
          UpdateStudentAnswerDto = {

          file: formData.file,

          score:
            formData.score === ""
              ? null
              : Number(formData.score),

          isCorrect:
            formData.isCorrect,

          evaluatedBy:
            "Teacher",

        };


        await dispatch(

          updateStudentAnswer({

            id: studentAnswerId,

            dto: payload,

          })

        ).unwrap();


        toast.success(
          "Student answer updated successfully"
        );

        return { success: true };

      }

      catch (err: any) {

        const msg =
          err?.message ||
          "Update failed";

        setError(msg);

        toast.error(msg);

      }

      finally {

        setIsSubmitting(false);

      }

    };



  return {

    formData,

    questionOptions,

    selectedOptions,

    optionsLoading,

    isSubmitting,

    isLoading,

    error,

    handleChange,

    handleFileChange,

    handleOptionToggle,

    handleSubmit,

  };

}
