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
import { useSearchParams } from "next/navigation";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";

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
  const [attachments, setAttachments] = useState<BatchStudyWorkAttachment[]>([]);

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
          throw new Error(res.error || res.message || "Failed to fetch details");
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
      // description: only if you add it to upload API
      // formData.append("description", description);

      const res = await api.post<BatchStudyWorkAttachment>(
        API_ENDPOINTS.BATCH_STUDY_WORK_ATTACHMENTS.UPLOAD,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data", // override default JSON
          },
        }
      );

      if (!res.success) {
        throw new Error(res.error || res.message || "Upload failed");
      }

      setFile(null);
      setDescription("");
      await fetchAttachments();
      alert("File uploaded successfully");
    } catch (err: any) {
      setError(err.message || "Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  // ---------- Delete attachment ----------
  const handleDelete = async (attachmentId: number) => {
    if (!confirm("Are you sure you want to delete this attachment?")) return;

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
    } catch (err: any) {
      setError(err.message || "Error deleting attachment");
    }
  };

  if (!id) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">
          Invalid request. BatchStudyWork ID is missing.
        </Typography>
      </Box>
    );
  }

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
            {attachments.map((att) => (
              <Stack
                key={att.batchStudyWorkAttachementId}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Stack spacing={0.5}>
                  <MuiLink
                    href={`${API_ENDPOINTS.BASE_URL_FILES}${att.filePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                  >
                    {att.filePath.split("/").pop()}
                  </MuiLink>
                  <Typography variant="caption">
                    Uploaded: {new Date(att.createdAt).toLocaleString()}
                  </Typography>
                </Stack>

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
            ))}
          </Stack>
        )}
      </Paper>
    </Box>
  );
};

export default BatchStudyWorkAttachmentsPage;
