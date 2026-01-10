// src/lib/features/classRoom/classRoomTypes.ts

export interface ClassRoom {
    classRoomId: number;
    firmId?: number | null;
    classRoomName: string;
    status: boolean;
    createdAt: string;
    updatedAt?: string | null;
    isDeleted?: boolean;
}

export interface ClassRoomDto {
    firmId?: number | null;   
    classRoomName: string;
    status: boolean;
}

export interface ClassRoomResponseDto extends ClassRoomDto {
    classRoomId: number;
    firmName?: string | null;
    createdAt: string;
    updatedAt?: string | null;
    isDeleted?: boolean;
}

export interface PaginatedClassRooms {
    items: ClassRoomResponseDto[];
    totalCount: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
}

export interface ClassRoomState {
    classRooms: ClassRoomResponseDto[];
    currentClassRoom: ClassRoomResponseDto | null;
    totalCount: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
    loading: boolean;
    error: string | null;
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string | null;
    errors?: Record<string, string[]> | null;
}
