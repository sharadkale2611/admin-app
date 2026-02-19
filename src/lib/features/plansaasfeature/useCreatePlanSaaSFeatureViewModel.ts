"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import type { RootState } from "@/lib/store";

import { createPlanSaaSFeature } from "./planSaaSFeatureThunks";
import { fetchSubscriptionPlans } from "@/lib/features/subscriptionPlan/subscriptionPlanThunks";
import { fetchSaaSFeatures } from "@/lib/features/saasfeature/saasFeatureThunks";

export default function useCreatePlanSaaSFeatureViewModel() {
  const dispatch = useAppDispatch();

  /* ===============================
     REDUX STATE (for dropdowns)
  ================================ */

  const { subscriptionPlans } = useAppSelector(
    (state: RootState) => state.subscriptionPlans
  );

  const { saasFeatures } = useAppSelector(
    (state: RootState) => state.saasFeatures
  );

  /* ===============================
     LOCAL STATE
  ================================ */

  const [formData, setFormData] = useState({
    planId: "",
    saaSFeatureId: "",
    isEnabled: true,
    limitType: "",
    limitValue: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ===============================
     LOAD DROPDOWN DATA
  ================================ */

  useEffect(() => {
    dispatch(fetchSubscriptionPlans());
    dispatch(fetchSaaSFeatures());
  }, [dispatch]);

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
          : name === "limitValue"
          ? value === ""
            ? ""
            : Number(value)
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
    setIsSubmitting(true);

    try {
      await dispatch(
        createPlanSaaSFeature({
          planId: Number(formData.planId),
          saaSFeatureId: Number(formData.saaSFeatureId),
          isEnabled: formData.isEnabled,
          limitType: formData.limitType || null,
          limitValue:
            formData.limitValue === "" ? null : Number(formData.limitValue),
        })
      ).unwrap();

      toast.success("Plan SaaS Feature created successfully");
      return { success: true };
    } catch (err: any) {
      toast.error(err?.error || "Create failed");
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
    subscriptionPlans: subscriptionPlans ?? [],
    saasFeatures: saasFeatures ?? [],
    handleChange,
    handleSelectChange,
    handleSubmit,
  };
}
