import { CreatedStudent, Student } from './studentTypes';

export const mapCreatedStudentToStudent = (
    cs: CreatedStudent
): Student => ({
    studentId: cs.studentId,      // ✅ number
    userId: 0,                    // ✅ placeholder number

    studentCode: cs.studentCode,
    userName: cs.userName,

    // optional / fallback values
    firmId: undefined,
    firmCode: undefined,
    firmName: undefined,

    firstName: '',
    lastName: '',

    motherName: undefined,
    fatherName: undefined,

    profileImagePath: undefined,

    dateOfBirth: undefined,
    age: undefined,
    gender: undefined,

    email: undefined,
    mobileNumber1: undefined,
    mobileNumber2: undefined,
    whatsappNumber: undefined,

    resevationCategory: undefined,
    fathersOccupation: undefined,

    isActive: true,
    isDeleted: false,

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
});
