// src/lib/features/classRoom/classRoomSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    ClassRoomState,
    ClassRoomResponseDto
} from "./classRoomTypes";
import {
    fetchClassRooms,
    createClassRoom,
    updateClassRoom,
    deleteClassRoom,
    fetchClassRoomById
} from "./classRoomThunks";

const initialState: ClassRoomState = {
    classRooms: [],
    currentClassRoom: null,
    totalCount: 0,
    pageSize: 10,
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null
};

const classRoomSlice = createSlice({
    name: "classRooms",
    initialState,
    reducers: {
        clearCurrentClassRoom: (state) => {
            state.currentClassRoom = null;
        },
        clearClassRoomError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch list
            .addCase(fetchClassRooms.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClassRooms.fulfilled, (state, action: PayloadAction<ClassRoomResponseDto[]>) => {
                state.loading = false;
                state.classRooms = action.payload;
                state.totalCount = action.payload.length;
                state.totalPages = Math.ceil(action.payload.length / state.pageSize);
            })
            .addCase(fetchClassRooms.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Failed to fetch classrooms";
            })

            // Fetch by ID
            .addCase(fetchClassRoomById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClassRoomById.fulfilled, (state, action: PayloadAction<ClassRoomResponseDto>) => {
                state.loading = false;
                state.currentClassRoom = action.payload;
            })
            .addCase(fetchClassRoomById.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Failed to fetch classroom";
                state.currentClassRoom = null;
            })

            // Create
            .addCase(createClassRoom.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createClassRoom.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.success && action.payload.classRoom) {
                    state.classRooms.unshift(action.payload.classRoom);
                    state.totalCount += 1;
                    state.totalPages = Math.ceil(state.totalCount / state.pageSize);
                }
            })
            .addCase(createClassRoom.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Failed to create classroom";
            })

            // Update
            .addCase(updateClassRoom.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateClassRoom.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.success && action.payload.classRoom) {
                    const index = state.classRooms.findIndex(c => c.classRoomId === action.payload.classRoom.classRoomId);
                    if (index !== -1) {
                        state.classRooms[index] = action.payload.classRoom;
                    }
                    if (state.currentClassRoom && state.currentClassRoom.classRoomId === action.payload.classRoom.classRoomId) {
                        state.currentClassRoom = action.payload.classRoom;
                    }
                }
            })
            .addCase(updateClassRoom.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Failed to update classroom";
            })

            // Delete
            .addCase(deleteClassRoom.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteClassRoom.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.success) {
                    state.classRooms = state.classRooms.filter(c => c.classRoomId !== action.payload.id);
                    state.totalCount -= 1;
                    state.totalPages = Math.ceil(state.totalCount / state.pageSize);
                    if (state.currentClassRoom && state.currentClassRoom.classRoomId === action.payload.id) {
                        state.currentClassRoom = null;
                    }
                }
            })
            .addCase(deleteClassRoom.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Failed to delete classroom";
            });
    }
});

export const {
    clearCurrentClassRoom,
    clearClassRoomError
} = classRoomSlice.actions;

export const classRoomReducer = classRoomSlice.reducer;
export default classRoomSlice.reducer;
