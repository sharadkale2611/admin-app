"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";

import {
  fetchPlanSaaSFeatureById,
  updatePlanSaaSFeature,
} from "./planSaaSFeatureThunks";

import { fetchSubscriptionPlans } from "@/lib/features/subscriptionPlan/subscriptionPlanThunks";
import { fetchSaaSFeatures } from "@/lib/features/saasfeature/saasFeatureThunks";

import { ApiError } from "./planSaaSFeatureTypes";

export default function useEditPlanSaaSFeatureViewModel() {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  /* ===============================
     REDUX STATE
  ================================ */

  const { currentPlanSaaSFeature, loading } = useAppSelector(
    (state: RootState) => state.planSaaSFeatures
  );

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
  const [error, setError] = useState<ApiError | null>(null);

  /* ===============================
     FETCH BY ID
  ================================ */

  useEffect(() => {
    if (id) dispatch(fetchPlanSaaSFeatureById(Number(id)));
  }, [dispatch, id]);

  /* ===============================
     LOAD DROPDOWN DATA
  ================================ */

  useEffect(() => {
    dispatch(fetchSubscriptionPlans());
    dispatch(fetchSaaSFeatures());
  }, [dispatch]);

  /* ===============================
     SET FORM DATA
  ================================ */

  useEffect(() => {
    if (currentPlanSaaSFeature) {
      setFormData({
        planId: String(currentPlanSaaSFeature.planId ?? ""),
        saaSFeatureId: String(
          currentPlanSaaSFeature.saaSFeatureId ?? ""
        ),
        isEnabled: currentPlanSaaSFeature.isEnabled ?? true,
        limitType: currentPlanSaaSFeature.limitType ?? "",
        limitValue:
          currentPlanSaaSFeature.limitValue?.toString() ?? "",
      });
    }
  }, [currentPlanSaaSFeature]);

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

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      await dispatch(
        updatePlanSaaSFeature({
          id: Number(id),
          dto: {
            planId: Number(formData.planId),
            saaSFeatureId: Number(formData.saaSFeatureId),
            isEnabled: formData.isEnabled,
            limitType: formData.limitType || null,
            limitValue:
              formData.limitValue === ""
                ? null
                : Number(formData.limitValue),
          },
        })
      ).unwrap();

      return {
        success: true,
        message: "Plan SaaS Feature updated successfully",
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
    error,
    isSubmitting,
    subscriptionPlans: subscriptionPlans ?? [],
    saasFeatures: saasFeatures ?? [],
    handleChange,
    handleSelectChange,
    handleSubmit,
  };
}
