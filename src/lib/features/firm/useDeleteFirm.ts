import { useCallback } from "react";
import Swal from "sweetalert2";
import { useAppDispatch } from "@/lib/hooks";
import { deleteFirm } from "./firmThunks";

export const useDeleteFirm = () => {
    const dispatch = useAppDispatch();

    const handleDelete = useCallback(
        async (firmId: number, firmName: string) => {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: `You are about to delete ${firmName}. This action cannot be undone.`,
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
                    const actionResult = await dispatch(deleteFirm(firmId.toString()));

                    if (deleteFirm.fulfilled.match(actionResult)) {
                        await Swal.fire({
                            title: "Deleted!",
                            text: "Firm has been deleted successfully.",
                            icon: "success",
                            timer: 2000,
                            showConfirmButton: false,
                        });
                        return true;
                    } else {
                        throw new Error(
                            (actionResult as any)?.payload?.error || "Failed to delete firm"
                        );
                    }
                } catch (error: any) {
                    await Swal.fire({
                        title: "Error!",
                        text: error.message || "Failed to delete firm",
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
