'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import type { RootState, AppDispatch } from '@/lib/store';
import { fetchExamMarkById, updateExamMark } from './examMarksThunks';

export interface ExamMarkEditFormData {
  examId: string;
  studentId: string;
  markObtained: string;
  status: boolean;
}

export default function useEditExamMarkViewModel() {
  const router = useRouter();
  const { id } = useParams();
  const dispatch: AppDispatch = useDispatch();

  const { currentExamMark, loading, error: fetchError } = useSelector(
    (state: RootState) => state.examMarks
  );

  const [formData, setFormData] = useState<ExamMarkEditFormData>({
    examId: '',
    studentId: '',
    markObtained: '',
    status: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchExamMarkById(Number(id)));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentExamMark) {
      setFormData({
        examId: currentExamMark.examId.toString(),
        studentId: currentExamMark.studentId.toString(),
        markObtained: currentExamMark.markObtained.toString(),
        status: currentExamMark.status,
      });
    }
  }, [currentExamMark]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setFormData((prev) => ({ ...prev, status: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!id) throw new Error('Exam mark ID is required');
      if (!formData.examId) throw new Error('Exam is required');
      if (!formData.studentId) throw new Error('Student is required');
      if (!formData.markObtained) throw new Error('Marks are required');

      const result = await dispatch(
        updateExamMark({
          id: Number(id),
          examId: Number(formData.examId),
          studentId: Number(formData.studentId),
          markObtained: Number(formData.markObtained),
          status: formData.status,
        })
      ).unwrap();

      if (result.success) {
        const successMessage =
          result.message || 'Exam mark updated successfully';

        toast.success(successMessage);

        await Swal.fire({
          icon: 'success',
          title: successMessage,
          timer: 1500,
          showConfirmButton: false,
        });

        router.push('/exam-marks');
      } else {
        throw new Error(result.error || 'Failed to update exam mark');
      }
    } catch (err: any) {
      let message = '';
      if (typeof err === 'string') message = err;
      else if (err instanceof Error) message = err.message;
      else if (err?.message) message = err.message;
      else if (err?.error) message = err.error;
      else message = 'An unknown error occurred';

      setError(message);

      await Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: message,
        confirmButtonColor: '#d33',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    error: error || fetchError,
    loading,
    handleChange,
    handleStatusChange,
    handleSubmit,
  };
}
