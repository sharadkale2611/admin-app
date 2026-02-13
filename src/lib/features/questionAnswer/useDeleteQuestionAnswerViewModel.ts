    import { useCallback } from "react";
import Swal from "sweetalert2";
import { useAppDispatch } from "@/lib/hooks";
import { deleteQuestionAnswer } from "./questionAnswerThunks";

export const useDeleteQuestionAnswerViewModel = () => {
  const dispatch = useAppDispatch();

  const handleDelete = useCallback(
    async (answerId: number, answerLabel: string) => {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `You are about to delete the answer "${answerLabel}". This action cannot be undone.`,
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
            deleteQuestionAnswer(answerId)
          );

          if (deleteQuestionAnswer.fulfilled.match(actionResult)) {
            await Swal.fire({
              title: "Deleted!",
              text: "Question answer has been deleted successfully.",
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            });
            return true;
          }
        } catch (error: any) {
          await Swal.fire({
            title: "Error!",
            text: error.message || "Failed to delete question answer",
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
