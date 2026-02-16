"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

import { useAppDispatch } from "@/lib/hooks";
import type { RootState } from "@/lib/store";

import { fetchExamAttemptQuestions } from "@/lib/features/examAttemptQuestion/examAttemptQuestionThunks";
import { fetchQuestionOptionsByQuestionId } from "@/lib/features/questionOption/questionOptionThunks";


import { createStudentAnswer } from "./studentAnswerThunks";
import { CreateStudentAnswerDto } from "./studentAnswerTypes";

/* ============================================================
   Form Type
============================================================ */

export interface StudentAnswerFormData {
    attemptQuestionId: string;

    answerText: string;

    selectedOptionIds: string;

    file: File | null;
}

/* ============================================================
   ViewModel
============================================================ */

export default function useCreateStudentAnswerViewModel() {

    const dispatch = useAppDispatch();

    type QuestionOptionDto = {
        optionId: number;
        questionId: number;
        optionText: string;
        isCorrect: boolean;
    };

    const [questionOptions, setQuestionOptions] = useState<QuestionOptionDto[]>([]);

    const [optionsLoading, setOptionsLoading] =
        useState(false);

    const [selectedOptions, setSelectedOptions] = useState<number[]>([]);


    /* ============================================================
       Load Required Data Once
    ============================================================ */

    useEffect(() => {

        dispatch(fetchExamAttemptQuestions());

    }, [dispatch]);



    /* ============================================================
       Store Selectors
    ============================================================ */

    const attemptQuestions = useSelector(
        (state: RootState) =>
            state.examAttemptQuestions.attemptQuestions || []
    );

    /* ============================================================
       Local State
    ============================================================ */

    const [formData, setFormData] =
        useState<StudentAnswerFormData>({
            attemptQuestionId: "",

            answerText: "",

            selectedOptionIds: "",

            file: null,
        });

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);
    useEffect(() => {
        const attemptQuestionId = Number(formData.attemptQuestionId || 0);
        if (!attemptQuestionId) {
            setQuestionOptions([]);
            setSelectedOptions([]);
            return;
        }

        const aq = attemptQuestions.find(
            (x: any) => Number(x.attemptQuestionId) === attemptQuestionId
        );

        const questionId = aq?.questionId ? Number(aq.questionId) : 0;
        if (!questionId) {
            setQuestionOptions([]);
            setSelectedOptions([]);
            return;
        }

        (async () => {
            try {
                setOptionsLoading(true);

                const res = await dispatch(fetchQuestionOptionsByQuestionId(questionId)).unwrap();

                const options: QuestionOptionDto[] =
                    (Array.isArray(res) ? res : (res as any)?.data?.data ?? (res as any)?.data ?? []) ?? [];

                setQuestionOptions(options);

                // ✅ pre-select correct options
                setSelectedOptions(options.filter(o => o.isCorrect).map(o => o.optionId));
            } finally {
                setOptionsLoading(false);
            }
        })();
    }, [dispatch, formData.attemptQuestionId, attemptQuestions]);


    /* ============================================================
       Change Handler
    ============================================================ */

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

    };


    const handleOptionToggle = (optionId: number) => {
        setSelectedOptions(prev =>
            prev.includes(optionId) ? prev.filter(x => x !== optionId) : [...prev, optionId]
        );
    };

    const handleSelectAll = () => {

        setSelectedOptions(
            questionOptions.map(o => o.optionId)
        );

    };

    const handleClearAll = () => {

        setSelectedOptions([]);

    };


    /* ============================================================
       File Change Handler
    ============================================================ */

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        const file = e.target.files?.[0] || null;

        setFormData((prev) => ({
            ...prev,
            file,
        }));

    };

    /* ============================================================
       Submit
    ============================================================ */

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        setIsSubmitting(true);

        setError(null);

        try {

            if (!formData.attemptQuestionId)
                throw new Error(
                    "Attempt Question is required"
                );

            if (!formData.answerText && !formData.file)
                throw new Error(
                    "Answer text or file is required"
                );

            const payload: CreateStudentAnswerDto =
            {

                attemptQuestionId: Number(
                    formData.attemptQuestionId
                ),

                answerText:
                    formData.answerText || null,

                selectedOptionIds:
                    selectedOptions.join(","),

                file: formData.file,

            };

            await dispatch(
                createStudentAnswer(payload)
            ).unwrap();

            toast.success(
                "Student answer created successfully"
            );

            return { success: true };

        }
        catch (err: any) {

            const msg =
                err?.message ||
                err?.error ||
                "Failed to create student answer";

            setError(msg);

            toast.error(msg);

        }
        finally {

            setIsSubmitting(false);

        }

    };

    return {

        formData,

        attemptQuestions,

        error,

        questionOptions,
        optionsLoading,
        selectedOptions,
        handleOptionToggle,
        handleSelectAll,
        handleClearAll,

        isSubmitting,

        handleChange,

        handleFileChange,

        handleSubmit,

    };

}
