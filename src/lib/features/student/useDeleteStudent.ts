import { useCallback } from 'react';
import Swal from 'sweetalert2';
import { useAppDispatch } from '@/lib/hooks';
import { deleteStudent } from './studentThunks';

export const useDeleteStudent = () => {
    const dispatch = useAppDispatch();

    const handleDelete = useCallback(
        async (studentId: number, studentName: string) => {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: `You are about to delete ${studentName}. This action cannot be undone.`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'Cancel',
                reverseButtons: true,
            });

            if (!result.isConfirmed) return false;

            try {
                const actionResult = await dispatch(deleteStudent(studentId));

                if (deleteStudent.fulfilled.match(actionResult)) {
                    await Swal.fire({
                        title: 'Deleted!',
                        text: 'Student has been deleted successfully.',
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false,
                    });
                    return true;
                }

                throw new Error(
                    typeof actionResult.payload === 'string'
                        ? actionResult.payload
                        : 'Failed to delete student'
                );
            } catch (error: any) {
                await Swal.fire({
                    title: 'Error!',
                    text: error?.message || 'Failed to delete student',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
                return false;
            }
        },
        [dispatch]
    );

    return { handleDelete };
};
