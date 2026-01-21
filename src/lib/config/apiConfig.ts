// src/lib/config/apiConfig.ts

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL_API?.replace(/\/$/, '') || '';

const API_ENDPOINTS = {
  /* ===================== BASE ===================== */
  // PARENT_URL: process.env.NEXT_PUBLIC_API_PARENT_URL || "",
  // BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
  // BASE_URL_API: process.env.NEXT_PUBLIC_API_BASE_URL_API || "",
  // TIMEOUT: Number(process.env.NEXT_PUBLIC_API_TIMEOUT || 5000),

  PARENT_URL: 'https://rsa.ysaasinfotech.com',
  BASE_URL: 'https://apirsa.ysaasinfotech.com',
  BASE_URL_API: 'https://apirsa.ysaasinfotech.com/api',
  TIMEOUT: Number(process.env.NEXT_PUBLIC_API_TIMEOUT || 5000),



  /* ===================== AUTH ===================== */
  AUTH: {
    LOGIN: "/Auth/login",
    LOGOUT: "/Auth/logout",
    REVOKE: "/Auth/revoke",
    REFRESH: "/Auth/refresh-token",
    ME: "/Auth/me",
    CHECK: "/Auth/check",
  },

  /* ===================== FIRMS ===================== */
  FIRM: {
    GET_LIST_PAGINATED: "/Firms/paginated",
    GET_LIST: "/Firms",
    GET_BY_ID: "/Firms",
    POST_CREATE: "/Firms",
    PUT_UPDATE: "/Firms",
    DELETE: "/Firms",
  },

  /* ===================== STAFF ===================== */
  STAFF: {
    GET_LIST_PAGINATED: "/Staffs/paginated",
    GET_LIST: "/Staffs",
    GET_BY_ID: "/Staffs",
    POST_CREATE: "/Staffs",
    PUT_UPDATE: "/Staffs",
    DELETE: "/Staffs",
    GET_BY_COURSE: "/Staffs/trainers/by-course",
  },

  /* ===================== STUDENTS ===================== */
  STUDENT: {
    GET_LIST_PAGINATED: "/Students/paginated",
    GET_LIST: "/Students",
    GET_BY_ID: "/Students",
    POST_CREATE: "/Students",
    PUT_UPDATE: "/Students",
    DELETE: "/Students",
    GET_BY_MOBILE: "/Students/by-mobile",
    GET_BATCH_COURSE_ASSIGNMENTS: "/Students/batch-course-assignments",
  },

  /* ===================== EXAM MARKS ===================== */
  EXAM_MARKS: {
    GET_LIST_PAGINATED: "/ExamMarks/paginated",
    GET_LIST: "/ExamMarks",
    GET_BY_ID: "/ExamMarks",
    POST_CREATE: "/ExamMarks",
    PUT_UPDATE: "/ExamMarks",
    DELETE: "/ExamMarks",
  },

  /* ===================== ADMISSIONS / ENROLLMENTS ===================== */
  ADMISSION: {
    GET_LIST_PAGINATED: "/Enrollments/paginated",
    GET_BY_ID: "/Enrollments",
    POST_CREATE: "/Enrollments",
    POST_COMPLETE_CREATE: "/Admissions",
    PUT_UPDATE: "/Enrollments",
    DELETE: "/Enrollments",
  },

  /* ===================== COURSE CATEGORIES ===================== */
  COURSE_CATEGORIES: {
    GET_LIST: "/CourseCategories",
    GET_TREE: "/CourseCategories/tree",
    GET_BY_ID: "/CourseCategories",
    POST_CREATE: "/CourseCategories",
    PUT_UPDATE: "/CourseCategories",
    DELETE: "/CourseCategories",
  },

  /* ===================== DISCOUNT CODES ===================== */
  DISCOUNT_CODES: {
    GET_LIST: "/DiscountCodes",
    GET_BY_ID: "/DiscountCodes",
    POST_CREATE: "/DiscountCodes",
    PUT_UPDATE: "/DiscountCodes",
    DELETE: "/DiscountCodes",
  },

  /* ===================== COURSES ===================== */
  COURSES: {
    GET_LIST_PAGINATED: "/Courses/paginated",
    GET_LIST: "/Courses",
    GET_BY_ID: "/Courses",
    POST_CREATE: "/Courses",
    PUT_UPDATE: "/Courses",
    DELETE: "/Courses",
  },

  /* ===================== COURSE FEES ===================== */
  COURSE_FEES: {
    GET_LIST: "/CourseFees",
    GET_BY_ID: "/CourseFees",
    POST_CREATE: "/CourseFees",
    PUT_UPDATE: "/CourseFees",
    DELETE: "/CourseFees",
    GET_BY_FIRM: "/CourseFees/by-firm",
  },

  /* ===================== CLASS ROOMS ===================== */
  CLASS_ROOMS: {
    GET_LIST: "/ClassRooms",
    GET_BY_ID: "/ClassRooms",
    POST_CREATE: "/ClassRooms",
    PUT_UPDATE: "/ClassRooms",
    DELETE: "/ClassRooms",
  },

  /* ===================== MODULES ===================== */
  MODULES: {
    GET_LIST: "/Modules",
    GET_BY_ID: "/Modules",
    POST_CREATE: "/Modules",
    PUT_UPDATE: "/Modules",
    DELETE: "/Modules",
  },

  /* ===================== COURSE MODULES ===================== */
  COURSE_MODULES: {
    GET_LIST: "/CourseModules",
    GET_BY_ID: "/CourseModules",
    POST_CREATE: "/CourseModules",
    PUT_UPDATE: "/CourseModules",
    DELETE: "/CourseModules",
    GET_BY_COURSE: "/CourseModules/course",
  },

  /* ===================== BATCHES ===================== */
  BATCHES: {
    GET_LIST_PAGINATED: "/Batches/paginated",
    GET_LIST: "/Batches",
    GET_BY_ID: "/Batches",
    POST_CREATE: "/Batches",
    PUT_UPDATE: "/Batches",
    DELETE: "/Batches",
    GET_BY_STUDENT: "/Batches/by-student",
    GET_BY_COURSE: "/Batches/by-course",
  },

  /* ===================== ATTENDANCE SESSIONS ===================== */
  ATTENDANCE_SESSIONS: {
    GET_LIST_PAGINATED: "/AttendanceSession/paginated",
    GET_LIST: "/AttendanceSession",
    GET_BY_ID: "/AttendanceSession",
    POST_CREATE: "/AttendanceSession",
    PUT_UPDATE: "/AttendanceSession",
    DELETE: "/AttendanceSession",
  },

  /* ===================== ATTENDANCE ===================== */
  ATTENDANCE: {
    GET_BY_SESSION: "/Attendance/by-session",
    PUT_UPDATE_STATUS: "/Attendance/update-status",
  },

  /* ===================== STUDENT BATCH ASSIGNMENTS ===================== */
  STUDENT_BATCH_ASSIGNMENTS: {
    GET_LIST_PAGINATED: "/StudentBatchAssignments/paginated",
    GET_LIST: "/StudentBatchAssignments",
    GET_BY_ID: "/StudentBatchAssignments",
    POST_CREATE: "/StudentBatchAssignments",
    POST_CREATE_BULK: "/StudentBatchAssignments/bulk",
    PUT_UPDATE: "/StudentBatchAssignments",
    DELETE: "/StudentBatchAssignments",
    GET_BY_BATCH: "/StudentBatchAssignments/by-batch",
  },

  /* ===================== BRANCHES ===================== */
  BRANCHES: {
    GET_LIST: "/Branches",
  },

  /* ===================== BATCH STUDY WORKS ===================== */
  BATCH_STUDY_WORKS: {
    GET_LIST_PAGINATED: "/BatchStudyWorks/paginated",
    GET_LIST: "/BatchStudyWorks",
    GET_BY_ID: "/BatchStudyWorks",
    POST_CREATE: "/BatchStudyWorks",
    PUT_UPDATE: "/BatchStudyWorks",
    DELETE: "/BatchStudyWorks",
  },

  /* ===================== BATCH STUDY WORK ATTACHMENTS ===================== */
  BATCH_STUDY_WORK_ATTACHMENTS: {
    GET_BY_BATCH: "/BatchStudyWorkAttachements/by-batch",
    UPLOAD: "/BatchStudyWorkAttachements/upload",
    DELETE: "/BatchStudyWorkAttachements",
  },

  /* ===================== BATCH SCHEDULES ===================== */
  BATCH_SCHEDULES: {
    GET_BY_BATCH: "/BatchSchedules/by-batch",
    POST_CREATE_BULK: "/BatchSchedules/bulk-create",
    POST_CREATE_SINGLE: "/BatchSchedules/create",
  },

  /* ===================== NOTICES ===================== */
  NOTICES: {
    GET_LIST: "/Notices",
    GET_BY_ID: "/Notices",
    POST_CREATE: "/Notices",
    PUT_UPDATE: "/Notices",
    DELETE: "/Notices",
  },

  /* ===================== STUDENT PAYMENTS ===================== */
  STUDENT_PAYMENTS: {
    GET_BY_STUDENT_ID: "/StudentPayments/student-id",
    UPDATE_PAYMENT: "/StudentPayments/updatePayment",
  },

  /* ===================== EXAMS ===================== */
  EXAMS: {
    GET_LIST_PAGINATED: "/Exams/paginated",
    GET_LIST: "/Exams",
    GET_BY_ID: "/Exams",
    POST_CREATE: "/Exams",
    PUT_UPDATE: "/Exams",
    DELETE: "/Exams",
    GET_STUDENTS_BY_MODULE: "/Exams/students-by-module",
  },

  /* ===================== STATES / CITIES ===================== */
  STATES: {
    GET_LIST: "/states",
  },
  CITIES: {
    GET_LIST: "/cities",
  },

  /* ===================== USERS ===================== */
  USERS: {
    BASE: "/Users",
  },
};


export const getApiUrl = (path: string) => {
  if (!path.startsWith('/')) {
    path = '/' + path;
  }
  console.log('API URL:', `${API_BASE_URL}---${path}`);
  return `${API_BASE_URL}${path}`;
};

export default API_ENDPOINTS;


