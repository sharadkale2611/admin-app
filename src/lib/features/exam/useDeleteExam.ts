import { useCallback } from "react";
import Swal from "sweetalert2";
import { useAppDispatch } from "@/lib/hooks";
import { deleteExam } from "@/lib/features/exam/examThunks";

export const useDeleteExam = () => {

  const dispatch = useAppDispatch();

  const handleDeleteExam = useCallback(
    async (examId: number, examName: string) => {

      const result = await Swal.fire({
        title: "Are you sure?",
        text: `Delete exam "${examName}"? This action cannot be undone.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        reverseButtons: true
      });

      if (!result.isConfirmed) return false;

      try {
        const actionResult = await dispatch(deleteExam(examId));

        if (deleteExam.fulfilled.match(actionResult)) {

          await Swal.fire({
            title: "Deleted!",
            text: "Exam deleted successfully.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false
          });

          return true;
        }

        throw new Error(actionResult.payload || "Failed to delete exam");

      } catch (error: any) {

        await Swal.fire({
          title: "Error!",
          text: error?.message || "Failed to delete exam",
          icon: "error",
          confirmButtonText: "OK"
        });

        return false;
      }
    },
    [dispatch]
  );

  return { handleDeleteExam };
};
