// src/lib/features/role-permissions/useRolePermissionsViewModel.ts

import { useEffect, useMemo, useCallback, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
    fetchRolePermissions,
    saveRolePermissions,
} from "./rolePermissionThunks";
import { togglePermission } from "./rolePermissionSlice";
import { RolePermissionView } from "./rolePermissionTypes";

export const useRolePermissionsViewModel = (roleId: number) => {
    const dispatch = useAppDispatch();

    const { items, original, loading, saving } = useAppSelector(
        s => s.rolePermissions
    );

    const [selectedModule, setSelectedModule] = useState<string | null>(null);
    const [moduleSearch, setModuleSearch] = useState("");
    const [permissionSearch, setPermissionSearch] = useState("");

    /* ===============================
       Fetch on Load
    ================================ */
    useEffect(() => {
        dispatch(fetchRolePermissions(roleId));
    }, [dispatch, roleId]);

    /* ===============================
       Group by Module
    ================================ */
    const groupedPermissions = useMemo(() => {
        return items.reduce<Record<string, RolePermissionView[]>>(
            (acc, p) => {
                acc[p.module] = acc[p.module] || [];
                acc[p.module].push(p);
                return acc;
            },
            {}
        );
    }, [items]);

    const modules = Object.keys(groupedPermissions);

    /* ===============================
       Filter Modules (LEFT)
    ================================ */
    const filteredModules = useMemo(() => {
        if (!moduleSearch) return modules;

        return modules.filter(m =>
            m.toLowerCase().includes(moduleSearch.toLowerCase())
        );
    }, [modules, moduleSearch]);

    /* ===============================
       Filter Permissions (RIGHT)
    ================================ */
    const visiblePermissions = useMemo<RolePermissionView[]>(() => {
        if (!selectedModule) return [];

        const perms = groupedPermissions[selectedModule] || [];

        if (!permissionSearch) return perms;

        return perms.filter((p: RolePermissionView) =>
            p.permissionKey
                .toLowerCase()
                .includes(permissionSearch.toLowerCase())
        );
    }, [groupedPermissions, selectedModule, permissionSearch]);

    /* ===============================
       Toggle Permission
    ================================ */
    const setPermission = useCallback(
        (permissionId: number, value: boolean) =>
            dispatch(togglePermission({ permissionId, value })),
        [dispatch]
    );

    /* ===============================
       Dirty State
    ================================ */
    const isDirty = useMemo(() => {
        if (items.length !== original.length) return true;

        return items.some((item, index) =>
            item.permissionId !== original[index]?.permissionId ||
            item.isAllowed !== original[index]?.isAllowed
        );
    }, [items, original]);


    const toggleModule = useCallback(
        (value: boolean) => {
            if (!selectedModule) return;

            groupedPermissions[selectedModule]?.forEach(p => {
                dispatch(togglePermission({
                    permissionId: p.permissionId,
                    value,
                }));
            });
        },
        [dispatch, groupedPermissions, selectedModule]
    );

    /* ===============================
       Save
    ================================ */
    const save = useCallback(() => {
        return dispatch(
            saveRolePermissions({
                roleId,
                data: items.map(p => ({
                    permissionId: p.permissionId,
                    isAllowed: p.isAllowed,
                })),
            })
        );
    }, [dispatch, roleId, items]);

    return {
        /* Data */
        groupedPermissions,
        modules,
        filteredModules,
        visiblePermissions,

        /* State */
        selectedModule,
        loading,
        saving,
        isDirty,
        moduleSearch,
        permissionSearch,

        /* Actions */
        setSelectedModule,
        setModuleSearch,
        setPermissionSearch,
        setPermission,
        save,
        toggleModule
    };
};
