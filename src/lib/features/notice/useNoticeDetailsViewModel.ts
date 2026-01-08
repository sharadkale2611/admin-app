import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { fetchNoticeById } from "./noticeThunks";

export const useNoticeDetailsViewModel = (noticeId: string) => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> =
    useAppDispatch();

  const { currentNotice, loading, error } = useAppSelector(
    (state: RootState) => state.notices
  );

  useEffect(() => {
  if (noticeId && !currentNotice) {
    dispatch(fetchNoticeById(Number(noticeId)));
  }
}, [dispatch, noticeId, currentNotice]);


  return {
    notice: currentNotice,
    isLoading: loading,
    error,
  };
};
