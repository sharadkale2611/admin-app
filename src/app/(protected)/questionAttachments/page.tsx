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
  Avatar,
} from "@mui/material";
import {
  Add,
  Refresh,
  Visibility,
  Edit,
  Delete,
  Image as ImageIcon,
  PictureAsPdf,
} from "@mui/icons-material";
import Link from "next/link";

import { useQuestionAttachmentViewModel } from "@/lib/features/questionAttachment/useQuestionAttachmentViewModel";
import { useDeleteQuestionAttachmentViewModel } from "@/lib/features/questionAttachment/useDeleteQuestionAttachmentViewModel";

import {
  ApiError,
  QuestionAttachment,
} from "@/lib/features/questionAttachment/questionAttachmentTypes";

export default function QuestionAttachmentsPage() {
  const { attachments, isLoading, error, refetch } =
    useQuestionAttachmentViewModel();

  const { handleDelete } = useDeleteQuestionAttachmentViewModel();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getFileName = (path: string) => {
    return path?.split("/").pop() || "Attachment";
  };

  const isImage = (path: string) => {
    return /\.(jpg|jpeg|png|webp)$/i.test(path);
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
        <Typography variant="h4">Question Attachments</Typography>

        <Stack direction="row" spacing={1}>
          <IconButton onClick={refetch} color="primary">
            <Refresh />
          </IconButton>

          <Link href="/questionAttachments/create" passHref>
            <Button variant="contained" startIcon={<Add />}>
              Add Attachment
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
                <TableCell>ID</TableCell>
                <TableCell>Question</TableCell>
                <TableCell>Preview</TableCell>
                <TableCell>File Name</TableCell>
                <TableCell>Status</TableCell>
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
              ) : attachments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No attachments found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                attachments.map((attachment: QuestionAttachment) => (
                  <TableRow
                    key={attachment.questionAttachmentId}
                    hover
                  >
                    <TableCell>
                      <Typography fontWeight="medium">
                        #{attachment.questionAttachmentId}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      {attachment.questionTitle ||
                        `#${attachment.questionId}`}
                    </TableCell>

                    <TableCell>
                      {attachment.uploadMediaPath ? (
                        isImage(attachment.uploadMediaPath) ? (
                          <Avatar
                            src={attachment.uploadMediaPath}
                            variant="rounded"
                            sx={{ width: 40, height: 40 }}
                          />
                        ) : (
                          <PictureAsPdf color="error" />
                        )
                      ) : (
                        <ImageIcon color="disabled" />
                      )}
                    </TableCell>

                    <TableCell>
                      {getFileName(attachment.uploadMediaPath)}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={
                          attachment.isActive
                            ? "Active"
                            : "Inactive"
                        }
                        size="small"
                        color={
                          attachment.isActive
                            ? "success"
                            : "default"
                        }
                      />
                    </TableCell>

                    <TableCell>
                      {formatDate(attachment.createdAt)}
                    </TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Link
                          href={`/questionAttachments/${attachment.questionAttachmentId}`}
                          passHref
                        >
                          <IconButton size="small" color="primary">
                            <Visibility />
                          </IconButton>
                        </Link>

                        <Link
                          href={`/questionAttachments/${attachment.questionAttachmentId}/edit`}
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
                              attachment.questionAttachmentId,
                              getFileName(
                                attachment.uploadMediaPath
                              )
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
