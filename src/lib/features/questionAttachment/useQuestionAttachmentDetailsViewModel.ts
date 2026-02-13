import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { fetchQuestionAttachmentById } from "./questionAttachmentThunks";

export const useQuestionAttachmentDetailsViewModel = (
  attachmentId: string
) => {
  const dispatch: ThunkDispatch<
    RootState,
    unknown,
    AnyAction
  > = useAppDispatch();

  const { currentAttachment, loading, error } =
    useAppSelector(
      (state: RootState) =>
        state.questionAttachments
    );

  useEffect(() => {
    if (
      attachmentId &&
      (!currentAttachment ||
        currentAttachment.questionAttachmentId !==
          Number(attachmentId))
    ) {
      dispatch(
        fetchQuestionAttachmentById(
          Number(attachmentId)
        )
      );
    }
  }, [dispatch, attachmentId, currentAttachment]);

  return {
    attachment: currentAttachment,
    isLoading: loading,
    error,
  };
};
