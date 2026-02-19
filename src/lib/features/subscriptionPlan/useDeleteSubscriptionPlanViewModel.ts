import { useCallback } from "react";
import Swal from "sweetalert2";
import { useAppDispatch } from "@/lib/hooks";
import { deleteSubscriptionPlan } from "./subscriptionPlanThunks";

export const useDeleteSubscriptionPlanViewModel = () => {
  const dispatch = useAppDispatch();

  const handleDelete = useCallback(
    async (id: number, name?: string) => {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: name
          ? `Delete "${name}" ?`
          : "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        confirmButtonText: "Yes, Delete",
      });

      if (!result.isConfirmed) return false;

      try {
        // ✅ unwrap वापर — error throw होईल
        await dispatch(deleteSubscriptionPlan(id)).unwrap();

        await Swal.fire({
          title: "Deleted!",
          text: "Subscription Plan deleted successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        return true;
      } catch (error: any) {
        await Swal.fire({
          title: "Error",
          text: error?.error || "Failed to delete plan",
          icon: "error",
        });

        return false;
      }
    },
    [dispatch]
  );

  return { handleDelete };
};
