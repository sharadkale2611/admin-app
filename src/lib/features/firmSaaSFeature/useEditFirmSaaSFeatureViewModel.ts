"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";

import {
  fetchFirmSaaSFeatureById,
  updateFirmSaaSFeature,
} from "./firmSaaSFeatureThunks";

import { ApiError } from "./firmSaaSFeatureTypes";

export default function useEditFirmSaaSFeatureViewModel() {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const { currentFirmSaaSFeature, loading } = useAppSelector(
    (state: RootState) => state.firmSaaSFeatures
  );

  const [formData, setFormData] = useState({
    firmId: "",
    saaSFeatureId: "",
    isEnabled: true,
    limitType: "",
    limitValue: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    if (id) dispatch(fetchFirmSaaSFeatureById(Number(id)));
  }, [dispatch, id]);

  useEffect(() => {
    if (currentFirmSaaSFeature) {
      setFormData({
        firmId: currentFirmSaaSFeature.firmId?.toString?.() ?? "",
        saaSFeatureId: currentFirmSaaSFeature.saaSFeatureId?.toString?.() ?? "",
        isEnabled: Boolean(currentFirmSaaSFeature.isEnabled),
        limitType: currentFirmSaaSFeature.limitType ?? "",
        limitValue:
          currentFirmSaaSFeature.limitValue === null || currentFirmSaaSFeature.limitValue === undefined
            ? ""
            : String(currentFirmSaaSFeature.limitValue),
      });
    }
  }, [currentFirmSaaSFeature]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (!id) throw new Error("ID missing");

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
        updateFirmSaaSFeature({
          id: Number(id),
          dto: {
            firmId: firmIdNum,
            saaSFeatureId: saasFeatureIdNum,
            isEnabled: Boolean(formData.isEnabled),
            limitType: formData.limitType?.trim() ? formData.limitType.trim() : null,
            limitValue,
          },
        })
      ).unwrap();

      return { success: true, message: "Firm SaaS Feature updated successfully" };
    } catch (err: any) {
      setError(err);
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    loading,
    error,
    isSubmitting,
    handleChange,
    handleSubmit,
  };
}