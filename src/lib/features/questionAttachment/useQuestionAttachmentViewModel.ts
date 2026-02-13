import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect, useCallback } from "react";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";

import {
  fetchQuestionAttachments,
  fetchQuestionAttachmentById,
  createQuestionAttachment,
  updateQuestionAttachment,
  deleteQuestionAttachment,
} from "./questionAttachmentThunks";

import {
  CreateQuestionAttachmentDto,
  UpdateQuestionAttachmentDto,
} from "./questionAttachmentTypes";

export const useQuestionAttachmentViewModel = () => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> =
    useAppDispatch();

  const {
    attachments,
    currentAttachment,
    loading,
    error,
  } = useAppSelector((state: RootState) => state.questionAttachments);

  const safeAttachments = attachments || [];

  /* ===============================
     Fetch Attachments
  ================================ */

  const fetchAttachmentData = useCallback(() => {
    dispatch(fetchQuestionAttachments());
  }, [dispatch]);

  /* ===============================
     Initial Load
  ================================ */

  useEffect(() => {
    fetchAttachmentData();
  }, [fetchAttachmentData]);

  /* ===============================
     Action Handlers
  ================================ */

  const handleGetById = useCallback(
    (id: number) => {
      dispatch(fetchQuestionAttachmentById(id));
    },
    [dispatch]
  );

  const handleCreate = useCallback(
    (dto: CreateQuestionAttachmentDto) => {
      return dispatch(createQuestionAttachment(dto));
    },
    [dispatch]
  );

  const handleUpdate = useCallback(
    (id: number, dto: UpdateQuestionAttachmentDto) => {
      return dispatch(updateQuestionAttachment({ id, dto }));
    },
    [dispatch]
  );

  const handleDelete = useCallback(
    (id: number) => {
      return dispatch(deleteQuestionAttachment(id));
    },
    [dispatch]
  );

  /* ===============================
     Fetch By Question (Optional Helper)
  ================================ */

  const fetchByQuestion = useCallback(
    (questionId: number) => {
      return dispatch(fetchQuestionAttachments({ questionId }));
    },
    [dispatch]
  );

  return {
    /* ===== State ===== */
    attachments: safeAttachments,
    currentAttachment,
    isLoading: loading,
    error,

    /* ===== Actions ===== */
    getById: handleGetById,
    create: handleCreate,
    update: handleUpdate,
    remove: handleDelete,
    refetch: fetchAttachmentData,
    fetchByQuestion,
  };
};
