"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { AppDispatch } from "@/lib/store";
import { createPermission } from "./permissionThunks";
import { ApiError, CreatePermissionDto } from "./permissionTypes";
import { SelectChangeEvent } from "@mui/material";

/* ===============================
   Form State Interface
================================ */

export interface PermissionFormData {
  permissionKey: string;
  module: string;
  description?: string;
  isActive: boolean;
}

export default function useCreatePermissionViewModel() {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<PermissionFormData>({
    permissionKey: "",
    module: "",
    description: "",
    isActive: true,
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
      [name]: value === "true" ? true : value === "false" ? false : value,
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

      if (!formData.permissionKey || !formData.module) {
        throw new Error("Permission Key and Module are required");
      }

      /* ---------- Build DTO ---------- */

      const payload: CreatePermissionDto = {
        permissionKey: formData.permissionKey.trim(),
        module: formData.module.trim(),
        description: formData.description || null,
        isActive: formData.isActive,
      };

      /* ---------- Dispatch Thunk ---------- */

      const result = await dispatch(createPermission(payload)).unwrap();

      if (result.success) {
        toast.success(result.message || "Permission created successfully");

        return {
          success: true,
          message: result.message || "Permission created successfully",
        };
      }

      throw new Error("Failed to create permission");
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
  };
}
