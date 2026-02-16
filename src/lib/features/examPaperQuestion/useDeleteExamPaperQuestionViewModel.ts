"use client";

import { useCallback } from "react";
import Swal from "sweetalert2";
import { useAppDispatch } from "@/lib/hooks";
import { deleteExamPaperQuestion } from "./examPaperQuestionThunks";

export const useDeleteExamPaperQuestion = () => {
  const dispatch = useAppDispatch();

  const handleDelete = useCallback(
    async (id: number, title: string) => {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `Delete "${title}" ?`,
        icon: "warning",
        showCancelButton: true,
      });

      if (result.isConfirmed) {
        const actionResult = await dispatch(deleteExamPaperQuestion(id));

        if (deleteExamPaperQuestion.fulfilled.match(actionResult)) {
          await Swal.fire("Deleted!", "", "success");
          return true;
        }
      }

      return false;
    },
    [dispatch]
  );

  return { handleDelete };
};
