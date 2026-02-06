"use client";
// src/app/(protected)/roles/page.tsx

import React from "react";
import {
    Container,
    Typography,
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Alert,
    Skeleton,
    Stack,
    Chip,
    Tooltip,
} from "@mui/material";
import {
    Refresh,
    Visibility,
    Security,
} from "@mui/icons-material";
import Link from "next/link";

import { useRolesViewModel } from "@/lib/features/roles/useRolesViewModel";
import { ApiError, Role } from "@/lib/features/roles/roleTypes";

export default function RolesPage() {
    const {
        roles,
        isLoading,
        error,
        refetch,
    } = useRolesViewModel();

    function renderErrorContent(error: ApiError | null) {
        if (!error) return null;

        if (error.error) return <div>{error.error}</div>;

        if (error.errors) {
            return Object.entries(error.errors).map(([k, v], i) => (
                <div key={i}>{k}: {v.join(", ")}</div>
            ));
        }

        return null;
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                }}
            >
                <Typography variant="h4">Roles</Typography>

                <IconButton onClick={refetch} color="primary">
                    <Refresh />
                </IconButton>
            </Box>

            {/* Error */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {renderErrorContent(error)}
                </Alert>
            )}

            {/* Table */}
            <Paper elevation={2}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Role</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {isLoading ? (
                                Array.from(new Array(5)).map((_, i) => (
                                    <TableRow key={i}>
                                        {Array.from(new Array(3)).map((__, j) => (
                                            <TableCell key={j}>
                                                <Skeleton variant="text" />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : roles.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                                        <Typography color="text.secondary">
                                            No roles found
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                roles.map((role: Role) => (
                                    <TableRow key={role.roleId} hover>
                                        <TableCell>
                                            <Typography fontWeight="medium">
                                                {role.roleName}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                label={role.isActive ? "Active" : "Inactive"}
                                                size="small"
                                                color={role.isActive ? "success" : "default"}
                                            />
                                        </TableCell>

                                        <TableCell align="right">
                                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                {/* View Role */}
                                                <Tooltip title="View role details">
                                                    <Link href={`/roles/${role.roleId}`} passHref>
                                                        <IconButton size="small" color="primary">
                                                            <Visibility />
                                                        </IconButton>
                                                    </Link>
                                                </Tooltip>

                                                {/* Manage Permissions (EXTENSION POINT) */}
                                                <Tooltip title="Manage permissions">
                                                    <Link href={`/roles/${role.roleId}/permissions`} passHref>
                                                        <IconButton size="small" color="secondary">
                                                            <Security />
                                                        </IconButton>
                                                    </Link>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Container>
    );
}
