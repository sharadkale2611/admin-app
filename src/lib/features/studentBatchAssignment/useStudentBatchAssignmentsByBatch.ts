// lib/features/studentBatchAssignments/useStudentBatchAssignmentsByBatch.ts

import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";

import { fetchSBAByBatchId } from "./studentBatchAssignmentThunks";


// ------------------------------------------------------
//   ViewModel Hook - Student Batch Assignments by Batch
// ------------------------------------------------------
export const useStudentBatchAssignmentsByBatch = (batchId?: number) => {

    const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useAppDispatch();

    const {
        assignmentsByBatch,
        loading,
        error
    } = useAppSelector((state: RootState) => state.studentBatchAssignments);

    const safeAssignments = assignmentsByBatch || [];

    // Fetch logic
    const fetchData = useCallback(() => {
        if (!batchId) return;

        dispatch(fetchSBAByBatchId(batchId));
    }, [dispatch, batchId]);

    // Auto fetch when batchId changes
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        // State
        assignments: safeAssignments,
        isLoading: loading,
        error,

        // Actions
        refetch: fetchData
    };
};
