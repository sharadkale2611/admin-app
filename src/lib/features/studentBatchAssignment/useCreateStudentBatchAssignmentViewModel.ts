"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";

import { createSBA } from "./studentBatchAssignmentThunks";
import { ApiError } from "./studentBatchAssignmentTypes";
import { toast } from "react-toastify";

export default function useCreateStudentBatchAssignmentViewModel() {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    studentEnrollmentId: 0,
    batchId: 0,
    assignmentDate: "",
    assignmentType: "",
    remark: "",
    isActive: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (name: any, value: number) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (
        !formData.studentEnrollmentId ||
        !formData.batchId ||
        !formData.assignmentDate ||
        !formData.assignmentType
      ) {
        throw new Error("Please fill all required fields");
      }

      const payload = {
        ...formData,
        assignmentDate: new Date(formData.assignmentDate).toISOString(),
      };

      const result = await dispatch(createSBA(payload)).unwrap();

      if (result.success) {
        return {
          success: true,
          message: result.message || "Assignment created successfully",
        };
      } else {
        throw new Error(result.message || "Failed to create assignment");
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Something went wrong";

      toast.error(message);
      setError({ error: message, errors: null });

      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    error,
    handleChange,
    handleSelectChange,
    handleNumberChange,
    handleSubmit,
  };
}
