"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/lib/hooks";
import { createFirmSaaSFeatureUsage } from "./firmSaaSFeatureUsageThunks";

export default function useCreateFirmSaaSFeatureUsageViewModel() {
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    firmId: "",
    saaSFeatureId: "",
    usedCount: "0",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const firmId = Number(formData.firmId);
      const saasFeatureId = Number(formData.saaSFeatureId);
      const usedCount = Number(formData.usedCount);

      if (!firmId) throw new Error("Firm is required");
      if (!saasFeatureId) throw new Error("SaaS Feature is required");
      if (!Number.isFinite(usedCount) || usedCount < 0) throw new Error("Used Count must be >= 0");

      await dispatch(
        createFirmSaaSFeatureUsage({ firmId, saaSFeatureId: saasFeatureId, usedCount })
      ).unwrap();

      toast.success("Usage record created successfully");
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