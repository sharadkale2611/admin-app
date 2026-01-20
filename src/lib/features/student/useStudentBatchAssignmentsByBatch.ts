import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchStudentBatchCourseAssignments } from "../student/studentThunks";

export const useStudentBatchAssignmentsByBatch = (batchId?: number) => {
    const dispatch = useAppDispatch();

    const assignments = useAppSelector(
        state => state.students.batchAssignments ?? []
    );

    const loading = useAppSelector(
        state => state.students.loading
    );

    const error = useAppSelector(
        state => state.students.error
    );

    useEffect(() => {
        if (!batchId) return;

        dispatch(fetchStudentBatchCourseAssignments(batchId));
    }, [batchId, dispatch]);

    return {
        assignments,
        isLoading: loading,
        error,
        refetch: () => {
            if (batchId) {
                dispatch(fetchStudentBatchCourseAssignments(batchId));
            }
        }
    };
};
