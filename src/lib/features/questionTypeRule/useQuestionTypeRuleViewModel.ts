import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect, useCallback } from "react";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";

import {
  fetchQuestionTypeRules,
  fetchQuestionTypeRuleById,
  createQuestionTypeRule,
  updateQuestionTypeRule,
  deleteQuestionTypeRule,
  fetchQuestionTypeRulesPaginated,
} from "./questionTypeRuleThunks";

import {
  CreateQuestionTypeRuleDto,
  UpdateQuestionTypeRuleDto,
} from "./questionTypeRuleTypes";

export const useQuestionTypeRuleViewModel = () => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> =
    useAppDispatch();

  const {
    rules,
    currentRule,
    loading,
    error,
  } = useAppSelector((state: RootState) => state.questionTypeRules);

  const safeRules = rules || [];

  /* ===============================
     Fetch Rules
  ================================ */

  const fetchRuleData = useCallback(() => {
    dispatch(fetchQuestionTypeRules());
  }, [dispatch]);

  /* ===============================
     Initial Load
  ================================ */

  useEffect(() => {
    fetchRuleData();
  }, [fetchRuleData]);

  /* ===============================
     Action Handlers
  ================================ */

  const handleGetById = useCallback(
    (id: number) => {
      dispatch(fetchQuestionTypeRuleById(id));
    },
    [dispatch]
  );

  const handleCreate = useCallback(
    (dto: CreateQuestionTypeRuleDto) => {
      return dispatch(createQuestionTypeRule(dto));
    },
    [dispatch]
  );

  const handleUpdate = useCallback(
    (dto: UpdateQuestionTypeRuleDto) => {
      return dispatch(updateQuestionTypeRule(dto));
    },
    [dispatch]
  );

  const handleDelete = useCallback(
    (id: number) => {
      return dispatch(deleteQuestionTypeRule(id));
    },
    [dispatch]
  );

  /* ===============================
     Paginated Fetch (Optional)
  ================================ */

  const fetchPaginated = useCallback(
    (params: {
      pageNumber?: number;
      pageSize?: number;
      search?: string;
    }) => {
      return dispatch(fetchQuestionTypeRulesPaginated(params));
    },
    [dispatch]
  );

  return {
    /* ===== State ===== */
    questionTypeRules: safeRules,
    currentQuestionTypeRule: currentRule,
    isLoading: loading,
    error,

    /* ===== Actions ===== */
    getById: handleGetById,
    create: handleCreate,
    update: handleUpdate,
    remove: handleDelete,
    refetch: fetchRuleData,
    fetchPaginated,
  };
};
