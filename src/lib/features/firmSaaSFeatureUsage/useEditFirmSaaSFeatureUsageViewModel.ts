"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import type { RootState } from "@/lib/store";

import {
  fetchFirmSaaSFeatureUsageByKeys,
  updateFirmSaaSFeatureUsage,
} from "./firmSaaSFeatureUsageThunks";

import type { ApiError } from "./firmSaaSFeatureUsageTypes";

export default function useEditFirmSaaSFeatureUsageViewModel() {
  const params = useParams();
  const firmIdParam = params?.firmId;
  const saasFeatureIdParam = params?.saasFeatureId;

  const firmId = Number(firmIdParam);
  const saasFeatureId = Number(saasFeatureIdParam);

  const dispatch = useAppDispatch();
  const { current, loading } = useAppSelector((state: RootState) => state.firmSaaSFeatureUsage);

  const [formData, setFormData] = useState({
    firmId: "",
    saaSFeatureId: "",
    usedCount: "0",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    if (Number.isFinite(firmId) && Number.isFinite(saasFeatureId)) {
      dispatch(fetchFirmSaaSFeatureUsageByKeys({ firmId, saasFeatureId }));
    }
  }, [dispatch, firmId, saasFeatureId]);

  useEffect(() => {
    if (current) {
      setFormData({
        firmId: String(current.firmId ?? ""),
        saaSFeatureId: String(current.saaSFeatureId ?? ""),
        usedCount: String(current.usedCount ?? 0),
      });
    }
  }, [current]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      const usedCount = Number(formData.usedCount);
      if (!Number.isFinite(usedCount) || usedCount < 0) throw new Error("Used Count must be >= 0");

      await dispatch(
        updateFirmSaaSFeatureUsage({
          firmId,
          saasFeatureId,
          dto: { usedCount },
        })
      ).unwrap();

      return { success: true, message: "Usage record updated successfully" };
    } catch (err: any) {
      setError(err);
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  return { formData, loading, error, isSubmitting, handleChange, handleSubmit };
}