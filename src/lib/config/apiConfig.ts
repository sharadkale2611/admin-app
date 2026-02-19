// src/lib/config/apiConfig.ts

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL_API?.replace(/\/$/, "") || "";

const API_ENDPOINTS = {
  /* ===================== BASE ===================== */
  PARENT_URL: process.env.NEXT_PUBLIC_API_PARENT_URL || "",
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
  BASE_URL_API: process.env.NEXT_PUBLIC_API_BASE_URL_API || "",
  TIMEOUT: Number(process.env.NEXT_PUBLIC_API_TIMEOUT || 5000),

  // PARENT_URL: 'https://rsa.ysaasinfotech.com',
  // BASE_URL: 'https://apirsa.ysaasinfotech.com',
  // BASE_URL_API: 'https://apirsa.ysaasinfotech.com/api',
  // TIMEOUT: 5000,

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

  ROLES: {
    GET_LIST: "/roles",
    GET_BY_ID: "/roles",
  },

  DASHBOARD: {
    ADMIN_SUMMARY: "/admin-dashboard/summary",
    // STUDENT_ATTENDANCE_TODAY: "/api/admin-dashboard/student-attendance-today",
    // RECENT_ACTIVITY: "/api/admin-dashboard/recent-activity",
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
    GET_BY_AADHAR: "/Students/by-aadhar",
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
    GET_BY_STUDENT_ID: "/ExamMarks/by-student",
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
    GET_BY_STUDENT_ID: "/Attendance/student",
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
  
  COURSE_MODULE_CONTENTS: {
  GET_LIST: "/CourseModuleContents",
  GET_BY_ID: "/CourseModuleContents",
  POST_CREATE: "/CourseModuleContents",
  PUT_UPDATE: "/CourseModuleContents",
  DELETE: "/CourseModuleContents",
},

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

  /* ===================== PERMISSIONS ===================== */
  PERMISSIONS: {
    GET_LIST: "/permissions",
    GET_PAGINATED: "/permissions/paginated",
    GET_BY_ID: "/permissions",
    POST_CREATE: "/permissions",
    PUT_UPDATE: "/permissions",
    DELETE: "/permissions",
  },

  QUESTION_TYPES: {
    GET_LIST: "/QuestionTypes",
    GET_PAGINATED: "/QuestionTypes/paginated",
    GET_BY_ID: "/QuestionTypes",
    POST_CREATE: "/QuestionTypes",
    PUT_UPDATE: "/QuestionTypes",
    DELETE: "/QuestionTypes",
  },

  QUESTION_TYPE_RULES: {
    GET_LIST: "/QuestionTypeRules",
    GET_PAGINATED: "/QuestionTypeRules/paginated",
    GET_BY_ID: "/QuestionTypeRules",
    POST_CREATE: "/QuestionTypeRules",
    PUT_UPDATE: "/QuestionTypeRules",
    DELETE: "/QuestionTypeRules",
  },

  QUESTIONS: {
    GET_LIST: "/Questions",
    GET_PAGINATED: "/Questions/paginated",
    GET_BY_ID: "/Questions",
    POST_CREATE: "/Questions",
    PUT_UPDATE: "/Questions",
    DELETE: "/Questions",
  },
EXAMPAPERS: {
  GET_LIST: "/ExamPapers",
  GET_BY_ID: "/ExamPapers",
  POST_CREATE: "/ExamPapers",
  PUT_UPDATE: "/ExamPapers",
  DELETE: "/ExamPapers",
},


EXAMPAPERQUESTIONS: {
  GET_LIST: "/ExamPaperQuestions",
  GET_BY_ID: "/ExamPaperQuestions",
  POST_CREATE: "/ExamPaperQuestions",
  PUT_UPDATE: "/ExamPaperQuestions",
  DELETE: "/ExamPaperQuestions",
},

  QUESTION_OPTIONS: {
    GET_LIST: "/QuestionOptions",
    GET_PAGINATED: "/QuestionOptions/paginated",
    GET_BY_ID: "/QuestionOptions",
    POST_CREATE: "/QuestionOptions",
    GET_BY_QUESTION: "/questionoptions/by-question", 
    PUT_UPDATE: "/QuestionOptions",
    DELETE: "/QuestionOptions",
  },

  QUESTION_ATTACHMENTS: {
    GET_LIST: "/QuestionAttachments",
    GET_PAGINATED: "/QuestionAttachments/paginated",
    GET_BY_ID: "/QuestionAttachments",
    POST_CREATE: "/QuestionAttachments",
    PUT_UPDATE: "/QuestionAttachments",
    DELETE: "/QuestionAttachments",
  },

  QUESTION_ANSWERS: {
    GET_LIST: "/QuestionAnswers",
    GET_PAGINATED: "/QuestionAnswers/paginated",
    GET_BY_ID: "/QuestionAnswers",
    POST_CREATE: "/QuestionAnswers",
    PUT_UPDATE: "/QuestionAnswers",
    DELETE: "/QuestionAnswers",
  },

  EXAM_ATTEMPTS: {
  GET_LIST: "/ExamAttempts",
  GET_BY_ID: "/ExamAttempts",
  POST_CREATE: "/ExamAttempts",
  PUT_UPDATE: "/ExamAttempts",
  DELETE: "/ExamAttempts",
},

EXAM_ATTEMPT_QUESTIONS: {
  GET_LIST: "/ExamAttemptQuestions",
  GET_BY_ID: "/ExamAttemptQuestions",
  GET_BY_ATTEMPT: "/ExamAttemptQuestions/by-attempt",
  POST_CREATE: "/ExamAttemptQuestions",
  PUT_UPDATE: "/ExamAttemptQuestions",
  DELETE: "/ExamAttemptQuestions",
},

STUDENT_ANSWERS: {
 GET_LIST: "/StudentAnswers",
 GET_BY_ID: "/StudentAnswers",
 POST_CREATE: "/StudentAnswers",
 PUT_UPDATE: "/StudentAnswers",
 DELETE: "/StudentAnswers",
},
SAASFEATURES: {
  GET_LIST: "/SaaSFeatures",
  GET_BY_ID: "/SaaSFeatures",
  POST_CREATE: "/SaaSFeatures",
  PUT_UPDATE: "/SaaSFeatures",
  DELETE: "/SaaSFeatures",
},

SUBSCRIPTIONPLANS: {
    GET_LIST: "/SubscriptionPlans",
    GET_BY_ID: "/SubscriptionPlans",
    POST_CREATE: "/SubscriptionPlans",
    PUT_UPDATE: "/SubscriptionPlans",
    DELETE: "/SubscriptionPlans",
  },
};

export default API_ENDPOINTS;
