// lib/features/auth/authTypes.ts
export interface User {
    userId: string;
    username: string;
    email: string;
    roles: string[];
    firmId?: number | null;
    firmName?: string;
    firmCode?: string;
    // Add any other user properties you need
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}