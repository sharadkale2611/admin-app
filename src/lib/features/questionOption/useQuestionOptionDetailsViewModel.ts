import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { fetchQuestionOptionById } from "./questionOptionThunks";

export const useQuestionOptionDetailsViewModel = (
  optionId: string
) => {
  const dispatch: ThunkDispatch<
    RootState,
    unknown,
    AnyAction
  > = useAppDispatch();

  const { currentOption, loading, error } =
    useAppSelector(
      (state: RootState) => state.questionOptions
    );

  useEffect(() => {
    if (
      optionId &&
      (!currentOption ||
        currentOption.optionId !==
          Number(optionId))
    ) {
      dispatch(
        fetchQuestionOptionById(
          Number(optionId)
        )
      );
    }
  }, [dispatch, optionId, currentOption]);

  return {
    option: currentOption,
    isLoading: loading,
    error,
  };
};
