'use client';

import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

import {
    fetchModules,
    createModule as createModuleAction,
    updateModule as updateModuleAction,
    deleteModule as deleteModuleAction
} from "./moduleThunks";

import { ModuleDto } from "./moduleTypes";
import { clearCurrentModule, clearModuleError } from "./moduleSlice";



export const useModuleViewModel = () => {
    const dispatch = useAppDispatch();

    const {
        modules,
        loading,
        error,
        currentModule
    } = useAppSelector(state => state.modules);

    const loadModules = useCallback(() => {
        dispatch(fetchModules());
    }, [dispatch]);

    const createModule = useCallback(async (data: ModuleDto) => {
        const res = await dispatch(createModuleAction(data)).unwrap();
        return res;
    }, [dispatch]);

    const updateModule = useCallback(async ({ id, data }: { id: number; data: ModuleDto }) => {
        const res = await dispatch(updateModuleAction({ id, data })).unwrap();
        return res;
    }, [dispatch]);

    const deleteModule = useCallback(async (id: number) => {
        const res = await dispatch(deleteModuleAction(id)).unwrap();
        return res.success;
    }, [dispatch]);

    const clearCurrent = useCallback(() => dispatch(clearCurrentModule()), [dispatch]);

    const clearErrorState = useCallback(() => dispatch(clearModuleError()), [dispatch]);

    useEffect(() => {
        loadModules();
    }, [loadModules]);

    return {
        modules,
        isLoading: loading,
        error,
        currentModule,

        createModule,
        updateModule,
        deleteModule,

        clearCurrent,
        clearError: clearErrorState,
        refetch: loadModules
    };
};
