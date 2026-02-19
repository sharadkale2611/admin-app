"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import {
  fetchSaaSFeatureById,
  updateSaaSFeature,
} from "./saasFeatureThunks";
import { ApiError } from "./saasFeatureTypes";

export default function useEditSaaSFeatureViewModel() {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  /* ===============================
     REDUX STATE
  ================================ */

  const { currentSaaSFeature, loading } = useAppSelector(
    (state: RootState) => state.saasFeatures
  );

  /* ===============================
     LOCAL STATE
  ================================ */

  const [formData, setFormData] = useState({
    featureKey: "",
    featureName: "",
    description: "",
    isActive: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  /* ===============================
     FETCH BY ID
  ================================ */

  useEffect(() => {
    if (id) dispatch(fetchSaaSFeatureById(Number(id)));
  }, [dispatch, id]);

  /* ===============================
     SET FORM DATA
  ================================ */

  useEffect(() => {
    if (currentSaaSFeature) {
      setFormData({
        featureKey: currentSaaSFeature.featureKey ?? "",
        featureName: currentSaaSFeature.featureName ?? "",
        description: currentSaaSFeature.description ?? "",
        isActive: currentSaaSFeature.isActive ?? true,
      });
    }
  }, [currentSaaSFeature]);

  /* ===============================
     HANDLERS
  ================================ */

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
        updateSaaSFeature({
          id: Number(id),
          dto: formData,
        })
      ).unwrap();

      return {
        success: true,
        message: "SaaS Feature updated successfully",
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
    handleChange,
    handleSubmit,
  };
}
