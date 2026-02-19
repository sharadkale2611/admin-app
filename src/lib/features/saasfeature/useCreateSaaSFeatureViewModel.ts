"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/lib/hooks";
import { createSaaSFeature } from "./saasFeatureThunks";

export default function useCreateSaaSFeatureViewModel() {
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    featureKey: "",
    featureName: "",
    description: "",
    isActive: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await dispatch(createSaaSFeature(formData)).unwrap();
      toast.success("Feature created successfully");
      return { success: true };
    } catch (err: any) {
      toast.error(err?.error || "Create failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { formData, handleChange, handleSubmit, isSubmitting };
}
