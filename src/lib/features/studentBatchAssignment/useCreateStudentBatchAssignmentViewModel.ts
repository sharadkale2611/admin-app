"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";

import { createSBABulk } from "./studentBatchAssignmentThunks";
import { ApiError } from "./studentBatchAssignmentTypes";
import { toast } from "react-toastify";

export default function useCreateStudentBatchAssignmentViewModel() {
    const dispatch = useDispatch<AppDispatch>();

    const [formData, setFormData] = useState({
        studentEnrollmentIds: [] as number[],
        batchId: 0,
        assignmentDate: "",
        assignmentType: "",
        remark: "",
        isActive: true,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);

    // ------------------------------------------
    // CLEAR ERROR BEFORE SUBMIT
    // ------------------------------------------
    const clearError = () => setError(null);

    // ------------------------------------------
    // TOGGLE CHECKBOX
    // ------------------------------------------
    const toggleEnrollmentSelection = (id: number) => {
        setFormData((prev) => ({
            ...prev,
            studentEnrollmentIds: prev.studentEnrollmentIds.includes(id)
                ? prev.studentEnrollmentIds.filter((x) => x !== id)
                : [...prev.studentEnrollmentIds, id],
        }));
    };

    // ------------------------------------------
    // NORMAL INPUT HANDLERS
    // ------------------------------------------
    const handleChange = (e: any) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSelectChange = (e: any) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleNumberChange = (name: string, value: number) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


          // SELECT ALL
      const selectAllEnrollments = (allIds: number[]) => {
          setFormData((prev) => ({
              ...prev,
              studentEnrollmentIds: allIds,
          }));
      };

      // DESELECT ALL
      const deselectAllEnrollments = () => {
          setFormData((prev) => ({
              ...prev,
              studentEnrollmentIds: [],
          }));
      };

    // ------------------------------------------
    // SUBMIT HANDLER (NO event passed here!)
    // ------------------------------------------
   const handleSubmit = async () => {
    clearError();
    setIsSubmitting(true);

    try {
        if (
            formData.studentEnrollmentIds.length === 0 ||
            !formData.batchId ||
            !formData.assignmentDate ||
            !formData.assignmentType
        ) {
            throw new Error("Please fill all required fields");
        }

        const payload = {
            ...formData,
            assignmentDate: new Date(formData.assignmentDate).toISOString(),
        };

        const result = await dispatch(createSBABulk(payload)).unwrap();

        setError(null);
        return { success: true, message: result.message };
        
    } catch (err: any) {
        const message =
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
        isSubmitting,
        error,
        clearError,
        handleChange,
        handleSelectChange,
        handleNumberChange,
        toggleEnrollmentSelection,
        selectAllEnrollments,
        deselectAllEnrollments,
        handleSubmit,
    };
}
