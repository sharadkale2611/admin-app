import { useCallback } from 'react';
import Swal from 'sweetalert2';
import { useAppDispatch } from '@/lib/hooks';
import { deleteExamMark } from './examMarksThunks';

export const useDeleteExamMark = () => {
  const dispatch = useAppDispatch();

  const handleDelete = useCallback(
    async (id: number, label: string) => {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: `You are about to delete marks for ${label}. This action cannot be undone.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
        reverseButtons: true,
        customClass: {
          popup: 'sweetalert-popup',
        },
      });

      if (result.isConfirmed) {
        try {
          const actionResult = await dispatch(deleteExamMark(id));

          if (deleteExamMark.fulfilled.match(actionResult)) {
            await Swal.fire({
              title: 'Deleted!',
              text: 'Exam mark has been deleted successfully.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false,
            });
            return true;
          } else {
            throw new Error(
              (actionResult as any).payload || 'Failed to delete exam mark'
            );
          }
        } catch (error: any) {
          await Swal.fire({
            title: 'Error!',
            text: error.message || 'Failed to delete exam mark',
            icon: 'error',
            confirmButtonText: 'OK',
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
