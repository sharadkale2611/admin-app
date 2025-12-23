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

import { useNoticeViewModel } from "@/lib/features/notice/useNoticesViewModel";
import { useDeleteNotice } from "@/lib/features/notice/useDeleteNotice";

import { ApiError, Notice } from "@/lib/features/notice/noticeTypes";

export default function NoticesPage() {
  const {
    notices,
    isLoading,
    error,
    remove,
    refetch,
  } = useNoticeViewModel();
  
  const { handleDelete } = useDeleteNotice();


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
function renderErrorContent(error: ApiError | null) {
  if (!error) return null;

  // Single error message
  if (error.error) {
    return <div>{error.error}</div>;
  }

  // Multiple errors
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
        <Typography variant="h4">Notices</Typography>

        <Stack direction="row" spacing={1}>
          <IconButton onClick={refetch} color="primary">
            <Refresh />
          </IconButton>

          <Link href="/notices/create" passHref>
            <Button variant="contained" startIcon={<Add />}>
              Add Notice
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
                <TableCell>Title</TableCell>
                <TableCell>For</TableCell>
                <TableCell>Student</TableCell>
                <TableCell>Batch</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell>Updated By</TableCell>

                <TableCell>Created On</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading ? (
                Array.from(new Array(5)).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from(new Array(7)).map((__, j) => (
                      <TableCell key={j}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : notices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No notices found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                notices.map((notice) => (
                  <TableRow key={notice.noticeId} hover>
                    <TableCell>
                      <Typography fontWeight="medium">
                        {notice.title}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={notice.createdFor}
                        size="small"
                        color={
                          notice.createdFor === "BATCH"
                            ? "primary"
                            : "secondary"
                        }
                      />
                    </TableCell>

                    <TableCell>
                      {notice.studentName || "-"}
                    </TableCell>

                    <TableCell>
                      {notice.batchName || "-"}
                    </TableCell>

                    <TableCell>
                      {notice.createdBy || "-"}
                    </TableCell>

                    <TableCell>
                      {notice.updatedBy || "-"}
                    </TableCell>
                    
                    <TableCell>
                      {formatDate(notice.createdAt)}
                    </TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Link
                          href={`/notices/${notice.noticeId}`}
                          passHref
                        >
                          <IconButton size="small" color="primary">
                            <Visibility />
                          </IconButton>
                        </Link>

                        <Link
                          href={`/notices/${notice.noticeId}/edit`}
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
                                        const success = await handleDelete(notice.noticeId, notice.title);
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
