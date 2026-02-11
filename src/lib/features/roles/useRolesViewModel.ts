// src/lib/features/roles/useRolesViewModel.ts

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect, useCallback } from "react";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";

import {
    fetchRoles,
    fetchRoleById,
} from "./roleThunks";

export const useRolesViewModel = () => {
    const dispatch: ThunkDispatch<RootState, unknown, AnyAction> =
        useAppDispatch();

    const {
        roles,
        currentRole,
        loading,
        error,
    } = useAppSelector((state: RootState) => state.roles);

    const safeRoles = roles || [];

    /* ===============================
       Fetch Roles
    ================================ */

    const fetchRoleData = useCallback(() => {
        dispatch(fetchRoles());
    }, [dispatch]);

    /* ===============================
       Initial Load
    ================================ */

    useEffect(() => {
        fetchRoleData();
    }, [fetchRoleData]);

    /* ===============================
       Action Handlers
    ================================ */

    const handleGetById = useCallback(
        (id: number) => {
            dispatch(fetchRoleById(id));
        },
        [dispatch]
    );

    return {
        /* ===== State ===== */
        roles: safeRoles,
        currentRole,
        isLoading: loading,
        error,

        /* ===== Actions ===== */
        getById: handleGetById,
        refetch: fetchRoleData,
    };
};
