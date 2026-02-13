import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { fetchQuestionTypeRuleById } from "./questionTypeRuleThunks";

export const useQuestionTypeRuleDetailsViewModel = (
  ruleId: string
) => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> =
    useAppDispatch();

  const { currentRule, loading, error } =
    useAppSelector(
      (state: RootState) => state.questionTypeRules
    );

  useEffect(() => {
    if (ruleId && !currentRule) {
      dispatch(fetchQuestionTypeRuleById(Number(ruleId)));
    }
  }, [dispatch, ruleId, currentRule]);

  return {
    questionTypeRule: currentRule,
    isLoading: loading,
    error,
  };
};
