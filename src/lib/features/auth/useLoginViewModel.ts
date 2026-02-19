"use client";

// src/lib/features/auth/useLoginViewModel.ts
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import { login } from "./authThunks";
import { AlertColor } from "@mui/material";
import { getOrCreateDeviceId } from "@/lib/http/deviceId";

interface LoginFormValues {
  username: string;
  password: string;
}

interface ThunkRejectValue {
  message: string;
  fieldErrors?: Record<string, string[]>;
}

export const useLoginViewModel = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [error, setError] = useState<{
    message: string;
    severity?: AlertColor;
    fieldErrors?: Record<string, string[]>;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    setError(null);
    setValidationErrors([]);

    try {
      // ✅ ensure device id exists before first API call
      getOrCreateDeviceId();

      await dispatch(login(values)).unwrap();

      // ✅ redirect AFTER successful login
      const redirectTo = searchParams.get("redirect") || "/dashboard";
      router.replace(redirectTo);
    } catch (err: unknown) {
      const e = err as ThunkRejectValue;

      if (e?.fieldErrors) {
        const errorMessages = Object.values(e.fieldErrors).flat();
        setValidationErrors(errorMessages);
      }

      setError({
        message: e?.message || "Login failed",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    handleSubmit,
    loading,
    error,
    validationErrors,
  };
};
