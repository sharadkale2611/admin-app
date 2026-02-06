"use client";

import { useParams } from "next/navigation";
import {
    Box,
    Container,
    Typography,
    Paper,
    List,
    ListItemButton,
    ListItemText,
    Divider,
    Switch,
    Stack,
    Button,
    TextField,
    Chip,
    Tooltip,
    IconButton,
} from "@mui/material";

import { useRolePermissionsViewModel } from
    "@/lib/features/role-permissions/useRolePermissionsViewModel";
import { useState } from "react";
import PermissionAuditDrawer from "./PermissionAuditDrawer";
import { History } from "@mui/icons-material";

/* ===============================
   Helpers
================================ */

const humanize = (key: string) =>
    key
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, c => c.toUpperCase());

export default function RolePermissionsPage() {
    const { roleId } = useParams<{ roleId: string }>();
    const [auditOpen, setAuditOpen] = useState(false);
    const [selectedPermission, setSelectedPermission] = useState<string>();
    const AUDIT_ENABLED = false;
    const {
        groupedPermissions,
        filteredModules,
        selectedModule,
        setSelectedModule,
        visiblePermissions,

        moduleSearch,
        setModuleSearch,
        permissionSearch,
        setPermissionSearch,

        setPermission,
        save,
        saving,
        isDirty,
    } = useRolePermissionsViewModel(Number(roleId));

    /* ===============================
       Count Helpers
    ================================ */

    const getCounts = (module: string) => {
        const perms = groupedPermissions[module] || [];
        const active = perms.filter(p => p.isAllowed).length;
        return { active, total: perms.length };
    };

    const selectedCounts = selectedModule
        ? getCounts(selectedModule)
        : null;

    /* ===============================
       Bulk Actions (Module Scoped)
    ================================ */

    const enableAllInModule = () => {
        if (!selectedModule) return;
        groupedPermissions[selectedModule]?.forEach(p =>
            setPermission(p.permissionId, true)
        );
    };

    const disableAllInModule = () => {
        if (!selectedModule) return;
        groupedPermissions[selectedModule]?.forEach(p =>
            setPermission(p.permissionId, false)
        );
    };


    const getOverrideChip = (p: any) => {
        if (!p.isUserOverride) return null;

        return p.userAllowed ? (
            <Chip
                size="small"
                color="warning"
                label="User Allow"
                sx={{ ml: 1 }}
            />
        ) : (
            <Chip
                size="small"
                color="error"
                label="User Deny"
                sx={{ ml: 1 }}
            />
        );
    };


    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            {/* ===============================
          Page Title
      ================================ */}
            <Typography variant="h4" gutterBottom>
                Role Permissions
            </Typography>

            {/* ===============================
          Dirty Save Bar
      ================================ */}
            {isDirty && (
                <Paper
                    sx={{
                        p: 2,
                        mb: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "#fff8e1",
                        border: "1px solid #ffe082",
                    }}
                >
                    <Typography color="warning.main" fontWeight={500}>
                        You have unsaved permission changes
                    </Typography>

                    <Button
                        variant="contained"
                        onClick={save}
                        disabled={saving}
                    >
                        {saving ? "Saving…" : "Save Changes"}
                    </Button>
                </Paper>
            )}

            {/* ===============================
          Main Layout
      ================================ */}
            <Paper sx={{ display: "flex", minHeight: 520 }}>
                {/* ===============================
            LEFT: MODULE LIST
        ================================ */}
                <Box sx={{ width: 280, borderRight: "1px solid #eee" }}>
                    {/* Module Search */}
                    <Box sx={{ p: 1 }}>
                        <TextField
                            size="small"
                            fullWidth
                            placeholder="Search modules…"
                            value={moduleSearch}
                            onChange={(e) => setModuleSearch(e.target.value)}
                        />
                    </Box>

                    <List>
                        {filteredModules.map(module => {
                            const { active, total } = getCounts(module);

                            return (
                                <ListItemButton
                                    key={module}
                                    selected={selectedModule === module}
                                    onClick={() => setSelectedModule(module)}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        "&.Mui-selected": {
                                            backgroundColor: "primary.light",
                                            color: "primary.contrastText",
                                            "& .MuiChip-root": {
                                                borderColor: "primary.contrastText",
                                                color: "primary.contrastText",
                                            },
                                        },
                                    }}
                                >
                                    {/* Count Chip (LEFT) */}
                                    <Chip
                                        size="small"
                                        variant="outlined"
                                        label={`${active}/${total}`}
                                    />

                                    {/* Module Name */}
                                    <ListItemText
                                        primary={module}
                                        primaryTypographyProps={{
                                            fontWeight:
                                                selectedModule === module ? 600 : 500,
                                        }}
                                    />
                                </ListItemButton>
                            );
                        })}
                    </List>
                </Box>

                {/* ===============================
            RIGHT: PERMISSIONS
        ================================ */}
                <Box sx={{ flex: 1, p: 3 }}>
                    {!selectedModule ? (
                        <Typography color="text.secondary">
                            Select a module from the left to manage its permissions.
                        </Typography>
                    ) : (
                        <>
                            {/* Header */}
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                                sx={{ mb: 2 }}
                            >
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography variant="h6">
                                        {selectedModule}
                                    </Typography>

                                    <Chip
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                        label={`${selectedCounts?.active}/${selectedCounts?.total} enabled`}
                                    />
                                </Stack>
                                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                                        <Chip size="small" color="warning" label="User Allow" />
                                        <Chip size="small" color="error" label="User Deny" />
                                    </Stack>

                                {/* Bulk Actions */}
                                <Stack direction="row" spacing={1}>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={enableAllInModule}
                                    >
                                        Enable all
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="error"
                                        onClick={disableAllInModule}
                                    >
                                        Disable all
                                    </Button>
                                </Stack>
                            </Stack>

                            {/* Permission Search */}
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Search permissions…"
                                value={permissionSearch}
                                onChange={(e) =>
                                    setPermissionSearch(e.target.value)
                                }
                                sx={{ mb: 2 }}
                            />

                            <Divider sx={{ mb: 2 }} />

                            {/* Permission List */}
                            {visiblePermissions.length === 0 ? (
                                <Typography color="text.secondary">
                                    No permissions match your search.
                                </Typography>
                            ) : (
                                visiblePermissions.map(p => (

                                    <Stack
                                        key={p.permissionId}
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{
                                            py: 1.2,
                                            px: 1,
                                            borderRadius: 1,
                                            "&:hover": { backgroundColor: "#f9f9f9" },
                                        }}
                                    >
                                        {/* LEFT: Permission info */}
                                        <Box>
                                            <Stack direction="row" alignItems="center">
                                                <Typography fontWeight={500}>
                                                    {humanize(p.permissionKey)}
                                                </Typography>

                                                {getOverrideChip(p)}
                                            </Stack>

                                            <Typography variant="caption" color="text.secondary">
                                                {p.permissionKey}
                                            </Typography>
                                        </Box>

                                        {/* RIGHT: Actions */}
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            {/* Switch with Tooltip */}
                                            <Tooltip
                                                title={
                                                    p.isUserOverride
                                                        ? "This permission is overridden at user level"
                                                        : ""
                                                }
                                            >
                                                <span>
                                                    <Switch
                                                        checked={p.isAllowed}
                                                        disabled={p.isUserOverride === true}
                                                        onChange={(e) =>
                                                            setPermission(p.permissionId, e.target.checked)
                                                        }
                                                    />
                                                </span>
                                            </Tooltip>

                                            {/* Audit Button (separate action) */}
                                            <Tooltip title={AUDIT_ENABLED ? "View audit history" : "Audit not enabled"}>
                                                <span>
                                                    <IconButton
                                                        size="small"
                                                        disabled={!AUDIT_ENABLED}
                                                        onClick={() => {
                                                            setSelectedPermission(p.permissionKey);
                                                            setAuditOpen(true);
                                                        }}
                                                    >
                                                        <History fontSize="small" />
                                                    </IconButton>
                                                </span>
                                            </Tooltip>

                                        </Stack>
                                    </Stack>
                                    
                                ))
                            )}
                        </>
                    )}
                </Box>
                <PermissionAuditDrawer
                    open={auditOpen}
                    onClose={() => setAuditOpen(false)}
                    loading={false}
                    audits={[]}        // wire API later
                    permissionKey={selectedPermission}
                />

            </Paper>
        </Container>
    );
}
