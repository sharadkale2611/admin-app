import { AdmissionDraftState } from "./admissionDraftTypes";

export function mapDraftToCreateAdmissionDto(draft: AdmissionDraftState) {
    console.log("🧪 Draft snapshot:", draft);

    if (!draft.student) throw new Error("Student is missing");
    if (!draft.courseId) throw new Error("Course is missing");
    if (!draft.enrollmentDate) throw new Error("Enrollment date is missing");
    if (!draft.pricing) throw new Error("Pricing is missing");
    if (!draft.pricing.courseFeeId) throw new Error("CourseFeeId is missing");

    return {
        student: draft.student,

        courseId: draft.courseId,
        enrollmentType: draft.enrollmentType ?? "Regular",
        enrollmentDate: draft.enrollmentDate,

        academicDetails: draft.academicDetails ?? null,

        pricing: {
            courseFeeId: draft.pricing.courseFeeId,
            totalAmount: draft.pricing.totalAmount,
            finalAmount: draft.pricing.finalAmount,
            paidAmount: draft.pricing.paidAmount ?? 0,
            discountCode: draft.pricing.discountCode,
            discountAmount: draft.pricing.discountAmount ?? 0,
            paymentMode: draft.pricing.paymentMode,
            remarks: draft.pricing.remarks,
            installments: draft.pricing.installments ?? [],
        },
    };
}
