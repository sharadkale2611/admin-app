"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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
   Rules Types
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
  // Prefer BASE_URL_API, else BASE_URL + "/api"
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
};

interface LocalOption {
  optionId?: number; // present for existing options
  optionText: string;
  optionOrder: string;
  isCorrect: boolean;

  // Option image upload (optional)
  optionMediaFile?: File | null;
  optionMediaPreviewUrl?: string;
}

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

  /* ===============================
     Rules state
  ============================== */

  const [rulesByTypeId, setRulesByTypeId] = useState<Record<number, QuestionTypeRuleDto>>({});
  const [rulesError, setRulesError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setRulesError(null);
        const url = `${getApiBaseUrlApi()}${API_ENDPOINTS.QUESTION_TYPE_RULES.GET_LIST}`;
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
  }, []);

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
     Attachment state (required if supportsAttachments)
  ============================== */

  const isAttachmentRequired = useMemo(() => {
    return Boolean(selectedQuestionType?.supportsAttachments);
  }, [selectedQuestionType?.supportsAttachments]);

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

  /* ===============================
     Options state (load/edit/save)
  ============================== */

  const [options, setOptions] = useState<LocalOption[]>([]);
  const [baseOptions, setBaseOptions] = useState<LocalOption[]>([]);
  const [optionsError, setOptionsError] = useState<string | null>(null);
  const [optionsLoadError, setOptionsLoadError] = useState<string | null>(null);

  const normalizeOptionOrder = (opts: LocalOption[]) =>
    opts.map((o, i) => ({ ...o, optionOrder: String(i + 1) }));

  const revokeOptionPreview = (url?: string) => revokeUrl(url);

  // Cleanup option previews on unmount
  useEffect(() => {
    return () => {
      options.forEach((o) => revokeOptionPreview(o.optionMediaPreviewUrl));
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
        revokeOptionPreview(row.optionMediaPreviewUrl);
        return prev.map((o, i) =>
          i === index ? { ...o, optionMediaFile: null, optionMediaPreviewUrl: undefined } : o
        );
      }

      const msg = validateOptionImage(file);
      if (msg) {
        setOptionsError(msg);
        return prev;
      }

      revokeOptionPreview(row.optionMediaPreviewUrl);
      const preview = URL.createObjectURL(file);

      return prev.map((o, i) =>
        i === index ? { ...o, optionMediaFile: file, optionMediaPreviewUrl: preview } : o
      );
    });
  };

  const correctSelectedCount = useMemo(() => options.filter((o) => o.isCorrect).length, [options]);

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

  // Load options from API (by question)
  useEffect(() => {
    if (!questionId || Number.isNaN(questionId)) return;

    let mounted = true;

    (async () => {
      try {
        setOptionsLoadError(null);

        const url = `${getApiBaseUrlApi()}${API_ENDPOINTS.QUESTION_OPTIONS.GET_BY_QUESTION}/${questionId}`;
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
            optionMediaFile: null,
            optionMediaPreviewUrl: undefined,
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
  }, [questionId]);

  // If question type changes to one that doesn't support options, clear UI
  useEffect(() => {
    setOptionsError(null);

    if (!selectedQuestionType?.supportsOptions) {
      setOptions([]);
      setBaseOptions([]);
      return;
    }

    // If supportsOptions and there are no loaded options (rare), seed min options
    if (selectedQuestionType?.supportsOptions && options.length === 0) {
      const seeded: LocalOption[] = Array.from({ length: ruleMinOptions }, (_, i) => ({
        optionText: "",
        optionOrder: String(i + 1),
        isCorrect: false,
        optionMediaFile: null,
        optionMediaPreviewUrl: undefined,
      }));
      setOptions(seeded);
      setBaseOptions(seeded);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedQuestionType?.questionTypeId, selectedQuestionType?.supportsOptions]);

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
          optionMediaFile: null,
          optionMediaPreviewUrl: undefined,
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
      revokeOptionPreview(prev[index]?.optionMediaPreviewUrl);
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

  // Save helpers (assumes standard REST routing; confirm endpoints if different)
  const saveOptionsAndAttachment = async () => {
    const baseUrlApi = getApiBaseUrlApi();

    // Attachment required validation
    if (isAttachmentRequired && !attachmentFile) {
      throw new Error("Attachment is required for this question type.");
    }

    // Options validation
    const msg = validateOptions();
    if (msg) throw new Error(msg);

    // 1) Upload attachment if user selected a new one
    if (selectedQuestionType?.supportsAttachments && attachmentFile) {
      const form = new FormData();
      form.append("QuestionId", String(questionId));
      // backend field name unknown; common: "File"
      // If your create attachment expects "AttachmentFile" or "File", tell me and I’ll adjust.
      form.append("File", attachmentFile);

      const url = `${baseUrlApi}${API_ENDPOINTS.QUESTION_ATTACHMENTS.POST_CREATE}`;
      const res = await fetch(url, { method: "POST", credentials: "include", body: form });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Attachment upload failed (${res.status}): ${text}`);
      }
    }

    // 2) Options sync: delete removed
    const baseIds = new Set(baseOptions.map((o) => o.optionId).filter(Boolean) as number[]);
    const currentIds = new Set(options.map((o) => o.optionId).filter(Boolean) as number[]);
    const removedIds = [...baseIds].filter((id) => !currentIds.has(id));

    for (const id of removedIds) {
      const url = `${baseUrlApi}${API_ENDPOINTS.QUESTION_OPTIONS.DELETE}/${id}`;
      const res = await fetch(url, { method: "DELETE", credentials: "include" });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to delete option ${id} (${res.status}): ${text}`);
      }
    }

    // 3) Create / Update options
    const normalized = normalizeOptionOrder(options);

    for (let i = 0; i < normalized.length; i++) {
      const opt = normalized[i];
      const form = new FormData();
      form.append("QuestionId", String(questionId));
      form.append("OptionText", opt.optionText);
      form.append("IsCorrect", String(opt.isCorrect));
      form.append("OptionOrder", String(i + 1));
      if (opt.optionMediaFile) form.append("OptionMedia", opt.optionMediaFile);

      if (opt.optionId) {
        // ASSUMPTION: PUT /QuestionOptions/{id} accepts multipart/form-data
        const url = `${baseUrlApi}${API_ENDPOINTS.QUESTION_OPTIONS.PUT_UPDATE}/${opt.optionId}`;
        const res = await fetch(url, { method: "PUT", credentials: "include", body: form });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Failed to update option ${opt.optionId} (${res.status}): ${text}`);
        }
      } else {
        const url = `${baseUrlApi}${API_ENDPOINTS.QUESTION_OPTIONS.POST_CREATE}`;
        const res = await fetch(url, { method: "POST", credentials: "include", body: form });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Failed to create option (${res.status}): ${text}`);
        }
      }
    }

    // Refresh baseOptions after save
    setBaseOptions(normalized.map((o) => ({ ...o, optionMediaFile: null })));
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
              // Validate before doing anything
              const optMsg = validateOptions();
              if (optMsg) {
                setSnackbarMessage(optMsg);
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
                return;
              }

              if (isAttachmentRequired && !attachmentFile) {
                const msg = "Attachment is required for this question type.";
                setAttachmentError(msg);
                setSnackbarMessage(msg);
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
                return;
              }

              const result = await handleSubmit(e);

              if (result?.success) {
                await saveOptionsAndAttachment();

                setSnackbarMessage(result.message);
                setSnackbarSeverity("success");
                setSnackbarOpen(true);

                setTimeout(() => {
                  window.location.href = "/questions";
                }, 1500);
              }
            } catch (err: any) {
              const msg = err?.message ?? "Failed to save changes";
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
              <Divider />
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

            {/* Module (Cascading) */}
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
                  <Button
                    variant="outlined"
                    component="label"
                    size="small"
                    disabled={isSubmitting}
                    color={attachmentError ? "error" : "primary"}
                  >
                    Upload File *
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
                        width: 220,
                        height: 120,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={attachmentPreviewUrl}
                        alt="Attachment preview"
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

                {options.map((opt, index) => (
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

                        {/* OptionMedia (optional) */}
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

                            {opt.optionMediaFile?.name && (
                              <Typography variant="body2" color="text.secondary">
                                {opt.optionMediaFile.name}
                              </Typography>
                            )}

                            {opt.optionMediaFile && (
                              <IconButton
                                size="small"
                                onClick={() => handleOptionMediaChange(index, null)}
                                disabled={isSubmitting}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            )}

                            <Typography variant="caption" color="text.secondary">
                              JPG/PNG/WEBP • Max 2MB
                            </Typography>
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
                            {opt.optionMediaPreviewUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={opt.optionMediaPreviewUrl}
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
                ))}

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
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<Cancel />}
                    size="small"
                    disabled={isSubmitting}
                  >
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

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2500}
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
