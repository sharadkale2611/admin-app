"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";

import {
    fetchSBAById,
    updateSBA
} from "./studentBatchAssignmentThunks";

import { ApiError } from "./studentBatchAssignmentTypes";
import { toast } from "react-toastify";


// -----------------------------------------------------------
// FORM DATA INTERFACE
// -----------------------------------------------------------
export interface StudentBatchAssignmentFormData {
    studentEnrollmentId: number;
    batchId: number;
    assignmentDate: string;
    assignmentType: string;
    remark?: string | null;
    isActive: boolean;
}


// -----------------------------------------------------------
// VIEWMODEL HOOK
// -----------------------------------------------------------
export default function useEditStudentBatchAssignmentViewModel() {
    const router = useRouter();
    const { id } = useParams();
    const dispatch: AppDispatch = useDispatch();

    const { currentAssignment, loading, error: fetchError } = useSelector(
        (state: RootState) => state.studentBatchAssignments
    );

    const [formData, setFormData] = useState<StudentBatchAssignmentFormData>({
        studentEnrollmentId: 0,
        batchId: 0,
        assignmentDate: "",
        assignmentType: "",
        remark: "",
        isActive: true,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);


    // ----------------------------------------------------
    // Fetch SBA by ID on mount
    // ----------------------------------------------------
    useEffect(() => {
        if (id) {
            dispatch(fetchSBAById(Number(id)));
        }
    }, [dispatch, id]);


    // ----------------------------------------------------
    // Populate form when currentAssignment is fetched
    // ----------------------------------------------------
    useEffect(() => {
        if (currentAssignment) {
            setFormData({
                studentEnrollmentId: currentAssignment.studentEnrollmentId,
                batchId: currentAssignment.batchId,
                assignmentDate: currentAssignment.assignmentDate.split("T")[0],
                assignmentType: currentAssignment.assignmentType,
                remark: currentAssignment.remark ?? "",
                isActive: currentAssignment.isActive
            });
        }
    }, [currentAssignment]);


    // ----------------------------------------------------
    // Input Handlers
    // ----------------------------------------------------
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleNumberChange = (name: keyof StudentBatchAssignmentFormData, value: number) => {
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

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: checked,
        }));
    };


    // ----------------------------------------------------
    // Submit Handler
    // ----------------------------------------------------
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            if (!id) {
                throw new Error("Assignment ID is required");
            }

            // Basic validation
            if (
                formData.studentEnrollmentId <= 0 ||
                formData.batchId <= 0 ||
                !formData.assignmentDate ||
                !formData.assignmentType
            ) {
                throw new Error("Please fill in all required fields");
            }

            // Update SBA
            const result = await dispatch(
                updateSBA({
                    id: Number(id),
                    studentEnrollmentId: formData.studentEnrollmentId,
                    batchId: formData.batchId,
                    assignmentDate: formData.assignmentDate,
                    assignmentType: formData.assignmentType,
                    remark: formData.remark,
                    isActive: formData.isActive,
                })
            ).unwrap();


            // ---------------------------
            // SUCCESS
            // ---------------------------
            toast.success(result.message || "Batch assignment updated successfully");
            router.push("/student-batch-assignments");

            if (!result.success) {
                throw new Error(result.message || "Failed to update assignment");
            }

        } catch (err: any) {
            console.log("UPDATE SBA ERROR:", err);

            let errorMessage = "An unknown error occurred";
            let errorDetails = null;

            // Axios structured error
            if (typeof err === "object" && err !== null) {
                if ("response" in err && err.response?.data) {
                    errorMessage =
                        err.response.data.error ||
                        err.response.data.message ||
                        errorMessage;

                    errorDetails = err.response.data.errors || null;
                }
                else if ("error" in err) {
                    errorMessage = err.error || errorMessage;
                    errorDetails = err.errors || null;
                }
            } 
            else if (typeof err === "string") {
                errorMessage = err;
            }
            else if (err instanceof Error) {
                errorMessage = err.message;
            }

            toast.error(errorMessage);
            setError({ error: errorMessage, errors: errorDetails });

        } finally {
            setIsSubmitting(false);
        }
    };


    // ----------------------------------------------------
    // Return
    // ----------------------------------------------------
    return {
        formData,
        isSubmitting,
        error: error || fetchError,
        errors: error || fetchError,
        loading,

        handleChange,
        handleSelectChange,
        handleCheckboxChange,
        handleNumberChange,
        handleSubmit,
    };
}
