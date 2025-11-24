// src/lib/features/classRoom/useClassRoomViewModel.ts

'use client';
import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
    fetchClassRooms,
    createClassRoom as createClassRoomAction,
    updateClassRoom as updateClassRoomAction,
    deleteClassRoom as deleteClassRoomAction
} from "./classRoomThunks";
import { ClassRoomDto } from "./classRoomTypes";
import { clearCurrentClassRoom, clearClassRoomError } from "./classRoomSlice";

export const useClassRoomViewModel = () => {
    const dispatch = useAppDispatch();
    const {
        classRooms,
        loading,
        error,
        currentClassRoom
    } = useAppSelector(state => state.classRooms);

    const fetchAll = useCallback(() => {
        dispatch(fetchClassRooms());
    }, [dispatch]);

    const createClassRoom = useCallback(async (data: ClassRoomDto) => {
        const result = await dispatch(createClassRoomAction(data)).unwrap();
        return result;
    }, [dispatch]);

    const updateClassRoom = useCallback(async ({ id, data }: { id: number; data: ClassRoomDto }) => {
        const result = await dispatch(updateClassRoomAction({ id, data })).unwrap();
        return result;
    }, [dispatch]);

    const handleDelete = useCallback(async (id: number): Promise<boolean> => {
        try {
            const result = await dispatch(deleteClassRoomAction(id)).unwrap();
            return result.success;
        } catch (err) {
            console.error("Failed to delete classroom:", err);
            return false;
        }
    }, [dispatch]);

    const clearCurrent = useCallback(() => {
        dispatch(clearCurrentClassRoom());
    }, [dispatch]);

    const clearErrorState = useCallback(() => {
        dispatch(clearClassRoomError());
    }, [dispatch]);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    return {
        classRooms,
        isLoading: loading,
        error,
        currentClassRoom,

        fetchClassRooms: fetchAll,
        createClassRoom,
        updateClassRoom,
        handleDelete,
        clearCurrent,
        clearError: clearErrorState,
        refetch: fetchAll
    };
};
