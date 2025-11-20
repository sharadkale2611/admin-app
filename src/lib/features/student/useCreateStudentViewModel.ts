"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createStudent } from "./studentThunks";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { AppDispatch } from "@/lib/store";
import { ApiError } from "./studentTypes";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Basic validation
      if (
        !formData.userName ||
        !formData.password ||
        !formData.email ||
        !formData.studentCode ||
        !formData.firstName ||
        !formData.lastName
      ) {
        throw new Error("Please fill in all required fields");
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        throw new Error("Please enter a valid email address");
      }

      // Call createStudent thunk
      const result = await dispatch(createStudent(formData)).unwrap();

      if (result.success) {
        // toast.success(result.message || "Student created successfully");
        return {
          success: true,
          message: result.message || "Student created successfully",
        };

        // // Reset form
        // setFormData({
        //   userName: "",
        //   password: "",
        //   email: "",
        //   mobileNumber: "",
        //   studentCode: "",
        //   firstName: "",
        //   lastName: "",
        //   dateOfBirth: "",
        //   gender: "",
        // });

        //  setTimeout(() => {
        //    router.push("/students");
        //  }, 1500);
      } else {
        throw new Error(result.error || "Failed to create student");
      }
    } catch (err: any) {
      // If error came from our thunk rejectWithValue()
      if (err?.error) {
        toast.error(err.error);
        setError(err);
        return;
      }

      // If error unexpectedly came from axios
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

  return {
    formData,
    isSubmitting,
    error,
    handleChange,
    handleSelectChange,
    handleSubmit,
  };
}
