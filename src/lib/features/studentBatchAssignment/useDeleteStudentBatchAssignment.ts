import { useCallback } from "react";
import Swal from "sweetalert2";
import { useAppDispatch } from "@/lib/hooks";

import { deleteSBA } from "./studentBatchAssignmentThunks";

export const useDeleteStudentBatchAssignment = () => {
    const dispatch = useAppDispatch();

    const handleDelete = useCallback(
        async (assignmentId: number, studentName: string) => {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: `You are about to delete assignment for ${studentName}. This action cannot be undone.`,
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
                    const actionResult = await dispatch(deleteSBA(assignmentId));

                    // Match fulfilled action (same pattern as your student hook)
                    if (deleteSBA.fulfilled.match(actionResult)) {
                        await Swal.fire({
                            title: "Deleted!",
                            text: "Assignment has been deleted successfully.",
                            icon: "success",
                            timer: 2000,
                            showConfirmButton: false,
                        });
                        return true;
                    }
                } catch (error: any) {
                    await Swal.fire({
                        title: "Error!",
                        text: error.message || "Failed to delete assignment",
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
