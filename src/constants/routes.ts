// constants/routes.ts
export const AppRoutes = {
    // Public routes
    HOME: '/',
    ABOUT: '/about',
    CONTACT: '/contact',

    // Auth routes
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    // Protected routes
    DASHBOARD: '/dashboard',
    CLSAAROOM: '/ClassRoom',

    PROFILE: '/profile',
    STAFF: '/staff',
    STUDENTS: '/students',
    ADMISSIONS: '/admissions',
    FRIMS: '/firms',
    COURSES: '/courses',
    FEES: '/fees',
    DISCOUNUTS: '/discountCodes',
    COURSE_CATEGORY: '/courseCategory',
    SETTINGS: '/settings',
    ADMIN: '/admin',

    // API routes
    API: {
        AUTH: {
            LOGIN: '/api/auth/login',
            LOGOUT: '/api/auth/logout',
            REGISTER: '/api/auth/register',
            REFRESH: '/api/auth/refresh',
        },
        USER: '/api/user',
    },

    // Utility function to generate paths with params
    withParam: (route: string, param: string | number) => {
        return route.replace(/\[.*?\]/, param.toString());
    },
} as const;

// Type for route keys
export type AppRouteKeys = keyof typeof AppRoutes;

// Type for protected routes
export const ProtectedRoutes = [
    AppRoutes.DASHBOARD,
    AppRoutes.PROFILE,
    AppRoutes.SETTINGS,
    AppRoutes.ADMIN,
] as const;

// Type for auth routes (guest only)
export const AuthRoutes = [
    AppRoutes.LOGIN,
    AppRoutes.REGISTER,
    AppRoutes.FORGOT_PASSWORD,
    AppRoutes.RESET_PASSWORD,
] as const;

// Helper type to extract route values
type ValueOf<T> = T[keyof T];
export type AppRouteValues = ValueOf<typeof AppRoutes>;
export type ProtectedRouteValues = typeof ProtectedRoutes[number];
export type AuthRouteValues = typeof AuthRoutes[number];

// Type guard functions
export const isProtectedRoute = (path: string): path is ProtectedRouteValues => {
    return ProtectedRoutes.includes(path as ProtectedRouteValues);
};

export const isAuthRoute = (path: string): path is AuthRouteValues => {
    return AuthRoutes.includes(path as AuthRouteValues);
};