// permissions/page.tsx
"use client";

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
  Button,
  IconButton,
  Alert,
  Skeleton,
  Stack,
  Chip,
} from "@mui/material";
import {
  Add,
  Refresh,
  Visibility,
  Edit,
  Delete,
} from "@mui/icons-material";
import Link from "next/link";

import { usePermissionsViewModel } from "@/lib/features/permission/usePermissionsViewModel";
import { useDeletePermission } from "@/lib/features/permission/useDeletePermissionViewModel";

import { ApiError, Permission } from "@/lib/features/permission/permissionTypes";

export default function PermissionsPage() {
  const {
    permissions,
    isLoading,
    error,
    refetch,
  } = usePermissionsViewModel();

  const { handleDelete } = useDeletePermission();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  function renderErrorContent(error: ApiError | null) {
    if (!error) return null;

    if (error.error) {
      return <div>{error.error}</div>;
    }

    if (Array.isArray(error.errors)) {
      return error.errors.map((e, i) => (
        <div key={i}>
          {typeof e === "string" ? e : JSON.stringify(e)}
        </div>
      ));
    }

    return null;
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Permissions</Typography>

        <Stack direction="row" spacing={1}>
          <IconButton onClick={refetch} color="primary">
            <Refresh />
          </IconButton>

          <Link href="/permissions/create" passHref>
            <Button variant="contained" startIcon={<Add />}>
              Add Permission
            </Button>
          </Link>
        </Stack>
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
                <TableCell>Permission Key</TableCell>
                <TableCell>Module</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created On</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading ? (
                Array.from(new Array(5)).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from(new Array(6)).map((__, j) => (
                      <TableCell key={j}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : permissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No permissions found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                permissions.map((permission: Permission) => (
                  <TableRow key={permission.permissionId} hover>
                    <TableCell>
                      <Typography fontWeight="medium">
                        {permission.permissionKey}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={permission.module}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell>
                      {permission.description || "-"}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={permission.isActive ? "Active" : "Inactive"}
                        size="small"
                        color={permission.isActive ? "success" : "default"}
                      />
                    </TableCell>

                    <TableCell>
                      {formatDate(permission.createdAt)}
                    </TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Link
                          href={`/permissions/${permission.permissionId}`}
                          passHref
                        >
                          <IconButton size="small" color="primary">
                            <Visibility />
                          </IconButton>
                        </Link>

                        <Link
                          href={`/permissions/${permission.permissionId}/edit`}
                          passHref
                        >
                          <IconButton size="small" color="secondary">
                            <Edit />
                          </IconButton>
                        </Link>

                        <IconButton
                          size="small"
                          color="error"
                          onClick={async () => {
                            const success = await handleDelete(
                              permission.permissionId,
                              permission.permissionKey
                            );
                            if (success) refetch();
                          }}
                        >
                          <Delete />
                        </IconButton>
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
