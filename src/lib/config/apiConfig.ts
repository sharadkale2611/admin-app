// src/lib/config/apiConfig.ts
// This file centralizes the API endpoint paths, using environment variables for flexibility.

// Base URLs from environment variables, defaulting to empty strings if not set.
const base_url = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const base_url_api = process.env.NEXT_PUBLIC_API_BASE_URL_API || "";

// Define all API endpoints.
// Each endpoint is constructed by concatenating the base_url_api with a specific path
// derived from another environment variable, or a fallback path.
const API_ENDPOINTS = {
  PARENT_URL: process.env.NEXT_PUBLIC_API_PARENT_URL || "", // Parent URL, if applicable
  BASE_URL: base_url, // General base URL
  BASE_URL_API: base_url_api, // Base URL specifically for API calls
  TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || "5000", 10), // API timeout in milliseconds

  // Authentication related endpoints
  AUTH: {
    LOGIN: process.env.NEXT_PUBLIC_AUTH_LOGIN_ENDPOINT || "api/login",
    LOGOUT: process.env.NEXT_PUBLIC_AUTH_LOGOUT_ENDPOINT || "api/logout",
    REFRESH: process.env.NEXT_PUBLIC_AUTH_REFRESH_ENDPOINT || "api/refresh",
    ME: process.env.NEXT_PUBLIC_AUTH_ME_ENDPOINT || "api/me",
    // Assuming a CHECK endpoint is needed for session validation, similar to ME or a dedicated one
    CHECK: process.env.NEXT_PUBLIC_AUTH_CHECK_ENDPOINT || "api/check",
  },
  // Firm-related endpoints
  FIRM: {
    LIST:
      process.env.NEXT_PUBLIC_FIRMS_PAGINATED_ENDPOINT || "/Firms/paginated", // paginated list
    GET_BY_ID:
      `${base_url_api}${process.env.NEXT_PUBLIC_FIRMS_ENDPOINT}` ||
      `${base_url_api}/Firms`,
    // fetch single firm
    CREATE: process.env.NEXT_PUBLIC_FIRMS_ENDPOINT || "/Firms", // create firm
    UPDATE: process.env.NEXT_PUBLIC_FIRMS_ENDPOINT || "/Firms", // update firm
    DELETE: process.env.NEXT_PUBLIC_FIRMS_ENDPOINT || "/Firms", // delete firm
  },

  STAFF: {
    GET_LIST_PAGINATED:
      process.env.NEXT_PUBLIC_STAFFS_PAGINATED_ENDPOINT || "api/staffs",
    GET_LIST: process.env.NEXT_PUBLIC_STAFFS_ENDPOINT || "api/staffs",
    GET_BY_ID: process.env.NEXT_PUBLIC_STAFFS_ENDPOINT || "api/staffs",
    POST_CREATE: process.env.NEXT_PUBLIC_STAFFS_ENDPOINT || "api/staffs",
    PUT_UPDATE: process.env.NEXT_PUBLIC_STAFFS_ENDPOINT || "api/staffs",
    DELETE: process.env.NEXT_PUBLIC_STAFFS_ENDPOINT || "api/staffs",
  },
  STUDENT: {
    GET_LIST_PAGINATED:
      process.env.NEXT_PUBLIC_STUDENTS_PAGINATED_ENDPOINT || "api/Students",
    GET_LIST: process.env.NEXT_PUBLIC_STUDENTS_ENDPOINT || "api/Students",
    GET_BY_ID: process.env.NEXT_PUBLIC_STUDENTS_ENDPOINT || "api/Students",
    POST_CREATE: process.env.NEXT_PUBLIC_STUDENTS_ENDPOINT || "api/Students",
    PUT_UPDATE: process.env.NEXT_PUBLIC_STUDENTS_ENDPOINT || "api/Students",
    DELETE: process.env.NEXT_PUBLIC_STUDENTS_ENDPOINT || "api/Students",
  },
  ADMISSION: {
    GET_LIST_PAGINATED:
      process.env.NEXT_PUBLIC_ENROLLMENTS_PAGINATED_ENDPOINT ||
      "api/Enrollments",
    GET_BY_ID:
      process.env.NEXT_PUBLIC_ENROLLMENTS_ENDPOINT || "api/Enrollments",
    POST_CREATE:
      process.env.NEXT_PUBLIC_ENROLLMENTS_ENDPOINT || "api/Enrollments",
    PUT_UPDATE:
      process.env.NEXT_PUBLIC_ENROLLMENTS_ENDPOINT || "api/Enrollments",
    DELETE: process.env.NEXT_PUBLIC_ENROLLMENTS_ENDPOINT || "api/Enrollments",
  },
  COURSE_CATEGORIES: {
    GET_LIST:
      process.env.NEXT_PUBLIC_COURSE_CATEGORIES_ENDPOINT ||
      "/api/CourseCategories",
    GET_TREE:
      process.env.NEXT_PUBLIC_COURSE_CATEGORIES_ENDPOINT ||
      "/api/CourseCategories/tree",
    GET_BY_ID:
      process.env.NEXT_PUBLIC_COURSE_CATEGORIES_ENDPOINT ||
      "/api/CourseCategories",
    POST_CREATE:
      process.env.NEXT_PUBLIC_COURSE_CATEGORIES_ENDPOINT ||
      "/api/CourseCategories",
    PUT_UPDATE:
      process.env.NEXT_PUBLIC_COURSE_CATEGORIES_ENDPOINT ||
      "/api/CourseCategories",
    DELETE:
      process.env.NEXT_PUBLIC_COURSE_CATEGORIES_ENDPOINT ||
      "/api/CourseCategories",
  },
  DISCOUNT_CODES: {
    GET_LIST:
      process.env.NEXT_PUBLIC_DISCOUNT_CODES_ENDPOINT || "/api/DiscountCodes",
    GET_BY_ID:
      process.env.NEXT_PUBLIC_DISCOUNT_CODES_ENDPOINT || "/api/DiscountCodes",
    POST_CREATE:
      process.env.NEXT_PUBLIC_DISCOUNT_CODES_ENDPOINT || "/api/DiscountCodes",
    PUT_UPDATE:
      process.env.NEXT_PUBLIC_DISCOUNT_CODES_ENDPOINT || "/api/DiscountCodes",
    DELETE:
      process.env.NEXT_PUBLIC_DISCOUNT_CODES_ENDPOINT || "/api/DiscountCodes",
  },
  COURSES: {
    GET_LIST_PAGINATED:
      process.env.NEXT_PUBLIC_COURSES_PAGINATED_ENDPOINT ||
      "/api/Courses/paginated",
    GET_LIST: process.env.NEXT_PUBLIC_COURSES_ENDPOINT || "/api/Courses",
    GET_BY_ID: process.env.NEXT_PUBLIC_COURSES_ENDPOINT || "/api/Courses",
    POST_CREATE: process.env.NEXT_PUBLIC_COURSES_ENDPOINT || "/api/Courses",
    PUT_UPDATE: process.env.NEXT_PUBLIC_COURSES_ENDPOINT || "/api/Courses",
    DELETE: process.env.NEXT_PUBLIC_COURSES_ENDPOINT || "/api/Courses",
  },
  COURSE_FEES: {
    GET_LIST: process.env.NEXT_PUBLIC_COURSE_FEES_ENDPOINT || "/api/CourseFees",
    GET_BY_ID:
      process.env.NEXT_PUBLIC_COURSE_FEES_ENDPOINT || "/api/CourseFees",
    POST_CREATE:
      process.env.NEXT_PUBLIC_COURSE_FEES_ENDPOINT || "/api/CourseFees",
    PUT_UPDATE:
      process.env.NEXT_PUBLIC_COURSE_FEES_ENDPOINT || "/api/CourseFees",
    DELETE: process.env.NEXT_PUBLIC_COURSE_FEES_ENDPOINT || "/api/CourseFees",
    // GET_BY_FIRM: (process.env.NEXT_PUBLIC_COURSE_FEES_ENDPOINT || '/api/CourseFees') + "/CourseFeeByFirmId"
    GET_BY_FIRM:
      (process.env.NEXT_PUBLIC_COURSE_FEES_ENDPOINT || "/api/CourseFees") +
      "/by-firm",
  },
  CLASS_ROOMS: {
    GET_LIST: process.env.NEXT_PUBLIC_CLASS_ROOMS_ENDPOINT || "/ClassRooms",
    GET_BY_ID: process.env.NEXT_PUBLIC_CLASS_ROOMS_ENDPOINT || "/ClassRooms",
    POST_CREATE: process.env.NEXT_PUBLIC_CLASS_ROOMS_ENDPOINT || "/ClassRooms",
    PUT_UPDATE: process.env.NEXT_PUBLIC_CLASS_ROOMS_ENDPOINT || "/ClassRooms",
    DELETE: process.env.NEXT_PUBLIC_CLASS_ROOMS_ENDPOINT || "/ClassRooms",
  },
  MODULES: {
    GET_LIST: process.env.NEXT_PUBLIC_MODULES_ENDPOINT || "/Modules",
    GET_BY_ID: process.env.NEXT_PUBLIC_MODULES_ENDPOINT || "/Modules",
    POST_CREATE: process.env.NEXT_PUBLIC_MODULES_ENDPOINT || "/Modules",
    PUT_UPDATE: process.env.NEXT_PUBLIC_MODULES_ENDPOINT || "/Modules",
    DELETE: process.env.NEXT_PUBLIC_MODULES_ENDPOINT || "/Modules",
  },
  COURSE_MODULES: {
    GET_LIST:
      process.env.NEXT_PUBLIC_COURSE_MODULES_ENDPOINT || "/CourseModules",
    GET_BY_ID:
      process.env.NEXT_PUBLIC_COURSE_MODULES_ENDPOINT || "/CourseModules",
    POST_CREATE:
      process.env.NEXT_PUBLIC_COURSE_MODULES_ENDPOINT || "/CourseModules",
    PUT_UPDATE:
      process.env.NEXT_PUBLIC_COURSE_MODULES_ENDPOINT || "/CourseModules",
    DELETE: process.env.NEXT_PUBLIC_COURSE_MODULES_ENDPOINT || "/CourseModules",
  },
  BATCHES: {
    GET_LIST_PAGINATED: process.env.NEXT_PUBLIC_BATCHES_ENDPOINT || "/Batches/paginated",
    GET_LIST: process.env.NEXT_PUBLIC_BATCHES_ENDPOINT || "/Batches",
    GET_BY_ID: process.env.NEXT_PUBLIC_BATCHES_ENDPOINT || "/Batches",
    POST_CREATE: process.env.NEXT_PUBLIC_BATCHES_ENDPOINT || "/Batches",
    PUT_UPDATE: process.env.NEXT_PUBLIC_BATCHES_ENDPOINT || "/Batches",
    DELETE: process.env.NEXT_PUBLIC_BATCHES_ENDPOINT || "/Batches",
  },
  STUDENT_BATCH_ASSIGNMENTS: {
    GET_LIST_PAGINATED:
      process.env.NEXT_PUBLIC_STUDENT_BATCH_ASSIGNMENTS_ENDPOINT ||
      "/StudentBatchAssignments/paginated",
    GET_LIST:
      process.env.NEXT_PUBLIC_STUDENT_BATCH_ASSIGNMENTS_ENDPOINT ||
      "/StudentBatchAssignments",
    GET_BY_ID:
      process.env.NEXT_PUBLIC_STUDENT_BATCH_ASSIGNMENTS_ENDPOINT ||
      "/StudentBatchAssignments",
    POST_CREATE:
      process.env.NEXT_PUBLIC_STUDENT_BATCH_ASSIGNMENTS_ENDPOINT ||
      "/StudentBatchAssignments",
    PUT_UPDATE:
      process.env.NEXT_PUBLIC_STUDENT_BATCH_ASSIGNMENTS_ENDPOINT ||
      "/StudentBatchAssignments",
    DELETE:
      process.env.NEXT_PUBLIC_STUDENT_BATCH_ASSIGNMENTS_ENDPOINT ||
      "/StudentBatchAssignments",
  },
  BRANCHES: {
    GET_LIST: process.env.NEXT_PUBLIC_BRANCHES_ENDPOINT || "/Branches",
  },

  // Add other endpoint categories here as needed
};

/**
 * A utility function to construct a full API URL.
 * While the `API_ENDPOINTS` object already provides full URLs for many cases,
 * this function can be used for dynamic endpoints or if a different base URL is needed.
 * @param endpoint The specific path or a full URL segment to append to BASE_URL_API.
 * @returns The complete API URL.
 */
export const getApiUrl = (endpoint: string): string => {
  // Ensure no double slashes if endpoint already starts with one
  const trimmedBase = API_ENDPOINTS.BASE_URL_API.endsWith("/")
    ? API_ENDPOINTS.BASE_URL_API.slice(0, -1)
    : API_ENDPOINTS.BASE_URL_API;
  const trimmedEndpoint = endpoint.startsWith("/")
    ? endpoint.slice(1)
    : endpoint;
  return `${trimmedBase}/${trimmedEndpoint}`;
};

export default API_ENDPOINTS;
