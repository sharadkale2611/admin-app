"use client";

import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";

import {
  fetchSBAById,
  updateSBA,
} from "./studentBatchAssignmentThunks";
import {
  ApiError,
  StudentBatchAssignment,
  UpdateStudentBatchAssignmentDto,
} from "./studentBatchAssignmentTypes";
import { toast } from "react-toastify";

export default function useEditStudentBatchAssignmentViewModel() {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    id: 0,                    // studentBatchAssignmentId
    studentEnrollmentId: 0,
    batchId: 0,
    assignmentDate: "",       // "YYYY-MM-DD" for input[type=date]
    assignmentType: "",
    remark: "",
    isActive: true,
  });

  const [isLoadingAssignment, setIsLoadingAssignment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  // -----------------------------
  // Helpers
  // -----------------------------
  const clearError = () => setError(null);

  const formatDateForInput = (isoOrDateString: string | null | undefined): string => {
    if (!isoOrDateString) return "";
    const d = new Date(isoOrDateString);
    if (Number.isNaN(d.getTime())) return "";
    return d.toISOString().substring(0, 10); // YYYY-MM-DD
  };

  // -----------------------------
  // LOAD ASSIGNMENT BY ID
  // -----------------------------
const loadAssignment = useCallback(async (id: number) => {
    setIsLoadingAssignment(true);
    setError(null);

    try {
      const assignment: StudentBatchAssignment = await dispatch(
        fetchSBAById(id)
      ).unwrap();

      setFormData({
        id: assignment.studentBatchAssignmentId,
        studentEnrollmentId: assignment.studentEnrollmentId,
        batchId: assignment.batchId,
        assignmentDate: formatDateForInput(assignment.assignmentDate as any),
        assignmentType: assignment.assignmentType || "",
        remark: assignment.remark || "",
        isActive: assignment.isActive,
      });
    } catch (err: any) {
      const message =
        err?.error ||
        err?.message ||
        "Failed to load assignment";

      setError({ error: message, errors: null });
      toast.error(message);
    } finally {
      setIsLoadingAssignment(false);
    }
}, [dispatch]);


  // -----------------------------
  // INPUT HANDLERS
  // -----------------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (name: keyof typeof formData, value: number) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBooleanChange = (name: keyof typeof formData, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -----------------------------
  // SUBMIT (UPDATE)
  // -----------------------------
  const handleSubmit = async () => {
    clearError();
    setIsSubmitting(true);

    try {
      // Basic validation
      if (
        !formData.id ||
        !formData.studentEnrollmentId ||
        !formData.batchId ||
        !formData.assignmentDate ||
        !formData.assignmentType
      ) {
        throw new Error("Please fill all required fields");
      }

      const payload: UpdateStudentBatchAssignmentDto = {
        id: formData.id,
        studentEnrollmentId: formData.studentEnrollmentId,
        batchId: formData.batchId,
        assignmentDate: new Date(formData.assignmentDate).toISOString(),
        assignmentType: formData.assignmentType,
        remark: formData.remark,
        isActive: formData.isActive,
      };

      const result = await dispatch(updateSBA(payload)).unwrap();

      if (result.success) {
        setError(null);
        return {
          success: true,
          message: result.message || "Assignment updated successfully",
        };
      }

      throw new Error(result.message || "Failed to update assignment");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.error ||
        err?.message ||
        "Something went wrong";

      setError({ error: message, errors: null });
      toast.error(message);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isLoadingAssignment,
    isSubmitting,
    error,

    clearError,
    loadAssignment,

    handleChange,
    handleSelectChange,
    handleNumberChange,
    handleBooleanChange,

    handleSubmit,
  };
}
