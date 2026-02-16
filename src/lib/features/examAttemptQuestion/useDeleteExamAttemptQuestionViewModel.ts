import { useCallback } from "react";
import Swal from "sweetalert2";
import { useAppDispatch } from "@/lib/hooks";
import { deleteExamAttemptQuestion } from "./examAttemptQuestionThunks";

export const useDeleteExamAttemptQuestionViewModel = () => {
  const dispatch = useAppDispatch();

  const handleDelete = useCallback(
    async (
      attemptQuestionId: number,
      questionLabel: string
    ) => {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `You are about to delete the attempt question "${questionLabel}". This action cannot be undone.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        reverseButtons: true,
        customClass: {
          popup: "sweetalert-popup",
        },
      });

      if (result.isConfirmed) {
        try {
          const actionResult = await dispatch(
            deleteExamAttemptQuestion(attemptQuestionId)
          );

          if (
            deleteExamAttemptQuestion.fulfilled.match(
              actionResult
            )
          ) {
            await Swal.fire({
              title: "Deleted!",
              text: "Attempt question has been deleted successfully.",
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            });

            return true;
          }
        } catch (error: any) {
          await Swal.fire({
            title: "Error!",
            text:
              error.message ||
              "Failed to delete attempt question",
            icon: "error",
            confirmButtonText: "OK",
          });

          return false;
        }
      }

      return false;
    },
    [dispatch]
  );

  return { handleDelete };
};
