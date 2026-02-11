// src/lib/features/notice/useNoticesViewModel.ts

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect, useCallback } from "react";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";

import {
  fetchNotices,
  fetchNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
} from "./noticeThunks";

import {
  CreateNoticeDto,
  UpdateNoticeDto,
} from "./noticeTypes";

export const useNoticeViewModel = () => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> =
    useAppDispatch();

  const {
    notices,
    currentNotice,
    loading,
    error,
  } = useAppSelector((state: RootState) => state.notices);

  const safeNotices = notices || [];

  /* ===============================
     Fetch Notices
  ================================ */

  const fetchNoticeData = useCallback(() => {
    dispatch(fetchNotices());
  }, [dispatch]);

  /* ===============================
     Initial Load
  ================================ */

  useEffect(() => {
    fetchNoticeData();
  }, [fetchNoticeData]);

  /* ===============================
     Action Handlers
  ================================ */

  const handleGetById = useCallback(
    (id: number) => {
      dispatch(fetchNoticeById(id));
    },
    [dispatch]
  );

  const handleCreate = useCallback(
    (dto: CreateNoticeDto) => {
      return dispatch(createNotice(dto));
    },
    [dispatch]
  );

  const handleUpdate = useCallback(
    (dto: UpdateNoticeDto) => {
      return dispatch(updateNotice(dto));
    },
    [dispatch]
  );

  const handleDelete = useCallback(
    (id: number) => {
      return dispatch(deleteNotice(id));
    },
    [dispatch]
  );

  return {
    /* ===== State ===== */
    notices: safeNotices,
    currentNotice,
    isLoading: loading,
    error,

    /* ===== Actions ===== */
    getById: handleGetById,
    create: handleCreate,
    update: handleUpdate,
    remove: handleDelete,
    refetch: fetchNoticeData,
  };
};
