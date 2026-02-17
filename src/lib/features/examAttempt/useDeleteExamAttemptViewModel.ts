import { useCallback } from "react";
import Swal from "sweetalert2";
import { useAppDispatch } from "@/lib/hooks";
import { deleteExamAttempt } from "./examAttemptThunks";

export const useDeleteExamAttemptViewModel = () => {
  const dispatch = useAppDispatch();

  const handleDelete = useCallback(
    async (attemptId: number, attemptLabel: string) => {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `You are about to delete the exam attempt "${attemptLabel}". This action cannot be undone.`,
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
            deleteExamAttempt(attemptId)
          );

          if (deleteExamAttempt.fulfilled.match(actionResult)) {
            await Swal.fire({
              title: "Deleted!",
              text: "Exam attempt has been deleted successfully.",
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            });

            return true;
          }
        } catch (error: any) {
          await Swal.fire({
            title: "Error!",
            text: error.message || "Failed to delete exam attempt",
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
