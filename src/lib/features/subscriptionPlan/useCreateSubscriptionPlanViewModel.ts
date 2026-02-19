"use client";

import { useState } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { createSubscriptionPlan } from "./subscriptionPlanThunks";
import { ApiError } from "./subscriptionPlanTypes";

export default function useCreateSubscriptionPlanViewModel() {
  const dispatch = useAppDispatch();

  /* ===============================
     FORM STATE
  ================================ */

  const [formData, setFormData] = useState({
    planCode: "",
    planName: "",
    price: 0,
    billingCycle: "Monthly",
    isActive: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  /* ===============================
     HANDLERS
  ================================ */

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "price"
          ? Number(value)
          : value,
    }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ===============================
     SUBMIT
  ================================ */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setError(null);

      await dispatch(createSubscriptionPlan(formData)).unwrap();

      return {
        success: true,
        message: "Subscription Plan created successfully",
      };
    } catch (err: any) {
      setError(err);
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ===============================
     RETURN
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
