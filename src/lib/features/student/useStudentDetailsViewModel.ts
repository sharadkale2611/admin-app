import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect } from "react";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { fetchStudentById } from "./studentThunks";

export const useStudentDetailsViewModel = (studentId: string) => {
    const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useAppDispatch();

    const { currentStudent, loading, error } = useAppSelector((state: RootState) => state.students);

    useEffect(() => {
        if (studentId) {
            dispatch(fetchStudentById(studentId));
        }
    }, [dispatch, studentId]);

    return {
        student: currentStudent,
        isLoading: loading,
        error
    };
};