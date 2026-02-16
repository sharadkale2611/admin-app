"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { RootState } from "@/lib/store";
import { useAppDispatch } from "@/lib/hooks";

import {
    fetchExamAttemptQuestionById,
    updateExamAttemptQuestion,
} from "./examAttemptQuestionThunks";

import { ApiError } from "./examAttemptQuestionTypes";
import { fetchQuestionTypes } from "../questionType/questionTypeThunks";
import { fetchExamAttempts } from "../examAttempt/examAttemptThunks";
import { fetchQuestions } from "../question/questionThunks";


/* ===============================
   Form Interface
================================ */

export interface EditExamAttemptQuestionFormData {

    examAttemptId: string;

    questionId: string;

    questionTypeId: string;

    marksAssigned: string;

    isEvaluated: string;

}


/* ===============================
   ViewModel
================================ */

export default function useEditExamAttemptQuestionViewModel() {

    const { id } = useParams();

    const dispatch = useAppDispatch();


    /* ===============================
       Store Selectors
    ================================ */

    const { currentAttemptQuestion, loading } =
        useSelector(
            (state: RootState) =>
                state.examAttemptQuestions
        );


    /* ===============================
       Local State
    ================================ */

    const [formData, setFormData] =
        useState<EditExamAttemptQuestionFormData>({

            examAttemptId: "",

        questionId: "",

        questionTypeId: "",

        marksAssigned: "",

        isEvaluated: "false",

        });


    const [isSubmitting, setIsSubmitting] =
        useState(false);


    const [error, setError] =
        useState<ApiError | null>(null);


    /* ============================================================
         Load Required Data Once
      ============================================================ */

    useEffect(() => {
        dispatch(fetchExamAttempts());

        dispatch(fetchQuestions());

        dispatch(fetchQuestionTypes());
    }, [dispatch]);

    /* ============================================================
       Store Selectors
    ============================================================ */

    const examAttempts = useSelector(
        (state: RootState) =>
            state.examAttempts.attempts || []
    );

    const allQuestions = useSelector(
        (state: RootState) =>
            state.questions.questions || []
    );

    const questionTypes = useSelector(
        (state: RootState) =>
            state.questionTypes.questionTypes || []
    );




    /* ===============================
       Load Attempt Question
    ================================ */

    useEffect(() => {

        if (id) {

            dispatch(
                fetchExamAttemptQuestionById(
                    Number(id)
                )
            );

        }

    }, [dispatch, id]);



    /* ===============================
       Populate Form
    ================================ */

useEffect(() => {

    if (currentAttemptQuestion) {

        setFormData({

            examAttemptId:
                currentAttemptQuestion.examAttemptId.toString(),

            questionId:
                currentAttemptQuestion.questionId.toString(),

            questionTypeId:
                currentAttemptQuestion.questionTypeId.toString(),

            marksAssigned:
                currentAttemptQuestion.marksAssigned?.toString() || "",

            isEvaluated:
                currentAttemptQuestion.isEvaluated
                    ? "true"
                    : "false",

        });

    }

}, [currentAttemptQuestion]);




    /* ===============================
       Change Handlers
    ================================ */

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement |
            HTMLTextAreaElement |
            HTMLSelectElement
        >
    ) => {

        const { name, value } = e.target;

        setFormData((prev) => ({

            ...prev,

            [name]: value,

        }));

    };



    /* ===============================
       Submit
    ================================ */

    const handleSubmit = async (
        e: React.FormEvent
    ): Promise<
        | {
            success: boolean;
            message: string;
        }
        | undefined
    > => {

        e.preventDefault();

        setIsSubmitting(true);

        setError(null);


        try {

            if (!id)
                throw new Error(
                    "Attempt Question ID missing"
                );


            await dispatch(
                updateExamAttemptQuestion({

                    id: Number(id),

                    dto: {

                        marksAssigned:
                            formData.marksAssigned
                                ? Number(
                                    formData.marksAssigned
                                )
                                : null,

                        isEvaluated:
                            formData.isEvaluated === "true",

                    },

                })
            ).unwrap();


            return {

                success: true,

                message:
                    "Attempt question updated successfully",

            };


        } catch (err: any) {

            const message =
                err?.message ||
                err?.error ||
                "Failed to update attempt question";


            setError({

                error: message,

                errors: null,

            });


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

        loading,

        questionTypes,
        examAttempts,
       questions: allQuestions,


        isSubmitting,

        error,

        handleChange,

        handleSubmit,

    };

}
