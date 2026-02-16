"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { RootState } from "@/lib/store";
import { useAppDispatch } from "@/lib/hooks";

import {
    fetchExamAttemptById,
    updateExamAttempt,
} from "./examAttemptThunks";

import { fetchExamPapers } from "@/lib/features/exampaper/examPaperThunks";
import { fetchStudentList } from "@/lib/features/student/studentThunks";

import { ApiError } from "./examAttemptTypes";


/* ===============================
   Form Interface
================================ */

export interface EditExamAttemptFormData {

    examPaperId: string;

    studentId: string;

    status: string;

    totalScore: string;

    submittedAt: string;

}


/* ===============================
   ViewModel
================================ */

export default function useEditExamAttemptViewModel() {

    const { id } = useParams();

    const dispatch = useAppDispatch();


    /* ===============================
       Store Selectors
    ================================ */

    const { currentAttempt, loading } =
        useSelector(
            (state: RootState) =>
                state.examAttempts
        );


    /* ===============================
       Local State
    ================================ */

    const [formData, setFormData] =
        useState<EditExamAttemptFormData>({

            examPaperId: "",

            studentId: "",

            status: "",

            totalScore: "",

            submittedAt: "",

        });


    const [isSubmitting, setIsSubmitting] =
        useState(false);


    const [error, setError] =
        useState<ApiError | null>(null);





    useEffect(() => {
        dispatch(fetchExamPapers());
        dispatch(fetchStudentList());
    }, [dispatch]);


    const examPapers = useSelector(
        (state: RootState) => state.examPapers.examPapers || []
    );

    const students = useSelector(
        (state: RootState) => state.students.students || []
    );


    /* ===============================
       Load Attempt
    ================================ */

    useEffect(() => {

        if (id) {

            dispatch(
                fetchExamAttemptById(
                    Number(id)
                )
            );

        }

    }, [dispatch, id]);



    /* ===============================
       Populate Form
    ================================ */

    useEffect(() => {

        if (currentAttempt) {

            setFormData({

                examPaperId:
                    currentAttempt.examPaperId?.toString() || "",

                studentId:
                    currentAttempt.studentId?.toString() || "",

                status:
                    currentAttempt.status || "",

                totalScore:
                    currentAttempt.totalScore?.toString() || "",

                submittedAt:
                    currentAttempt.submittedAt
                        ? currentAttempt.submittedAt.substring(0, 16)
                        : "",

            });

        }

    }, [currentAttempt]);



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
                    "Exam Attempt ID missing"
                );


            await dispatch(
                updateExamAttempt({

                    id: Number(id),

                    dto: {

                        status: formData.status,

                        totalScore:
                            formData.totalScore
                                ? Number(
                                    formData.totalScore
                                )
                                : undefined,

                        submittedAt:
                            formData.submittedAt
                                ? new Date(
                                    formData.submittedAt
                                ).toISOString()
                                : undefined,

                    },

                })
            ).unwrap();


            return {

                success: true,

                message:
                    "Exam attempt updated successfully",

            };


        } catch (err: any) {

            const message =
                err?.message ||
                err?.error ||
                "Failed to update exam attempt";


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

        examPapers,

        students,

        loading,

        isSubmitting,

        error,

        handleChange,

        handleSubmit,

    };

}
