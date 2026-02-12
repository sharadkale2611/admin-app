import { useCallback } from "react";
import Swal from "sweetalert2";
import { useAppDispatch } from "@/lib/hooks";
import { deleteQuestionTypeRule } from "./questionTypeRuleThunks";

export const useDeleteQuestionTypeRule = () => {
  const dispatch = useAppDispatch();

  const handleDelete = useCallback(
    async (ruleId: number, ruleName: string) => {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `You are about to delete the rule "${ruleName}". This action cannot be undone.`,
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
            deleteQuestionTypeRule(ruleId)
          );

          if (deleteQuestionTypeRule.fulfilled.match(actionResult)) {
            await Swal.fire({
              title: "Deleted!",
              text: "Rule has been deleted successfully.",
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            });
            return true;
          }
        } catch (error: any) {
          await Swal.fire({
            title: "Error!",
            text: error.message || "Failed to delete rule",
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
