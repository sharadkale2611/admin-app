'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { createExamMark } from './examMarksThunks';
import type { CreateExamMarkDto } from './examMarksTypes';

export interface ExamMarkFormData {
  examId: string;
  studentId: string;
  markObtained: string;
  status: boolean;
}

export default function useCreateExamMarkViewModel() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState<ExamMarkFormData>({
    examId: '',
    studentId: '',
    markObtained: '',
    status: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      if (!formData.examId || !formData.studentId || !formData.markObtained) {
        throw new Error('Please fill in all required fields');
      }

      const payload: CreateExamMarkDto = {
        examId: Number(formData.examId),
        studentId: Number(formData.studentId),
        markObtained: Number(formData.markObtained),
        status: formData.status,
      };

      const result = await (dispatch as any)(createExamMark(payload)).unwrap();

      if (result.success) {
        toast.success(result.message || 'Exam mark created successfully');
        router.push('/exam-marks');
        return;
      }

      throw new Error(result.message || 'Failed to create exam mark');
    } catch (err: any) {
      let message = '';
      if (typeof err === 'string') message = err;
      else if (err instanceof Error) message = err.message;
      else if (err?.message) message = err.message;
      else if (err?.error) message = err.error;
      else message = 'Server error';

      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    error,
    handleChange,
    handleStatusChange,
    handleSubmit,
  };
}
