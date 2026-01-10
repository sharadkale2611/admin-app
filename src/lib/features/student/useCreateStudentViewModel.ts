"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createStudent, fetchStudents } from "./studentThunks";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { AppDispatch } from "@/lib/store";
import { ApiError, ApiResponse, CreateStudentResponse } from "./studentTypes";

export interface CreateStudentResult {
  success: boolean;
  studentId?: number;
}


export interface StudentFormData {
  // User fields
  userName: string;
  password: string;
  email: string;
  mobileNumber: string;

  // Student fields
  studentCode: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
}

export default function useCreateStudentViewModel() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<StudentFormData>({
    userName: "",
    password: "",
    email: "",
    mobileNumber: "",
    studentCode: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
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

  const handleSelectChange = (e: {
    target: { name: string; value: string };
  }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async (
    e: React.FormEvent
  ): Promise<ApiResponse<CreateStudentResponse>> => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await dispatch(createStudent(formData)).unwrap();
      console.log("Create student result:", result);

      if (result.success) {
        dispatch(fetchStudents({ page: 1 }));

        toast.success(result.message ?? "Student created successfully");

        return {
          success: true,
          message: result.message ?? "Student created successfully",
          data: {
            studentId: Number(result.student?.studentId),
            studentCode: result.student?.studentCode ?? "",
            userName: result.student?.userName ?? "",
            // inviteSent: result.inviteSent ?? false,
          },
        };
      }

      // backend responded but failed
      return {
        success: false,
        error: result.error ?? "Failed to create student",
        errors: result.errors ?? null,
      };
    } catch (err: any) {
      const apiError = {
        success: false,
        error:
          err?.error ||
          err?.response?.data?.message ||
          err?.message ||
          "Something went wrong",
        errors: err?.errors ?? null,
      };

      toast.error(apiError.error);
      setError({ error: apiError.error, errors: apiError.errors });

      return apiError;
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
    handleSubmit,
  };
}
