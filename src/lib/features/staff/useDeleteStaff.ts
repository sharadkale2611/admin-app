// lib/hooks/useDeleteStaff.ts
import { useCallback } from 'react';
import { deleteStaff } from '@/lib/features/staff/staffThunks';
import Swal from 'sweetalert2';
import { useAppDispatch } from '@/lib/hooks';

export const useDeleteStaff = () => {
    const dispatch = useAppDispatch();

    const handleDelete = useCallback(async (staffId: string, staffName: string) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete ${staffName}. This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
            customClass: {
                popup: 'sweetalert-popup'
            }
        });

        if (result.isConfirmed) {
            try {
                const actionResult = await dispatch(deleteStaff(staffId));

                if (deleteStaff.fulfilled.match(actionResult)) {
                    await Swal.fire({
                        title: 'Deleted!',
                        text: 'Staff member has been deleted successfully.',
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false
                    });
                    return true;
                } else {
                    throw new Error(actionResult.payload || 'Failed to delete staff');
                }
            } catch (error: any) {
                await Swal.fire({
                    title: 'Error!',
                    text: error.message || 'Failed to delete staff member',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                return false;
            }
        }
        return false;
    }, [dispatch]);

    return { handleDelete };
};