"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  TextField,
  Chip,
  CircularProgress,
  IconButton,
  Link as MuiLink,
} from "@mui/material";
import Swal from "sweetalert2";
import DownloadIcon from "@mui/icons-material/Download";
import { useSearchParams } from "next/navigation";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link"; // important for navigation

import API_ENDPOINTS from "@/lib/config/apiConfig";
import api from "@/lib/services/apiService";

// Match YOUR API shape
interface BatchStudyWork {
  batchStudyWorkId: number;
  workType: string;
  assignedBy: number;
  assignedByName: string;
  batchId: number;
  batchCode: string;
  workTitle: string;
  workDescription: string;
  expectedCompletionDate: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string | null;
}

interface BatchStudyWorkAttachment {
  batchStudyWorkAttachementId: number;
  batchStudyWorkId: number;
  workTitle: string;
  workType: string;
  filePath: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string | null;
}

const BatchStudyWorkAttachmentsPage: React.FC = () => {
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");
  const id = idParam ? Number(idParam) : null;

  const [work, setWork] = useState<BatchStudyWork | null>(null);
  const [attachments, setAttachments] = useState<BatchStudyWorkAttachment[]>(
    []
  );

  const [loadingWork, setLoadingWork] = useState(false);
  const [loadingAttachments, setLoadingAttachments] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState(""); // reserved if you later add description to DTO

  // ---------- Load BatchStudyWork details ----------
  useEffect(() => {
    if (!id) return;

    const loadWork = async () => {
      try {
        setLoadingWork(true);
        setError(null);

        const res = await api.get<BatchStudyWork>(
          `${API_ENDPOINTS.BATCH_STUDY_WORKS.GET_BY_ID}/${id}`,
          { withCredentials: true }
        );

        if (!res.data) {
          throw new Error(
            res.error || res.message || "Failed to fetch details"
          );
        }

        setWork(res.data);
      } catch (err: any) {
        setError(err.message || "Error fetching Batch Study Work details");
      } finally {
        setLoadingWork(false);
      }
    };

    loadWork();
  }, [id]);

  const forceDownload = async (url: string, fileName: string) => {
    try {
      const response = await fetch(url, {
        credentials: "include",
      });

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      // cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download file.");
    }
  };

  // ---------- Load attachments for this work ----------
  const fetchAttachments = async () => {
    if (!id) return;
    try {
      setLoadingAttachments(true);
      setError(null);

      const res = await api.get<BatchStudyWorkAttachment[]>(
        `${API_ENDPOINTS.BATCH_STUDY_WORK_ATTACHMENTS.GET_BY_BATCH}/${id}`,
        { withCredentials: true }
      );

      setAttachments(res.data || []);
    } catch (err: any) {
      setError(err.message || "Error fetching attachments");
    } finally {
      setLoadingAttachments(false);
    }
  };

  useEffect(() => {
    fetchAttachments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ---------- File select ----------
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
  };

  // ---------- Upload ----------
  const handleUpload = async () => {
    if (!id || !file) return;

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append("batchStudyWorkId", String(id));
      formData.append("file", file);

      const res = await api.post<BatchStudyWorkAttachment>(
        API_ENDPOINTS.BATCH_STUDY_WORK_ATTACHMENTS.UPLOAD,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (!res.success) {
        throw new Error(res.error || res.message || "Upload failed");
      }

      setFile(null);
      setDescription("");
      await fetchAttachments();

      Swal.fire({
        icon: "success",
        title: "Uploaded!",
        text: "Your file has been uploaded successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: err.message || "Error uploading file",
      });
    } finally {
      setUploading(false);
    }
  };

  // ---------- Delete attachment ----------
  const handleDelete = async (attachmentId: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This file will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      setError(null);

      const res = await api.delete<null>(
        `${API_ENDPOINTS.BATCH_STUDY_WORK_ATTACHMENTS.DELETE}/${attachmentId}`,
        { withCredentials: true }
      );

      if (!res.success) {
        throw new Error(res.error || res.message || "Delete failed");
      }

      await fetchAttachments();

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "The file has been removed.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: err.message || "Error deleting attachment",
      });
    }
  };

  // ---------- UI ----------
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Batch Study Work Attachments
      </Typography>

      {/* DETAILS */}
      <Paper sx={{ p: 2, mb: 3 }}>
        {loadingWork ? (
          <Stack direction="row" spacing={2} alignItems="center">
            <CircularProgress size={20} />
            <Typography>Loading Batch Study Work details...</Typography>
          </Stack>
        ) : work ? (
          <Stack spacing={1}>
            <Typography variant="h6">{work.workTitle}</Typography>
            <Typography variant="body2" color="text.secondary">
              {work.workDescription}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip
                label={work.workType}
                size="small"
                color={work.workType === "homework" ? "warning" : "primary"}
              />
              <Chip
                label={work.isActive ? "Active" : "Inactive"}
                size="small"
                color={work.isActive ? "success" : "error"}
              />
              <Chip
                label={work.batchCode || "No Batch"}
                size="small"
                variant="outlined"
              />
            </Stack>
          </Stack>
        ) : (
          <Typography>No details found.</Typography>
        )}
      </Paper>

      {/* UPLOAD SECTION */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Upload Documents
        </Typography>

        <Stack spacing={2}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadFileIcon />}
          >
            {file ? file.name : "Choose file (docx, pdf, image, txt)"}
            <input
              hidden
              type="file"
              accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf,image/*,.txt"
              onChange={handleFileChange}
            />
          </Button>

          <TextField
            label="Description (optional, for future use)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            size="small"
            multiline
            minRows={2}
          />

          <Button
            variant="contained"
            disabled={!file || uploading}
            onClick={handleUpload}
            startIcon={
              uploading ? <CircularProgress size={18} /> : <UploadFileIcon />
            }
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>

          {/* BACK BUTTON (New) */}
          <Button
            variant="outlined"
            color="primary"
            component={Link}
            href="/BatchStudyWorks"
          >
            BACK
          </Button>

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
        </Stack>
      </Paper>

      {/* ATTACHMENTS LIST */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Existing Attachments
        </Typography>

        {loadingAttachments ? (
          <Stack direction="row" spacing={2} alignItems="center">
            <CircularProgress size={20} />
            <Typography>Loading attachments...</Typography>
          </Stack>
        ) : attachments.length === 0 ? (
          <Typography>No attachments found.</Typography>
        ) : (
          <Stack spacing={1}>
            {attachments.map((att) => {
              const fileUrl = `${API_ENDPOINTS.BASE_URL}${att.filePath}`;
              const fileName = att.filePath.split("/").pop() || "download";

              return (
                <Stack
                  key={att.batchStudyWorkAttachementId}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Stack spacing={0.5}>
                    <MuiLink
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                    >
                      {fileName}
                    </MuiLink>

                    <Typography variant="caption">
                      Uploaded: {new Date(att.createdAt).toLocaleString()}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1}>
                    {/* Download Button */}
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => forceDownload(fileUrl, fileName)}
                    >
                      <DownloadIcon fontSize="small" />
                    </IconButton>

                    {/* Delete Button */}
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() =>
                        handleDelete(att.batchStudyWorkAttachementId)
                      }
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Stack>
              );
            })}
          </Stack>
        )}
      </Paper>
    </Box>
  );
};

export default BatchStudyWorkAttachmentsPage;




