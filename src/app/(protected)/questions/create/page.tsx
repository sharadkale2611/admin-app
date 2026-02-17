"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Grid,
  Alert,
  Snackbar,
  Checkbox,
  FormControlLabel,
  IconButton,
  Chip,
  Divider,
  Stack,
  Tooltip,
} from "@mui/material";
import { Save, Cancel, Add, Delete } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "next/link";

import useCreateQuestionViewModel from "@/lib/features/question/useCreateQuestionViewModel";
import { ApiError } from "@/lib/features/question/questionTypes";

import { useQuestionTypeViewModel } from "@/lib/features/questionType/useQuestionTypeViewModel";
import { useAppDispatch } from "@/lib/hooks";
import { createQuestionAttachment } from "@/lib/features/questionAttachment/questionAttachmentThunks";
import { createQuestionOption } from "@/lib/features/questionOption/questionOptionThunks";
import type { QuestionType } from "@/lib/features/questionType/questionTypeTypes";
import API_ENDPOINTS from "@/lib/config/apiConfig";

/* ===============================
   Field Labels (for errors)
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
};

/* ===============================
   Error Renderer
================================ */

function renderErrorContent(error: ApiError | string | null) {
  if (!error) return null;

  if (typeof error === "string") {
    return (
      <div className="text-red-600">
        <h4 className="font-semibold mb-2">{error}</h4>
      </div>
    );
  }

  return (
    <div className="text-red-600">
      {error.error && (
        <h4 className="font-semibold mb-2">{error.error}</h4>
      )}

      {error.errors && (
        <ul className="list-disc list-inside space-y-1">
          {Object.entries(error.errors).map(([field, messages]) =>
            messages.map((msg, i) => (
              <li key={`${field}-${i}`}>
                <strong>{fieldLabels[field] || field}:</strong>{" "}
                {msg}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

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

function getApiBaseUrl() {
  // Prefer your env if present; fallback for local dev based on your sample
  return API_ENDPOINTS.BASE_URL_API || "https://localhost:7033/api" || "https://apirsa.ysaasinfotech.com/api";
}

export default function CreateQuestionPage() {
  const dispatch = useAppDispatch();

  const {
    formData,
    isSubmitting,
    error,
    courses,
    modules, // cascading modules
    handleChange,
    handleSubmit,
  } = useCreateQuestionViewModel();

  const { questionTypes } = useQuestionTypeViewModel();

  const selectedQuestionType: QuestionType | undefined = useMemo(() => {
    if (!formData.questionTypeId) return undefined;
    const id = Number(formData.questionTypeId);
    if (Number.isNaN(id)) return undefined;
    return questionTypes.find((qt) => qt.questionTypeId === id);
  }, [questionTypes, formData.questionTypeId]);

  /* 🔹 Local State: Attachment & Options */
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);

  interface LocalOption {
    optionText: string;
    optionOrder: string;
    isCorrect: boolean;

    // ✅ NEW (optional)
    optionMediaFile?: File | null;
    optionMediaPreviewUrl?: string;
  }

  const [options, setOptions] = useState<LocalOption[]>([]);
  const [optionsError, setOptionsError] = useState<string | null>(null);

  // ---- Rules state ----
  const [rulesByTypeId, setRulesByTypeId] = useState<Record<number, QuestionTypeRuleDto>>({});
  const [rulesLoading, setRulesLoading] = useState(false);
  const [rulesLoadError, setRulesLoadError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setRulesLoading(true);
        setRulesLoadError(null);

        const url = `${getApiBaseUrl()}/QuestionTypeRules`;
        const res = await fetch(url, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          throw new Error(`Failed to load QuestionTypeRules (${res.status})`);
        }

        const json = await res.json();
        const data: QuestionTypeRuleDto[] = json?.data ?? [];

        const map: Record<number, QuestionTypeRuleDto> = {};
        for (const r of data) map[r.questionTypeId] = r;

        if (mounted) setRulesByTypeId(map);
      } catch (e: any) {
        if (mounted) setRulesLoadError(e?.message ?? "Failed to load rules");
      } finally {
        if (mounted) setRulesLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const activeRule = useMemo(() => {
    const typeId = Number(formData.questionTypeId || 0);
    if (!typeId) return null;
    return rulesByTypeId[typeId] ?? null;
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

  const correctSelectedCount = useMemo(
    () => options.filter((o) => o.isCorrect).length,
    [options]
  );

  const normalizeOptionOrder = (opts: LocalOption[]) =>
    opts.map((o, i) => ({ ...o, optionOrder: String(i + 1) }));

  // Seed default options when question type changes (based on MinOptions)
  useEffect(() => {
    setOptionsError(null);

    if (!selectedQuestionType?.supportsOptions) {
      setOptions([]);
      return;
    }

    const min = ruleMinOptions;

    // Special-case TF: prefill texts if code == "TF"
    const isTF = (selectedQuestionType as any)?.code === "TF";

    const seeded: LocalOption[] = Array.from({ length: min }, (_, i) => ({
      optionText: isTF ? (i === 0 ? "True" : i === 1 ? "False" : "") : "",
      optionOrder: String(i + 1),
      isCorrect: false, // force user to choose correct (but validate before submit)
      optionMediaFile: null,
      optionMediaPreviewUrl: undefined,
    }));

    setOptions(seeded);
  }, [selectedQuestionType?.questionTypeId, selectedQuestionType?.supportsOptions, ruleMinOptions]);

  const handleAddOption = () => {
    setOptionsError(null);

    if (!selectedQuestionType?.supportsOptions) return;

    setOptions((prev) => {
      if (prev.length >= ruleMaxOptions) return prev;

      const next = [
        ...prev,
        {
          optionText: "",
          optionOrder: String(prev.length + 1),
          isCorrect: false,
          optionMediaFile: null,
          optionMediaPreviewUrl: undefined,
        },
      ];

      return normalizeOptionOrder(next);
    });
  };

  const handleOptionChange = (
    index: number,
    field: keyof LocalOption,
    value: string | boolean
  ) => {
    setOptionsError(null);

    setOptions((prev) => {
      const next = prev.map((opt, i) => (i === index ? { ...opt, [field]: value } : opt));

      // Enforce maxSelections for correct answers
      if (field === "isCorrect" && value === true && selectedQuestionType?.supportsOptions) {
        const maxSel = ruleMaxSelections;

        if (maxSel === 1) {
          // MCQ-style: only one correct allowed -> auto-uncheck others
          return next.map((o, i) => (i === index ? { ...o, isCorrect: true } : { ...o, isCorrect: false }));
        }

        if (typeof maxSel === "number") {
          const count = next.filter((o) => o.isCorrect).length;
          if (count > maxSel) {
            // revert this change
            setOptionsError(`You can select maximum ${maxSel} correct option(s) for this question type.`);
            return prev;
          }
        }
      }

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

      const next = prev.filter((_, i) => i !== index);
      return normalizeOptionOrder(next);
    });
  };

  // ✅ Return error message (null if valid) instead of boolean
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

  const revokePreviewUrl = (url?: string) => {
    if (!url) return;
    try {
      URL.revokeObjectURL(url);
    } catch {
      // ignore
    }
  };

  const validateOptionImage = (file: File): string | null => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) return "Invalid image format (only JPG, PNG, WEBP allowed).";
    if (file.size > 2 * 1024 * 1024) return "Image size must be under 2MB.";
    return null;
  };

  const handleOptionMediaChange = (index: number, file: File | null) => {
    setOptionsError(null);

    setOptions((prev) => {
      const row = prev[index];
      if (!row) return prev;

      // remove
      if (!file) {
        revokePreviewUrl(row.optionMediaPreviewUrl);
        return prev.map((o, i) =>
          i === index ? { ...o, optionMediaFile: null, optionMediaPreviewUrl: undefined } : o
        );
      }

      const msg = validateOptionImage(file);
      if (msg) {
        setOptionsError(msg);
        return prev;
      }

      // replace preview
      revokePreviewUrl(row.optionMediaPreviewUrl);
      const preview = URL.createObjectURL(file);

      return prev.map((o, i) =>
        i === index ? { ...o, optionMediaFile: file, optionMediaPreviewUrl: preview } : o
      );
    });
  };

  // cleanup previews on unmount
  useEffect(() => {
    return () => {
      options.forEach((o) => revokePreviewUrl(o.optionMediaPreviewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ When seeding options, include new fields (don’t remove existing logic)
  useEffect(() => {
    setOptionsError(null);

    if (!selectedQuestionType?.supportsOptions) {
      setOptions([]);
      return;
    }

    const min = ruleMinOptions;

    // Special-case TF: prefill texts if code == "TF"
    const isTF = (selectedQuestionType as any)?.code === "TF";

    const seeded: LocalOption[] = Array.from({ length: min }, (_, i) => ({
      optionText: isTF ? (i === 0 ? "True" : i === 1 ? "False" : "") : "",
      optionOrder: String(i + 1),
      isCorrect: false, // force user to choose correct (but validate before submit)
      optionMediaFile: null,
      optionMediaPreviewUrl: undefined,
    }));

    setOptions(seeded);
  }, [selectedQuestionType?.questionTypeId, selectedQuestionType?.supportsOptions, ruleMinOptions]);

  /* Snackbar */
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  return (
    <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        Create New Question
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {renderErrorContent(error)}
        </Alert>
      )}

      {rulesLoadError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {rulesLoadError}
        </Alert>
      )}

      {optionsError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {optionsError}
        </Alert>
      )}

      <Paper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0" }}>
        <form
          onSubmit={async (e) => {
            // ✅ prevent page reload ALWAYS
            e.preventDefault();

            // ✅ use returned message (don’t rely on async state)
            const optionValidationMsg = validateOptions();
            if (optionValidationMsg) {
              setSnackbarMessage(optionValidationMsg);
              setSnackbarSeverity("error");
              setSnackbarOpen(true);
              return;
            }

            const result = await handleSubmit(e);

            if (result?.success && result.question) {
              const questionId = result.question.questionId;

              try {
                const tasks: Promise<unknown>[] = [];

                if (selectedQuestionType?.supportsAttachments && attachmentFile) {
                  tasks.push(
                    dispatch(
                      createQuestionAttachment({
                        questionId,
                        file: attachmentFile,
                      })
                    ).unwrap()
                  );
                }

                if (selectedQuestionType?.supportsOptions) {
                  const normalized = normalizeOptionOrder(options);

                  normalized.forEach((opt, index) => {
                    tasks.push(
                      dispatch(
                        createQuestionOption({
                          questionId,
                          optionText: opt.optionText,
                          isCorrect: opt.isCorrect,
                          optionOrder: index + 1,
                          optionMedia: opt.optionMediaFile ?? undefined, // ✅ NEW
                        })
                      ).unwrap()
                    );
                  });
                }

                if (tasks.length > 0) await Promise.all(tasks);
              } catch (err) {
                console.error("Failed to create question options", err);
              }

              setSnackbarMessage(
                typeof result.message === "string" && result.message.length > 0
                  ? result.message
                  : "Question created successfully."
              );
              setSnackbarSeverity("success");
              setSnackbarOpen(true);

              setTimeout(() => {
                window.location.href = "/questions";
              }, 1500);
            }
          }}
        >
          <Grid container spacing={2}>
            {/* Section Header */}
            <Grid size={{ xs: 12 }}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 1, color: "text.secondary" }}
              >
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
                  disabled={isSubmitting}
                >
                  {questionTypes.map((qt) => (
                    <MenuItem
                      key={qt.questionTypeId}
                      value={qt.questionTypeId}
                    >
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
      disabled={isSubmitting}
    >
      <MenuItem value="">None</MenuItem>
      {courses.map((course: any) => (
        <MenuItem
          key={course.courseId}
          value={course.courseId}
        >
          {course.courseName}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
</Grid>

{/* Module (Filtered by Course) */}
<Grid size={{ xs: 12 }}>
  <FormControl
    fullWidth
    size="small"
    disabled={!formData.courseId}
  >
    <InputLabel>Module</InputLabel>
    <Select
      name="moduleId"
      value={formData.moduleId}
      label="Module"
      onChange={handleChange}
    >
      <MenuItem value="">None</MenuItem>
      {modules.map((module: any) => (
        <MenuItem
          key={module.moduleId}
          value={module.moduleId}
        >
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                  disabled={isSubmitting}
                >
                  <MenuItem value="EASY">EASY</MenuItem>
                  <MenuItem value="MEDIUM">MEDIUM</MenuItem>
                  <MenuItem value="HARD">HARD</MenuItem>
                </Select>
              </FormControl>
            </Grid>

      {/* Question Attachment (conditional) */}
      {selectedQuestionType?.supportsAttachments && (
        <>
          <Grid size={{ xs: 12 }}>
            <Typography
              variant="subtitle1"
              sx={{ mt: 2, mb: 1, color: "text.secondary" }}
            >
              Question Attachment
            </Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Button
              variant="outlined"
              component="label"
              size="small"
              disabled={isSubmitting}
            >
              Upload File
              <input
                type="file"
                hidden
                onChange={(e) =>
                  setAttachmentFile(
                    e.target.files?.[0] ?? null
                  )
                }
              />
            </Button>
            {attachmentFile && (
              <Typography
                variant="body2"
                sx={{ ml: 2, display: "inline" }}
              >
                {attachmentFile.name}
              </Typography>
            )}
          </Grid>
        </>
      )}

      {/* Question Options (conditional) */}
      {selectedQuestionType?.supportsOptions && (
        <>
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography
                variant="subtitle1"
                sx={{ mt: 2, mb: 1, color: "text.secondary" }}
              >
                Question Options
              </Typography>

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "flex-end" }}>
                <Chip
                  size="small"
                  label={
                    rulesLoading
                      ? "Rules: loading..."
                      : `Min ${ruleMinOptions} • Max ${ruleMaxOptions}`
                  }
                  variant="outlined"
                />
                <Chip
                  size="small"
                  color={correctSelectedCount >= 1 ? "success" : "default"}
                  label={`Correct selected: ${correctSelectedCount}${ruleMaxSelections ? ` / ${ruleMaxSelections}` : ""}`}
                  variant="outlined"
                />
              </Box>
            </Box>
            <Divider />
          </Grid>

          {options.map((opt, index) => (
            <Grid key={index} size={{ xs: 12 }}>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <TextField
                  label={`Option ${index + 1}`}
                  size="small"
                  fullWidth
                  value={opt.optionText}
                  disabled={isSubmitting}
                  onChange={(e) =>
                    handleOptionChange(index, "optionText", e.target.value)
                  }
                />

                <TextField
                  label="Order"
                  size="small"
                  type="number"
                  sx={{ width: 100 }}
                  value={opt.optionOrder}
                  disabled={true} // keep stable; auto-maintained
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={opt.isCorrect}
                      onChange={(e) =>
                        handleOptionChange(index, "isCorrect", e.target.checked)
                      }
                      disabled={isSubmitting}
                    />
                  }
                  label="Correct"
                />

                <IconButton
                  aria-label="remove option"
                  size="small"
                  onClick={() => handleRemoveOption(index)}
                  disabled={isSubmitting || options.length <= ruleMinOptions}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>

              {/* ✅ ADD BELOW (doesn't remove old UI) */}
              <Box sx={{ mt: 1, display: "grid", gridTemplateColumns: "1fr 120px", gap: 12 }}>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  <Button
                    variant="outlined"
                    component="label"
                    size="small"
                    disabled={isSubmitting}
                  >
                    Upload Option Image (optional)
                    <input
                      hidden
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={(ev) => {
                        const file = ev.target.files?.[0] ?? null;
                        handleOptionMediaChange(index, file);
                        ev.currentTarget.value = ""; // allow re-select same file
                      }}
                    />
                  </Button>

                  <Typography variant="caption" color="text.secondary">
                    Saved as <b>OptionMediaPath</b> • JPG/PNG/WEBP • Max 2MB
                  </Typography>

                  {opt.optionMediaFile && (
                    <>
                      <Typography variant="body2" color="text.secondary">
                        {opt.optionMediaFile.name}
                      </Typography>

                      <Tooltip title="Remove image">
                        <IconButton
                          size="small"
                          onClick={() => handleOptionMediaChange(index, null)}
                          disabled={isSubmitting}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </Stack>

                <Box
                  sx={{
                    width: 120,
                    height: 72,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    bgcolor: "background.default",
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
            </Grid>
          ))}

          <Grid size={{ xs: 12 }}>
            <Button
              type="button"
              variant="outlined"
              size="small"
              startIcon={<Add />}
              onClick={handleAddOption}
              disabled={isSubmitting || options.length >= ruleMaxOptions}
            >
              Add Option
            </Button>
            {options.length >= ruleMaxOptions && (
              <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                Max options reached ({ruleMaxOptions}).
              </Typography>
            )}
          </Grid>
        </>
      )}

            {/* Actions */}
            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Link href="/questions" passHref>
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
                  {isSubmitting
                    ? "Creating..."
                    : "Create Question"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbarSeverity} variant="filled" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
