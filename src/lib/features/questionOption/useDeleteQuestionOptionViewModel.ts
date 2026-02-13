import { useCallback } from "react";
import Swal from "sweetalert2";
import { useAppDispatch } from "@/lib/hooks";
import { deleteQuestionOption } from "./questionOptionThunks";

export const useDeleteQuestionOptionViewModel = () => {
  const dispatch = useAppDispatch();

  const handleDelete = useCallback(
    async (optionId: number, optionText: string) => {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `You are about to delete the option "${optionText}". This action cannot be undone.`,
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
          const actionResult = await dispatch(deleteQuestionOption(optionId));

          if (deleteQuestionOption.fulfilled.match(actionResult)) {
            await Swal.fire({
              title: "Deleted!",
              text: "Option has been deleted successfully.",
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            });
            return true;
          }
        } catch (error: any) {
          await Swal.fire({
            title: "Error!",
            text: error.message || "Failed to delete option",
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
