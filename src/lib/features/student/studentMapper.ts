import { CreatedStudent, Student } from './studentTypes';

export const mapCreatedStudentToStudent = (
    cs: CreatedStudent
): Student => ({
    studentId: cs.studentId.toString(),
    studentCode: cs.studentCode,
    userName: cs.userName,

    // fallback values (until refetch)
    userId: '',
    email: '',
    mobileNumber: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
});
