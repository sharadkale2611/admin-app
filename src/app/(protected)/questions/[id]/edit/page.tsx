"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Grid,
  Alert,
  Snackbar,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Stack,
  Checkbox,
  IconButton,
  Chip,
} from "@mui/material";
import { Save, Cancel, Add, Delete } from "@mui/icons-material";
import Link from "next/link";
import { useParams } from "next/navigation";

import useEditQuestionViewModel from "@/lib/features/question/useEditQuestionViewModel";
import { useQuestionTypeViewModel } from "@/lib/features/questionType/useQuestionTypeViewModel";
import { ApiError } from "@/lib/features/question/questionTypes";
import API_ENDPOINTS from "@/lib/config/apiConfig";

/* ===============================
   Field Labels
================================ */

const fieldLabels: Record<string, string> = {
  questionTypeId: "Question Type",
  courseId: "Course",
  moduleId: "Module",
  title: "Title",
  description: "Description",
  marks: "Marks",
  difficultyLevel: "Difficulty Level",
  negativeMarks: "Negative Marks",
  isActive: "Status",
};

/* ===============================
   Error Renderer
================================ */

function renderErrorContent(error: ApiError | null) {
  if (!error) return null;

  return (
    <div className="text-red-600">
      {error.error && <h4 className="font-semibold mb-2">{error.error}</h4>}

      {error.errors && (
        <ul className="list-disc list-inside space-y-1">
          {Object.entries(error.errors).map(([field, messages]) =>
            messages.map((msg, i) => (
              <li key={`${field}-${i}`}>
                <strong>{fieldLabels[field] || field}:</strong> {msg}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

/* ===============================
   Rules (same as create)
================================ */

type QuestionTypeRuleDto = {
  ruleId: number;
  questionTypeId: number;
  maxOptions: number | null;
  minOptions: number | null;
  maxSelections: number | null;
  maxTextLength: number | null;
  isRegexAnswerAllowed: boolean;
};

const DEFAULT_MIN_OPTIONS = 2;
const DEFAULT_MAX_OPTIONS = 6;

function getApiBaseUrlApi(): string {
  const baseApi = API_ENDPOINTS.BASE_URL_API?.trim();
  if (baseApi) return baseApi;

  const base = API_ENDPOINTS.BASE_URL?.trim() || "";
  if (!base) return "https://localhost:7033/api";
  return base.endsWith("/api") ? base : `${base}/api`;
}

type OptionApiDto = {
  optionId: number;
  questionId: number;
  optionText: string;
  optionMediaPath: string | null;
  isCorrect: boolean;
  optionOrder: number;
  isActive?: boolean;
};

type AttachmentApiDto = {
  questionAttachmentId: number;
  questionId: number;
  uploadMediaPath: string | null;
  isActive: boolean;
};

type LocalOption = {
  optionId?: number;
  optionText: string;
  optionOrder: string;
  isCorrect: boolean;
  isActive: boolean;

  // NEW upload
  optionMediaFile?: File | null;
  optionMediaPreviewUrl?: string;

  // Existing url (from API)
  optionMediaPath?: string | null;
};

export default function EditQuestionPage() {
  const params = useParams<{ id: string }>();
  const questionId = Number(params?.id);

  const {
    formData,
    courses,
    modules,
    loading,
    isSubmitting,
    error,
    handleChange,
    handleBooleanChange,
    handleSubmit,
  } = useEditQuestionViewModel();

  const { questionTypes } = useQuestionTypeViewModel();

  const selectedQuestionType = useMemo(() => {
    const id = Number(formData.questionTypeId || 0);
    if (!id) return undefined;
    return questionTypes.find((qt) => qt.questionTypeId === id);
  }, [formData.questionTypeId, questionTypes]);

  /* Snackbar */
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const baseApi = useMemo(() => getApiBaseUrlApi(), []);

  /* ===============================
     Rules fetch
  ============================== */

  const [rulesByTypeId, setRulesByTypeId] = useState<Record<number, QuestionTypeRuleDto>>({});
  const [rulesError, setRulesError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setRulesError(null);
        const url = `${baseApi}${API_ENDPOINTS.QUESTION_TYPE_RULES.GET_LIST}`;
        const res = await fetch(url, { credentials: "include" });
        if (!res.ok) throw new Error(`Failed to load rules (${res.status})`);
        const json = await res.json();
        const data: QuestionTypeRuleDto[] = json?.data ?? [];

        const map: Record<number, QuestionTypeRuleDto> = {};
        for (const r of data) map[r.questionTypeId] = r;

        if (mounted) setRulesByTypeId(map);
      } catch (e: any) {
        if (mounted) setRulesError(e?.message ?? "Failed to load rules");
      }
    })();

    return () => {
      mounted = false;
    };
  }, [baseApi]);

  const activeRule = useMemo(() => {
    const id = Number(formData.questionTypeId || 0);
    return id ? rulesByTypeId[id] ?? null : null;
  }, [rulesByTypeId, formData.questionTypeId]);

  const ruleMinOptions = useMemo(() => {
    if (!selectedQuestionType?.supportsOptions) return 0;
    const v = activeRule?.minOptions;
    return typeof v === "number" && v > 0 ? v : DEFAULT_MIN_OPTIONS;
  }, [activeRule, selectedQuestionType?.supportsOptions]);

  const ruleMaxOptions = useMemo(() => {
    if (!selectedQuestionType?.supportsOptions) return 0;
    const v = activeRule?.maxOptions;
    return typeof v === "number" && v > 0 ? v : DEFAULT_MAX_OPTIONS;
  }, [activeRule, selectedQuestionType?.supportsOptions]);

  const ruleMaxSelections = useMemo(() => {
    if (!selectedQuestionType?.supportsOptions) return null;
    const v = activeRule?.maxSelections;
    return typeof v === "number" && v > 0 ? v : null;
  }, [activeRule, selectedQuestionType?.supportsOptions]);

  /* ===============================
     Attachment (edit)
  ============================== */

  const isAttachmentRequired = useMemo(() => Boolean(selectedQuestionType?.supportsAttachments), [
    selectedQuestionType?.supportsAttachments,
  ]);

  const [existingAttachment, setExistingAttachment] = useState<AttachmentApiDto | null>(null);
  const [attachmentLoadError, setAttachmentLoadError] = useState<string | null>(null);

  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);
  const [attachmentPreviewUrl, setAttachmentPreviewUrl] = useState<string | undefined>(undefined);

  const revokeUrl = (url?: string) => {
    if (!url) return;
    try {
      URL.revokeObjectURL(url);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    return () => revokeUrl(attachmentPreviewUrl);
  }, [attachmentPreviewUrl]);

  const setAttachmentWithPreview = (file: File | null) => {
    revokeUrl(attachmentPreviewUrl);
    setAttachmentPreviewUrl(undefined);

    setAttachmentFile(file);
    setAttachmentError(null);

    if (file && file.type.startsWith("image/")) {
      setAttachmentPreviewUrl(URL.createObjectURL(file));
    }
  };

  const isUrlImage = (url?: string | null) => {
    if (!url) return false;
    return /\.(png|jpg|jpeg|webp)(\?.*)?$/i.test(url);
  };

  // Best-effort load existing attachment (needs your backend GET route)
  useEffect(() => {
    if (!questionId || Number.isNaN(questionId)) return;

    let mounted = true;

    (async () => {
      try {
        setAttachmentLoadError(null);

        // Try a common route: /QuestionAttachments/by-question/{questionId}
        const tryUrl = `${baseApi}/QuestionAttachments/by-question/${questionId}`;
        const res = await fetch(tryUrl, { credentials: "include" });

        if (!res.ok) {
          // Not fatal: your API might not have this route
          if (mounted) setExistingAttachment(null);
          return;
        }

        const json = await res.json();
        const list: AttachmentApiDto[] = json?.data ?? [];

        // Use first active; else first
        const chosen = list.find((a) => a.isActive) ?? list[0] ?? null;

        if (mounted) setExistingAttachment(chosen);
      } catch (e: any) {
        if (mounted) setAttachmentLoadError(e?.message ?? "Failed to load attachment");
      }
    })();

    return () => {
      mounted = false;
    };
  }, [baseApi, questionId]);

  /* ===============================
     Options (edit)
  ============================== */

  const [options, setOptions] = useState<LocalOption[]>([]);
  const [baseOptions, setBaseOptions] = useState<LocalOption[]>([]);
  const [optionsError, setOptionsError] = useState<string | null>(null);
  const [optionsLoadError, setOptionsLoadError] = useState<string | null>(null);

  const correctSelectedCount = useMemo(() => options.filter((o) => o.isCorrect).length, [options]);

  const normalizeOptionOrder = (opts: LocalOption[]) => opts.map((o, i) => ({ ...o, optionOrder: String(i + 1) }));

  useEffect(() => {
    return () => {
      options.forEach((o) => revokeUrl(o.optionMediaPreviewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateOptionImage = (file: File): string | null => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) return "Invalid option image format (JPG/PNG/WEBP only).";
    if (file.size > 2 * 1024 * 1024) return "Option image size must be under 2MB.";
    return null;
  };

  const handleOptionMediaChange = (index: number, file: File | null) => {
    setOptionsError(null);

    setOptions((prev) => {
      const row = prev[index];
      if (!row) return prev;

      if (!file) {
        revokeUrl(row.optionMediaPreviewUrl);
        return prev.map((o, i) =>
          i === index ? { ...o, optionMediaFile: null, optionMediaPreviewUrl: undefined } : o
        );
      }

      const msg = validateOptionImage(file);
      if (msg) {
        setOptionsError(msg);
        return prev;
      }

      revokeUrl(row.optionMediaPreviewUrl);
      const preview = URL.createObjectURL(file);

      return prev.map((o, i) =>
        i === index ? { ...o, optionMediaFile: file, optionMediaPreviewUrl: preview } : o
      );
    });
  };

  const validateOptions = (): string | null => {
    if (!selectedQuestionType?.supportsOptions) return null;

    if (options.length < ruleMinOptions) {
      const msg = `Minimum ${ruleMinOptions} option(s) are required.`;
      setOptionsError(msg);
      return msg;
    }

    if (options.length > ruleMaxOptions) {
      const msg = `Maximum ${ruleMaxOptions} option(s) are allowed.`;
      setOptionsError(msg);
      return msg;
    }

    const emptyIndex = options.findIndex((o) => o.optionText.trim() === "");
    if (emptyIndex !== -1) {
      const msg = `Option ${emptyIndex + 1} text is required.`;
      setOptionsError(msg);
      return msg;
    }

    const correctCount = options.filter((o) => o.isCorrect).length;
    if (correctCount < 1) {
      const msg = `Select at least one "Correct" option.`;
      setOptionsError(msg);
      return msg;
    }

    if (typeof ruleMaxSelections === "number" && correctCount > ruleMaxSelections) {
      const msg = `Maximum ${ruleMaxSelections} correct option(s) allowed.`;
      setOptionsError(msg);
      return msg;
    }

    setOptionsError(null);
    return null;
  };

  // Load options for this question
  useEffect(() => {
    if (!questionId || Number.isNaN(questionId)) return;

    let mounted = true;

    (async () => {
      try {
        setOptionsLoadError(null);

        const url = `${baseApi}${API_ENDPOINTS.QUESTION_OPTIONS.GET_BY_QUESTION}/${questionId}`;
        const res = await fetch(url, { credentials: "include" });
        if (!res.ok) throw new Error(`Failed to load options (${res.status})`);

        const json = await res.json();
        const data: OptionApiDto[] = json?.data ?? [];

        const mapped: LocalOption[] = data
          .slice()
          .sort((a, b) => a.optionOrder - b.optionOrder)
          .map((o) => ({
            optionId: o.optionId,
            optionText: o.optionText ?? "",
            optionOrder: String(o.optionOrder ?? 1),
            isCorrect: Boolean(o.isCorrect),
            isActive: o.isActive ?? true,
            optionMediaFile: null,
            optionMediaPreviewUrl: undefined,
            optionMediaPath: o.optionMediaPath,
          }));

        if (mounted) {
          setBaseOptions(mapped);
          setOptions(mapped);
        }
      } catch (e: any) {
        if (mounted) setOptionsLoadError(e?.message ?? "Failed to load options");
      }
    })();

    return () => {
      mounted = false;
    };
  }, [baseApi, questionId]);

  // If type supports options but API returned none, seed min
  useEffect(() => {
    if (!selectedQuestionType?.supportsOptions) return;
    if (options.length > 0) return;

    const seeded: LocalOption[] = Array.from({ length: ruleMinOptions }, (_, i) => ({
      optionText: "",
      optionOrder: String(i + 1),
      isCorrect: false,
      isActive: true,
      optionMediaFile: null,
      optionMediaPreviewUrl: undefined,
      optionMediaPath: null,
    }));

    setBaseOptions(seeded);
    setOptions(seeded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedQuestionType?.questionTypeId, selectedQuestionType?.supportsOptions, ruleMinOptions]);

  const handleAddOption = () => {
    setOptionsError(null);
    if (!selectedQuestionType?.supportsOptions) return;

    setOptions((prev) => {
      if (prev.length >= ruleMaxOptions) return prev;

      const next = normalizeOptionOrder([
        ...prev,
        {
          optionText: "",
          optionOrder: String(prev.length + 1),
          isCorrect: false,
          isActive: true,
          optionMediaFile: null,
          optionMediaPreviewUrl: undefined,
          optionMediaPath: null,
        },
      ]);

      return next;
    });
  };

  const handleRemoveOption = (index: number) => {
    setOptionsError(null);
    if (!selectedQuestionType?.supportsOptions) return;

    setOptions((prev) => {
      if (prev.length <= ruleMinOptions) {
        setOptionsError(`Minimum ${ruleMinOptions} option(s) are required.`);
        return prev;
      }

      revokeUrl(prev[index]?.optionMediaPreviewUrl);
      return normalizeOptionOrder(prev.filter((_, i) => i !== index));
    });
  };

  const handleOptionChange = (index: number, field: keyof LocalOption, value: any) => {
    setOptionsError(null);

    setOptions((prev) => {
      const next = prev.map((o, i) => (i === index ? { ...o, [field]: value } : o));

      if (field === "isCorrect" && value === true && selectedQuestionType?.supportsOptions) {
        const maxSel = ruleMaxSelections;

        if (maxSel === 1) {
          return next.map((o, i) => (i === index ? { ...o, isCorrect: true } : { ...o, isCorrect: false }));
        }

        if (typeof maxSel === "number") {
          const count = next.filter((o) => o.isCorrect).length;
          if (count > maxSel) {
            setOptionsError(`You can select maximum ${maxSel} correct option(s).`);
            return prev;
          }
        }
      }

      return next;
    });
  };

  /* ===============================
     Save (options + attachment)
  ============================== */

  const saveOptions = async () => {
    if (!selectedQuestionType?.supportsOptions) return;

    const removed = (baseOptions || [])
      .map((o) => o.optionId)
      .filter(Boolean)
      .filter((id) => !options.some((x) => x.optionId === id)) as number[];

    for (const id of removed) {
      const url = `${baseApi}${API_ENDPOINTS.QUESTION_OPTIONS.DELETE}/${id}`;
      const res = await fetch(url, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error(`Failed to delete option (${id})`);
    }

    const normalized = normalizeOptionOrder(options);

    for (let i = 0; i < normalized.length; i++) {
      const opt = normalized[i];

      const form = new FormData();
      form.append("OptionText", opt.optionText);
      form.append("IsCorrect", String(opt.isCorrect));
      form.append("OptionOrder", String(i + 1));
      form.append("IsActive", String(opt.isActive));
      if (opt.optionMediaFile) form.append("OptionMedia", opt.optionMediaFile);

      if (opt.optionId) {
        // ✅ confirmed by you: PUT /QuestionOptions/{id} multipart/form-data
        const url = `${baseApi}${API_ENDPOINTS.QUESTION_OPTIONS.PUT_UPDATE}/${opt.optionId}`;
        const res = await fetch(url, { method: "PUT", credentials: "include", body: form });
        if (!res.ok) throw new Error(`Failed to update option (${opt.optionId})`);
      } else {
        // Create requires QuestionId too
        form.append("QuestionId", String(questionId));

        const url = `${baseApi}${API_ENDPOINTS.QUESTION_OPTIONS.POST_CREATE}`;
        const res = await fetch(url, { method: "POST", credentials: "include", body: form });
        if (!res.ok) throw new Error("Failed to create option");
      }
    }

    setBaseOptions(normalizeOptionOrder(options).map((o) => ({ ...o, optionMediaFile: null })));
  };

  const saveAttachment = async () => {
    if (!selectedQuestionType?.supportsAttachments) return;

    // required rule: if supportsAttachments, must have existing or new file
    if (isAttachmentRequired && !existingAttachment?.uploadMediaPath && !attachmentFile) {
      throw new Error("Attachment is required for this question type.");
    }

    // If user selected a new file -> update existing if exists else create new
    if (!attachmentFile) return;

    const form = new FormData();
    form.append("IsActive", "true");
    form.append("File", attachmentFile); // ✅ confirmed field name

    if (existingAttachment?.questionAttachmentId) {
      const url = `${baseApi}${API_ENDPOINTS.QUESTION_ATTACHMENTS.PUT_UPDATE}/${existingAttachment.questionAttachmentId}`;
      const res = await fetch(url, { method: "PUT", credentials: "include", body: form });
      if (!res.ok) throw new Error("Failed to update attachment");
    } else {
      // create (assumes POST expects QuestionId + File)
      form.append("QuestionId", String(questionId));

      const url = `${baseApi}${API_ENDPOINTS.QUESTION_ATTACHMENTS.POST_CREATE}`;
      const res = await fetch(url, { method: "POST", credentials: "include", body: form });
      if (!res.ok) throw new Error("Failed to create attachment");
    }
  };

  const deleteExistingAttachment = async () => {
    if (!existingAttachment?.questionAttachmentId) return;
    const url = `${baseApi}${API_ENDPOINTS.QUESTION_ATTACHMENTS.DELETE}/${existingAttachment.questionAttachmentId}`;
    const res = await fetch(url, { method: "DELETE", credentials: "include" });
    if (!res.ok) throw new Error("Failed to delete attachment");
    setExistingAttachment(null);
    setAttachmentFile(null);
    setAttachmentError(null);
    revokeUrl(attachmentPreviewUrl);
    setAttachmentPreviewUrl(undefined);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Edit Question
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {renderErrorContent(error)}
        </Alert>
      )}

      {rulesError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {rulesError}
        </Alert>
      )}

      {optionsLoadError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {optionsLoadError}
        </Alert>
      )}

      {attachmentLoadError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {attachmentLoadError}
        </Alert>
      )}

      {optionsError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {optionsError}
        </Alert>
      )}

      {attachmentError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {attachmentError}
        </Alert>
      )}

      <Paper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0" }}>
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            try {
              const optMsg = validateOptions();
              if (optMsg) {
                setSnackbarMessage(optMsg);
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
                return;
              }

              if (isAttachmentRequired && !existingAttachment?.uploadMediaPath && !attachmentFile) {
                const msg = "Attachment is required for this question type.";
                setAttachmentError(msg);
                setSnackbarMessage(msg);
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
                return;
              }

              const result = await handleSubmit(e);
              if (!result?.success) return;

              await saveOptions();
              await saveAttachment();

              setSnackbarMessage(result.message);
              setSnackbarSeverity("success");
              setSnackbarOpen(true);

              setTimeout(() => {
                window.location.href = "/questions";
              }, 1500);
            } catch (err: any) {
              const msg = err?.message ?? "Failed to update question";
              setSnackbarMessage(msg);
              setSnackbarSeverity("error");
              setSnackbarOpen(true);
            }
          }}
        >
          <Grid container spacing={2}>
            {/* ---------- Question Information ---------- */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, color: "text.secondary" }}>
                Question Information
              </Typography>
            </Grid>

            {/* Question Type */}
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth size="small" required>
                <InputLabel>Question Type</InputLabel>
                <Select
                  name="questionTypeId"
                  value={formData.questionTypeId}
                  label="Question Type"
                  onChange={handleChange}
                  disabled={loading || isSubmitting}
                >
                  {questionTypes.map((qt) => (
                    <MenuItem key={qt.questionTypeId} value={qt.questionTypeId}>
                      {qt.name} ({qt.code})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Course */}
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Course</InputLabel>
                <Select
                  name="courseId"
                  value={formData.courseId}
                  label="Course"
                  onChange={handleChange}
                  disabled={loading || isSubmitting}
                >
                  <MenuItem value="">None</MenuItem>
                  {courses.map((course: any) => (
                    <MenuItem key={course.courseId} value={course.courseId}>
                      {course.courseName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Module */}
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth size="small" disabled={loading || isSubmitting || !formData.courseId}>
                <InputLabel>Module</InputLabel>
                <Select name="moduleId" value={formData.moduleId} label="Module" onChange={handleChange}>
                  <MenuItem value="">None</MenuItem>
                  {modules.map((module: any) => (
                    <MenuItem key={module.moduleId} value={module.moduleId}>
                      {module.moduleName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Title */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                required
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                size="small"
                disabled={loading || isSubmitting}
              />
            </Grid>

            {/* Description */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                size="small"
                disabled={loading || isSubmitting}
              />
            </Grid>

            {/* Marks */}
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                required
                label="Marks"
                name="marks"
                value={formData.marks}
                onChange={handleChange}
                size="small"
                disabled={loading || isSubmitting}
                type="number"
              />
            </Grid>

            {/* Negative Marks */}
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Negative Marks"
                name="negativeMarks"
                value={formData.negativeMarks}
                onChange={handleChange}
                size="small"
                disabled={loading || isSubmitting}
                type="number"
              />
            </Grid>

            {/* Difficulty */}
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth size="small" required>
                <InputLabel>Difficulty Level</InputLabel>
                <Select
                  name="difficultyLevel"
                  value={formData.difficultyLevel}
                  label="Difficulty Level"
                  onChange={handleChange}
                  disabled={loading || isSubmitting}
                >
                  <MenuItem value="EASY">EASY</MenuItem>
                  <MenuItem value="MEDIUM">MEDIUM</MenuItem>
                  <MenuItem value="HARD">HARD</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Status */}
            <Grid size={{ xs: 12 }} sx={{ mt: 1 }}>
              <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
                Status
              </Typography>

              <FormControlLabel
                control={
                  <Switch checked={formData.isActive} onChange={handleBooleanChange} disabled={loading || isSubmitting} />
                }
                label={formData.isActive ? "Active" : "Inactive"}
              />
            </Grid>

            {/* ---------- Attachment (same rule as create: required if supportsAttachments) ---------- */}
            {selectedQuestionType?.supportsAttachments && (
              <>
                <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1, color: "text.secondary" }}>
                    Question Attachment *
                  </Typography>
                  <Divider />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  {existingAttachment?.uploadMediaPath && (
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        Current:
                      </Typography>

                      {isUrlImage(existingAttachment.uploadMediaPath) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={existingAttachment.uploadMediaPath}
                          alt="Current attachment"
                          style={{ width: 260, height: 140, objectFit: "cover", borderRadius: 8, border: "1px solid #e0e0e0" }}
                        />
                      ) : (
                        <a href={existingAttachment.uploadMediaPath} target="_blank" rel="noreferrer">
                          {existingAttachment.uploadMediaPath}
                        </a>
                      )}

                      <Box sx={{ mt: 1 }}>
                        <Button
                          type="button"
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={async () => {
                            try {
                              await deleteExistingAttachment();
                              setSnackbarMessage("Attachment removed");
                              setSnackbarSeverity("success");
                              setSnackbarOpen(true);
                            } catch (err: any) {
                              setSnackbarMessage(err?.message ?? "Failed to delete attachment");
                              setSnackbarSeverity("error");
                              setSnackbarOpen(true);
                            }
                          }}
                          disabled={isSubmitting}
                        >
                          Remove Attachment
                        </Button>
                      </Box>
                    </Box>
                  )}

                  <Button
                    variant="outlined"
                    component="label"
                    size="small"
                    disabled={isSubmitting}
                    color={attachmentError ? "error" : "primary"}
                  >
                    {existingAttachment?.uploadMediaPath ? "Replace File *" : "Upload File *"}
                    <input
                      type="file"
                      hidden
                      onChange={(ev) => {
                        const file = ev.target.files?.[0] ?? null;
                        setAttachmentWithPreview(file);
                        ev.currentTarget.value = "";
                      }}
                    />
                  </Button>

                  {attachmentFile && (
                    <Typography variant="body2" sx={{ ml: 2, display: "inline" }}>
                      {attachmentFile.name}
                    </Typography>
                  )}

                  {attachmentPreviewUrl && (
                    <Box
                      sx={{
                        mt: 1.5,
                        width: 260,
                        height: 140,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={attachmentPreviewUrl}
                        alt="Selected attachment preview"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </Box>
                  )}
                </Grid>
              </>
            )}

            {/* ---------- Options (same as create) ---------- */}
            {selectedQuestionType?.supportsOptions && (
              <>
                <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography variant="subtitle1" sx={{ mb: 1, color: "text.secondary" }}>
                      Options *
                    </Typography>

                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "flex-end" }}>
                      <Chip size="small" variant="outlined" label={`Min ${ruleMinOptions} • Max ${ruleMaxOptions}`} />
                      <Chip
                        size="small"
                        variant="outlined"
                        color={correctSelectedCount >= 1 ? "success" : "default"}
                        label={`Correct: ${correctSelectedCount}${ruleMaxSelections ? ` / ${ruleMaxSelections}` : ""}`}
                      />
                    </Box>
                  </Box>
                  <Divider />
                </Grid>

                {options.map((opt, index) => {
                  const previewSrc = opt.optionMediaPreviewUrl || (opt.optionMediaPath ?? "");
                  const hasPreview = Boolean(previewSrc);

                  return (
                    <Grid key={opt.optionId ?? `new-${index}`} size={{ xs: 12 }}>
                      <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2, borderColor: "divider" }}>
                        <Stack spacing={1}>
                          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                            <TextField
                              label={`Option ${index + 1}`}
                              size="small"
                              fullWidth
                              value={opt.optionText}
                              disabled={loading || isSubmitting}
                              onChange={(e) => handleOptionChange(index, "optionText", e.target.value)}
                            />

                            <TextField label="Order" size="small" sx={{ width: 90 }} value={opt.optionOrder} disabled />

                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={opt.isCorrect}
                                  onChange={(e) => handleOptionChange(index, "isCorrect", e.target.checked)}
                                  disabled={loading || isSubmitting}
                                />
                              }
                              label="Correct"
                            />

                            <IconButton
                              aria-label="remove option"
                              size="small"
                              onClick={() => handleRemoveOption(index)}
                              disabled={loading || isSubmitting || options.length <= ruleMinOptions}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>

                          {/* OptionMediaPath (upload optional) */}
                          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: 12 }}>
                            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                              <Button variant="outlined" component="label" size="small" disabled={isSubmitting}>
                                Upload Option Image (optional)
                                <input
                                  type="file"
                                  hidden
                                  accept="image/png,image/jpeg,image/webp"
                                  onChange={(ev) => {
                                    const file = ev.target.files?.[0] ?? null;
                                    handleOptionMediaChange(index, file);
                                    ev.currentTarget.value = "";
                                  }}
                                />
                              </Button>

                              <Typography variant="caption" color="text.secondary">
                                (Saved as OptionMediaPath)
                              </Typography>

                              {opt.optionMediaFile?.name && (
                                <Typography variant="body2" color="text.secondary">
                                  {opt.optionMediaFile.name}
                                </Typography>
                              )}

                              {(opt.optionMediaFile || opt.optionMediaPreviewUrl) && (
                                <IconButton
                                  size="small"
                                  onClick={() => handleOptionMediaChange(index, null)}
                                  disabled={isSubmitting}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              )}
                            </Stack>

                            <Box
                              sx={{
                                width: 120,
                                height: 72,
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 1,
                                bgcolor: "background.default",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                overflow: "hidden",
                              }}
                            >
                              {hasPreview && isUrlImage(previewSrc) ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={previewSrc}
                                  alt={`Option ${index + 1} preview`}
                                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                              ) : (
                                <Typography variant="caption" color="text.secondary">
                                  No image
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </Stack>
                      </Paper>
                    </Grid>
                  );
                })}

                <Grid size={{ xs: 12 }}>
                  <Button
                    type="button"
                    variant="outlined"
                    size="small"
                    startIcon={<Add />}
                    onClick={handleAddOption}
                    disabled={loading || isSubmitting || options.length >= ruleMaxOptions}
                  >
                    Add Option
                  </Button>
                </Grid>
              </>
            )}

            {/* ---------- Actions ---------- */}
            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Link href="/questions">
                  <Button variant="outlined" color="secondary" startIcon={<Cancel />} size="small" disabled={isSubmitting}>
                    Cancel
                  </Button>
                </Link>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<Save />}
                  size="small"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update Question"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2200}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity={snackbarSeverity} variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
