"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";

import {
  fetchSubscriptionPlanById,
  updateSubscriptionPlan,
} from "./subscriptionPlanThunks";

import { ApiError } from "./subscriptionPlanTypes";

export default function useEditSubscriptionPlanViewModel() {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  /* ===============================
     REDUX STATE
  ================================ */

  // alias use केला — component मध्ये short नाव currentPlan
  const { currentSubscriptionPlan: currentPlan, loading } = useAppSelector(
    (state: RootState) => state.subscriptionPlans
  );

  /* ===============================
     LOCAL STATE
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
     FETCH BY ID
  ================================ */

  useEffect(() => {
    if (id) {
      dispatch(fetchSubscriptionPlanById(Number(id)));
    }
  }, [dispatch, id]);

  /* ===============================
     SET FORM DATA
  ================================ */

  useEffect(() => {
    if (currentPlan) {
      setFormData({
        planCode: currentPlan.planCode ?? "",
        planName: currentPlan.planName ?? "",
        price: currentPlan.price ?? 0,
        billingCycle: currentPlan.billingCycle ?? "Monthly",
        isActive: currentPlan.isActive ?? true,
      });
    }
  }, [currentPlan]);

  /* ===============================
     HANDLERS
  ================================ */

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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

  const handleSelectChange = (e: ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = e.target;

    if (!name) return;

    setFormData((prev) => ({
      ...prev,
      [name]: value as string,
    }));
  };

  /* ===============================
     SUBMIT
  ================================ */

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setError(null);

      await dispatch(
        updateSubscriptionPlan({
          id: Number(id),
          dto: formData,
        })
      ).unwrap();

      return {
        success: true,
        message: "Subscription Plan updated successfully",
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
    loading,
    isSubmitting,
    error,
    handleChange,
    handleSelectChange,
    handleSubmit,
  };
}
