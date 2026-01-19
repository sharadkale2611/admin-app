"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { AppDispatch } from "@/lib/store";
import { createNotice } from "./noticeThunks";
import { ApiError, CreateNoticeDto } from "./noticeTypes";
import { SelectChangeEvent } from "@mui/material";

/* ===============================
   Form State Interface
================================ */

export interface NoticeFormData {
  title: string;
  description: string;
  // createdBy: string;
  createdFor: "BATCH" | "STUDENT";
  batchId?: number | "";
  studentId?: number | "";
}

export default function useCreateNoticeViewModel() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<NoticeFormData>({
    title: "",
    description: "",
    // createdBy: "",
    createdFor: "BATCH",
    batchId: "",
    studentId: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  /* ===============================
     Input Handlers
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

  const handleSelectChange = (e: SelectChangeEvent) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]:
      name === "batchId" || name === "studentId"
        ? value === "" ? "" : Number(value)
        : value,
  }));
};


// For string selects (createdFor)
const handleStringSelectChange = (e: SelectChangeEvent<string>) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

// For number selects (batchId, studentId)
const handleNumberSelectChange = (e: SelectChangeEvent<number>) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value ===  null ? "" : Number(value),
  }));
};


  /* ===============================
     Submit Handler
  ================================ */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      /* ---------- Validation ---------- */

      if (!formData.title || !formData.description) {
        throw new Error("Please fill in all required fields");
      }

      if (
        formData.createdFor === "BATCH" &&
        !formData.batchId
      ) {
        throw new Error("Batch is required for batch notice");
      }

      if (
        formData.createdFor === "STUDENT" &&
        !formData.studentId
      ) {
        throw new Error("Student is required for student notice");
      }

      /* ---------- Build DTO ---------- */

      const payload: CreateNoticeDto = {
        title: formData.title,
        description: formData.description,
        // createdBy: formData.createdBy,
        createdFor: formData.createdFor,
        batchId:
          formData.createdFor === "BATCH"
            ? Number(formData.batchId)
            : null,
        studentId:
          formData.createdFor === "STUDENT"
            ? Number(formData.studentId)
            : null,
      };

      /* ---------- Dispatch Thunk ---------- */

      const result = await dispatch(createNotice(payload)).unwrap();

      if (result.success) {
        toast.success(result.message || "Notice created successfully");

        return {
          success: true,
          message: result.message || "Notice created successfully",
        };

        // Optional redirect
        // setTimeout(() => router.push("/notices"), 1500);
      }

      throw new Error("Failed to create notice");
    } catch (err: any) {
      /* ---------- Thunk Error ---------- */
      if (err?.error) {
        toast.error(err.error);
        setError(err);
        return;
      }

      /* ---------- Axios / Unknown Error ---------- */
      const apiMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Something went wrong";

      toast.error(apiMessage);
      setError({ error: apiMessage, errors: null });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ===============================
     Exposed API
  ================================ */

  return {
    formData,
    isSubmitting,
    error,
    handleChange,
    handleSelectChange,
    handleSubmit,
    handleStringSelectChange,
    handleNumberSelectChange,
  };
}
