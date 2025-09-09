import { useState } from 'react';
import { useAppDispatch } from '@/lib/hooks';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import type { RootState } from '@/lib/store';
import { deleteCourse } from './courseThunks';
import Swal from 'sweetalert2';

export const useDeleteCourse = () => {
    const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useAppDispatch();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async (courseId: number, courseName: string): Promise<boolean> => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete the course "${courseName}". This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
            customClass: {
                confirmButton: 'swal2-confirm-delete',
                cancelButton: 'swal2-cancel-delete'
            }
        });

        if (!result.isConfirmed) {
            return false;
        }

        setIsDeleting(true);
        try {
            const deleteResult = await dispatch(deleteCourse(courseId)).unwrap();

            if (deleteResult.success) {
                await Swal.fire({
                    title: 'Deleted!',
                    text: `Course "${courseName}" has been deleted successfully.`,
                    icon: 'success',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
                return true;
            } else {
                throw new Error(deleteResult.message || 'Failed to delete course');
            }
        } catch (error: any) {
            console.error('Error deleting course:', error);

            await Swal.fire({
                title: 'Error!',
                text: error.message || 'Failed to delete course. Please try again.',
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            });

            return false;
        } finally {
            setIsDeleting(false);
        }
    };

    return {
        handleDelete,
        isDeleting
    };
};