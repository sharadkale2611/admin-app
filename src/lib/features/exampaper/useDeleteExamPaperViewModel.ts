import { useCallback } from "react";
import Swal from "sweetalert2";
import { useAppDispatch } from "@/lib/hooks";
import { deleteExamPaper } from "./examPaperThunks";

export const useDeleteExamPaper = () => {
  const dispatch = useAppDispatch();

  const handleDelete = useCallback(
    async (examPaperId: number, examPaperName: string) => {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `You are about to delete the exam paper "${examPaperName}". This action cannot be undone.`,
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
            deleteExamPaper(examPaperId)
          );

          if (deleteExamPaper.fulfilled.match(actionResult)) {
            await Swal.fire({
              title: "Deleted!",
              text: "Exam paper deleted successfully.",
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
              error?.message ||
              "Failed to delete exam paper",
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
