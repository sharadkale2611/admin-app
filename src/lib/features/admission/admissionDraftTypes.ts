// src/lib/features/admission/admissionDraftTypes.ts

import { InstallmentCycle, PaymentMode } from "./useCreateAdmissionViewModel";

export type AddressType = "Permanent" | "Residential" | "Office";

export type StreamType = "NA" | "Science" | "Commerce" | "Arts";
export type MediumType = "English" | "Semi-English" | "Marathi";
export type StdType = "8th" | "9th" | "10th" | "11th" | "12th";
export type BoardType = "MSBSHSE" | "CBSE" | "ICSE" | "Other";

/* ---------------- STUDENT ---------------- */
export interface DraftStudent {
    studentId?: number;
    aadharNumber: string;
    mobile: string;
    dateOfBirth?: string;
    
    firstName?: string;
    lastName?: string;
    email?: string;

    fatherName?: string;
    motherName?: string;
    alternateMobile?: string;

    address?: string;
    pincode?: string;
    stateId?: number;
    cityId?: number;
    addressType?: AddressType;

    gender?: "Male" | "Female" | "Other";
    reservationCategory?: string;
    fatherOccupation?: string;

    profileImagePath?: string;
    isExisting?: boolean;
}

/* ---------------- ACADEMIC (NEW) ---------------- */
export interface AcademicDetails {
    stream: StreamType;

    currentAcademicYear: string;
    currentClass: StdType;
    currentMedium: MediumType;
    currentBoard: BoardType;
    currentInstitution: string;

    prevAcademicYear: string;
    prevClass: StdType;
    prevMedium: MediumType;
    prevBoard: BoardType;
    prevInstitution: string;

    prevMarkEnglish?: string;
    prevMarkMath?: string;
    prevMarkScience?: string;
    prevPercentage?: string;
    prevGrade?: string;
}

/* ---------------- DRAFT STATE ---------------- */
export interface AdmissionDraftState {
    student: DraftStudent | null;
    studentConfirmed: boolean;

    courseId?: number;
    enrollmentType?: "Regular" | "Trial" | "Transfer" | "Special";
    enrollmentDate?: string;
    courseConfirmed?: boolean;

    academicDetails?: AcademicDetails; // ✅ ADD THIS

    pricing?: {
        courseFeeId?: number;     // ✅ ADD
        totalAmount: number;

        discountCode?: string;
        discountAmount?: number;

        finalAmount: number;
        paidAmount?: number;

        paymentMode?: PaymentMode;
        remarks?: string;         // ✅ ADD

        installmentCount?: number;
        installmentCycle?: InstallmentCycle;

        installments?: {
            installmentCount: number;
            amount: number;
            date: string;
        }[];
    };

    pricingConfirmed?: boolean;

    installments?: {
        installmentCount: number;
        amount: number;
        date: string;
    }[];
}
