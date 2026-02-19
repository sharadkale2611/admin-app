"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/lib/hooks";
import { createFirmSaaSFeature } from "./firmSaaSFeatureThunks";

export default function useCreateFirmSaaSFeatureViewModel() {
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    firmId: "",
    saaSFeatureId: "",
    isEnabled: true,
    limitType: "",
    limitValue: "",
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
      const firmIdNum = Number(formData.firmId);
      const saasFeatureIdNum = Number(formData.saaSFeatureId);

      if (!firmIdNum) throw new Error("Firm is required");
      if (!saasFeatureIdNum) throw new Error("SaaS Feature is required");

      const limitValue =
        formData.limitValue.trim() === ""
          ? null
          : Number.isFinite(Number(formData.limitValue))
            ? Number(formData.limitValue)
            : null;

      await dispatch(
        createFirmSaaSFeature({
          firmId: firmIdNum,
          saaSFeatureId: saasFeatureIdNum,
          isEnabled: Boolean(formData.isEnabled),
          limitType: formData.limitType?.trim() ? formData.limitType.trim() : null,
          limitValue,
        })
      ).unwrap();

      toast.success("Firm SaaS Feature created successfully");
      return { success: true };
    } catch (err: any) {
      toast.error(err?.message || err?.error || "Create failed");
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  return { formData, handleChange, handleSubmit, isSubmitting };
}