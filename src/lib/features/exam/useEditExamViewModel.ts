'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import { RootState, AppDispatch } from "@/lib/store";
import { fetchExamById, updateExam } from "./examThunks";

export interface ExamFormData {
  examName: string;
  examDescription: string;
  examDurationHrs: string;
  examTotalMarks: string;
  examPassingMarks: string;
  moduleId: string;
  courseId: string;
  isActive: boolean;
}

export default function useEditExamViewModel() {

  const router = useRouter();
  const { id } = useParams();
  const dispatch: AppDispatch = useDispatch();

  const { currentExam, loading, error: fetchError } = useSelector(
    (state: RootState) => state.exam
  );

  const [formData, setFormData] = useState<ExamFormData>({
    examName: "",
    examDescription: "",
    examDurationHrs: "",
    examTotalMarks: "",
    examPassingMarks: "",
    moduleId: "",
    courseId: "",
    isActive: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Load exam by id
 useEffect(() => {

  if (!id) return;

  const examId =
    Array.isArray(id) ? Number(id[0]) : Number(id);

  if (!isNaN(examId)) {
    dispatch(fetchExamById(examId));
  }

}, [dispatch, id]);

  // 🔹 Populate form when exam loads
  useEffect(() => {
    if (currentExam) {
      setFormData({
        examName: currentExam.examName || "",
        examDescription: currentExam.examDescription || "",
        examDurationHrs: String(currentExam.examDurationHrs ?? ""),
        examTotalMarks: String(currentExam.examTotalMarks ?? ""),
        examPassingMarks: String(currentExam.examPassingMarks ?? ""),
        moduleId: String(currentExam.moduleId ?? ""),
        courseId: String(currentExam.courseId ?? ""),
        isActive: currentExam.isActive ?? true
      });
    }
  }, [currentExam]);


  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;

    setFormData(prev => ({
      ...prev,
      isActive: checked
    }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  setError(null);

  try {
    if (!id) throw new Error("Exam ID is missing");

    const examId =
      Array.isArray(id) ? Number(id[0]) : Number(id);

    if (isNaN(examId)) {
      throw new Error("Invalid Exam ID");
    }

    if (!formData.examName || !formData.moduleId) {
      throw new Error("Please fill required fields");
    }

    const payload = {
      id: examId,
      examName: formData.examName,
      examDescription: formData.examDescription,
      examDurationHrs: Number(formData.examDurationHrs),
      examTotalMarks: Number(formData.examTotalMarks),
      examPassingMarks: Number(formData.examPassingMarks),
      moduleId: Number(formData.moduleId),
      courseId: formData.courseId ? Number(formData.courseId) : null,
      isActive: formData.isActive
    };

    await dispatch<any>(updateExam(payload)).unwrap();

   toast.success("Exam updated successfully");

// ⏳ give toast time to render before redirect
await new Promise(res => setTimeout(res, 400));

router.push("/exams");

  } catch (err: any) {

    const errorMessage =
      err?.message ||
      err?.error ||
      "Failed to update exam";

    setError(errorMessage);

    Swal.fire({
      icon: "error",
      title: "Update Failed",
      text: errorMessage,
      confirmButtonColor: "#d33"
    });

  } finally {
    setIsSubmitting(false);
  }
};


  return {
    formData,
    loading,
    isSubmitting,
    error: error || fetchError,
    handleChange,
    handleCheckboxChange,
    handleSubmit
  };
}
