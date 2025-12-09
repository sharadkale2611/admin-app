"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect } from "react";
import { fetchStudentById } from "./studentThunks";
import type { StudentDetails } from "./studentDetailsTypes";

export const useStudentDetailsViewModel = (studentId: string) => {
  const dispatch = useAppDispatch();

  const { currentStudent, loading, error } = useAppSelector(
    (state) => state.students
  );

  useEffect(() => {
    if (studentId) {
      dispatch(fetchStudentById(studentId));
    }
  }, [studentId, dispatch]);

  return {
    student: currentStudent as StudentDetails | null,
    isLoading: loading,
    error
  };
};
