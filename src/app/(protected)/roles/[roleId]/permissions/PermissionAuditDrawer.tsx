"use client";

import {
    Drawer,
    Box,
    Typography,
    Divider,
    Stack,
    Chip,
    IconButton,
    CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import HistoryIcon from "@mui/icons-material/History";
import { PermissionAudit } from "@/lib/features/role-permissions/auditTypes";

interface Props {
    open: boolean;
    onClose: () => void;
    loading: boolean;
    audits: PermissionAudit[];
    permissionKey?: string;
}

export default function PermissionAuditDrawer({
    open,
    onClose,
    loading,
    audits,
    permissionKey,
}: Props) {
    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box sx={{ width: 420, p: 2 }}>
                {/* Header */}
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Stack direction="row" spacing={1} alignItems="center">
                        <HistoryIcon />
                        <Typography variant="h6">
                            Permission Audit
                        </Typography>
                    </Stack>

                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Stack>

                {permissionKey && (
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        {permissionKey}
                    </Typography>
                )}

                <Divider sx={{ my: 2 }} />

                {/* Content */}
                {loading ? (
                    <CircularProgress size={24} />
                ) : audits.length === 0 ? (
                    <Typography color="text.secondary">
                            Audit history is not available yet.
                    </Typography>
                ) : (
                    <Stack spacing={2}>
                        {audits.map(a => (
                            <Box
                                key={a.auditId}
                                sx={{
                                    p: 1.5,
                                    borderRadius: 1,
                                    backgroundColor: "#fafafa",
                                    border: "1px solid #eee",
                                }}
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <Chip
                                        size="small"
                                        label={a.scope}
                                        color={a.scope === "USER" ? "warning" : "default"}
                                    />
                                    <Typography variant="caption">
                                        {new Date(a.changedAt).toLocaleString()}
                                    </Typography>
                                </Stack>

                                <Typography sx={{ mt: 1 }}>
                                    <strong>{a.changedBy}</strong>{" "}
                                    {a.newValue ? "enabled" : "disabled"} this permission
                                </Typography>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    From{" "}
                                    <strong>{a.oldValue ? "Enabled" : "Disabled"}</strong>{" "}
                                    →{" "}
                                    <strong>{a.newValue ? "Enabled" : "Disabled"}</strong>
                                </Typography>

                                {a.scopeName && (
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        Scope: {a.scopeName}
                                    </Typography>
                                )}
                            </Box>
                        ))}
                    </Stack>
                )}
            </Box>
        </Drawer>
    );
}
