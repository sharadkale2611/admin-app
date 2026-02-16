import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";

import {
  fetchExamPapers,
  fetchExamPaperById,
  createExamPaper,
  updateExamPaper,
  deleteExamPaper,
} from "./examPaperThunks";

import {
  CreateExamPaperDto,
  UpdateExamPaperDto,
} from "./examPaperTypes";

export const useExamPaperViewModel = () => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> =
    useAppDispatch();

  const { examPapers, currentExamPaper, loading, error } =
    useAppSelector((state: RootState) => state.examPapers);

  const safeExamPapers = examPapers || [];

  const fetchData = useCallback(() => {
    dispatch(fetchExamPapers());
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleGetById = useCallback(
    (id: number) => dispatch(fetchExamPaperById(id)),
    [dispatch]
  );

  const handleCreate = useCallback(
    (dto: CreateExamPaperDto) => dispatch(createExamPaper(dto)),
    [dispatch]
  );

  const handleUpdate = useCallback(
    (id: number, dto: UpdateExamPaperDto) =>
      dispatch(updateExamPaper({ id, dto })),
    [dispatch]
  );

  const handleDelete = useCallback(
    (id: number) => dispatch(deleteExamPaper(id)),
    [dispatch]
  );

  return {
    examPapers: safeExamPapers,
    currentExamPaper,
    isLoading: loading,
    error,

    getById: handleGetById,
    create: handleCreate,
    update: handleUpdate,
    remove: handleDelete,
    refetch: fetchData,
  };
};
