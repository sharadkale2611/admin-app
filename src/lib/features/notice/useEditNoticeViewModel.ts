"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { RootState, AppDispatch } from "@/lib/store";
import { fetchNoticeById, updateNotice } from "./noticeThunks";
import { ApiError } from "./noticeTypes";

/* ===============================
   Form Data Interface
================================ */

export interface NoticeFormData {
    title: string;
    description: string;
    createdBy: string;
    updatedBy: string;
    createdFor: "BATCH" | "STUDENT";
    batchId?: number | "";
    studentId?: number | "";
}

/* ===============================
   ViewModel
================================ */

export default function useEditNoticeViewModel() {
    const router = useRouter();
    const { id } = useParams();
    const dispatch: AppDispatch = useDispatch();

    const {
        currentNotice,
        loading,
        error: fetchError,
    } = useSelector((state: RootState) => state.notices);

    const [formData, setFormData] = useState<NoticeFormData>({
        title: "",
        description: "",
        createdBy: "",
        updatedBy: "",
        createdFor: "BATCH",
        batchId: "",
        studentId: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);

    /* ===============================
       Load Notice
    ================================ */

    useEffect(() => {
        if (id) {
            dispatch(fetchNoticeById(Number(id)));
        }
    }, [dispatch, id]);

    /* ===============================
       Populate Form
    ================================ */

    useEffect(() => {
        if (currentNotice) {
            setFormData({
                title: currentNotice.title || "",
                description: currentNotice.description || "",
                createdBy: currentNotice.createdBy || "",
                updatedBy: currentNotice.updatedBy || "",
                createdFor: currentNotice.createdFor,
                batchId: currentNotice.batchId ?? "",
                studentId: currentNotice.studentId ?? "",
            });
        }
    }, [currentNotice]);

    /* ===============================
       Handlers
    ================================ */

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // For string selects (createdFor)
    const handleStringSelectChange = (e: {
        target: { name: string; value: string };
    }) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            // reset dependent fields
            ...(name === "createdFor" && {
                batchId: value === "BATCH" ? prev.batchId : "",
                studentId: value === "STUDENT" ? prev.studentId : "",
            }),
        }));
    };

    // For number selects (batchId / studentId)
    const handleNumberSelectChange = (e: {
        target: { name: string; value: number | string };
    }) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value === "" ? "" : Number(value),
        }));
    };

    /* ===============================
       Submit
    ================================ */

    const handleSubmit = async (
        e: React.FormEvent
    ): Promise<{ success: boolean; message: string } | undefined> => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            if (!id) throw new Error("Notice ID is required");

            if (!formData.title || !formData.description || !formData.createdBy) {
                throw new Error("Please fill in all required fields");
            }

            if (formData.createdFor === "BATCH" && !formData.batchId) {
                throw new Error("Batch is required for batch notice");
            }

            if (formData.createdFor === "STUDENT" && !formData.studentId) {
                throw new Error("Student is required for student notice");
            }

            const result = await dispatch(
                updateNotice({
                    id: Number(id),
                    title: formData.title,
                    description: formData.description,
                    createdFor: formData.createdFor,
                    updatedBy: formData.updatedBy,  
                    batchId:
                        formData.createdFor === "BATCH"
                            ? Number(formData.batchId)
                            : null,
                    studentId:
                        formData.createdFor === "STUDENT"
                            ? Number(formData.studentId)
                            : null,
                })
            ).unwrap();

            return {
                success: true,
                message: result.message || "Notice updated successfully",
            };
        } catch (err: unknown) {
            let errorMessage = "An unknown error occurred";

            if (err instanceof Error) errorMessage = err.message;

            setError({ error: errorMessage, errors: null });
            toast.error(errorMessage);
            return undefined;
        } finally {
            setIsSubmitting(false);
        }
    };

    /* ===============================
       Expose API
    ================================ */

    return {
        formData,
        isSubmitting,
        error: error || fetchError,
        errors: error || fetchError,
        loading,

        handleChange,
        handleStringSelectChange,
        handleNumberSelectChange,
        handleSubmit,
    };
}
