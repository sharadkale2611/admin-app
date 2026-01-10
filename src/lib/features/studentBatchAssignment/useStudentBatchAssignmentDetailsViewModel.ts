import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect } from "react";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";

import { fetchSBAById } from "./studentBatchAssignmentThunks";


// -----------------------------------------------------------
// VIEWMODEL HOOK — Student Batch Assignment Details
// -----------------------------------------------------------

export const useStudentBatchAssignmentDetailsViewModel = (assignmentId: number) => {
    const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useAppDispatch();

    const { currentAssignment, loading, error } = useAppSelector(
        (state: RootState) => state.studentBatchAssignments
    );

    useEffect(() => {
        if (assignmentId) {
            dispatch(fetchSBAById(assignmentId));
        }
    }, [dispatch, assignmentId]);

    return {
        assignment: currentAssignment,
        isLoading: loading,
        error,
    };
};
