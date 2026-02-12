"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { RootState, AppDispatch } from "@/lib/store";
import {
  fetchPermissionById,
  updatePermission,
} from "./permissionThunks";
import { ApiError } from "./permissionTypes";

/* ===============================
   Form Data Interface
================================ */

export interface PermissionFormData {
  permissionKey: string;
  module: string;
  description?: string;
  isActive: boolean;
}

/* ===============================
   ViewModel
================================ */

export default function useEditPermissionViewModel() {
  const router = useRouter();
  const { id } = useParams();
  const dispatch: AppDispatch = useDispatch();

  const {
    currentPermission,
    loading,
    error: fetchError,
  } = useSelector((state: RootState) => state.permissions);

  const [formData, setFormData] = useState<PermissionFormData>({
    permissionKey: "",
    module: "",
    description: "",
    isActive: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  /* ===============================
     Load Permission
  ================================ */

  useEffect(() => {
    if (id) {
      dispatch(fetchPermissionById(Number(id)));
    }
  }, [dispatch, id]);

  /* ===============================
     Populate Form
  ================================ */

  useEffect(() => {
    if (currentPermission) {
      setFormData({
        permissionKey: currentPermission.permissionKey || "",
        module: currentPermission.module || "",
        description: currentPermission.description || "",
        isActive: currentPermission.isActive,
      });
    }
  }, [currentPermission]);

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

  const handleBooleanChange = (e: {
    target: { name: string; checked: boolean };
  }) => {
    const { name, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: checked,
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
      if (!id) throw new Error("Permission ID is required");

      if (!formData.permissionKey || !formData.module) {
        throw new Error("Permission Key and Module are required");
      }

      const result = await dispatch(
        updatePermission({
          id: Number(id),
          permissionKey: formData.permissionKey.trim(),
          module: formData.module.trim(),
          description: formData.description || null,
          isActive: formData.isActive,
        })
      ).unwrap();

      return {
        success: true,
        message: result.message || "Permission updated successfully",
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
    handleBooleanChange,
    handleSubmit,
  };
}
