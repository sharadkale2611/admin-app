"use client";

import React, { useMemo, useState } from "react";
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
} from "@mui/material";
import { Save, Cancel, Add, Delete } from "@mui/icons-material";
import Link from "next/link";

import useCreateQuestionViewModel from "@/lib/features/question/useCreateQuestionViewModel";
import { ApiError } from "@/lib/features/question/questionTypes";

import { useQuestionTypeViewModel } from "@/lib/features/questionType/useQuestionTypeViewModel";
import { useAppDispatch } from "@/lib/hooks";
import { createQuestionAttachment } from "@/lib/features/questionAttachment/questionAttachmentThunks";
import { createQuestionOption } from "@/lib/features/questionOption/questionOptionThunks";
import type { QuestionType } from "@/lib/features/questionType/questionTypeTypes";

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

export default function CreateQuestionPage() {
  const dispatch = useAppDispatch();

  const {
  formData,
  isSubmitting,
  error,
  courses,
  modules,   // 👈 use cascading modules from here
  handleChange,
  handleSubmit,
} = useCreateQuestionViewModel();

  /* 🔹 Load Dropdown Data */
  const { questionTypes } = useQuestionTypeViewModel();

  /* 🔹 Derived Selected Question Type */
  const selectedQuestionType: QuestionType | undefined = useMemo(
    () => {
      if (!formData.questionTypeId) return undefined;
      const id = Number(formData.questionTypeId);
      if (Number.isNaN(id)) return undefined;
      return questionTypes.find(
        (qt) => qt.questionTypeId === id
      );
    },
    [questionTypes, formData.questionTypeId]
  );

  /* 🔹 Local State: Attachment & Options */
  const [attachmentFile, setAttachmentFile] =
    useState<File | null>(null);

  interface LocalOption {
    optionText: string;
    optionOrder: string;
    isCorrect: boolean;
  }

  const [options, setOptions] = useState<LocalOption[]>([]);

  const handleAddOption = () => {
    setOptions((prev) => [
      ...prev,
      {
        optionText: "",
        optionOrder: String(prev.length + 1),
        isCorrect: false,
      },
    ]);
  };

  const handleOptionChange = (
    index: number,
    field: keyof LocalOption,
    value: string | boolean
  ) => {
    setOptions((prev) =>
      prev.map((opt, i) =>
        i === index
          ? { ...opt, [field]: value }
          : opt
      )
    );
  };

  const handleRemoveOption = (index: number) => {
    setOptions((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };


  /* Snackbar */
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<"success" | "error">("success");

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

      <Paper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0" }}>
        <form
          onSubmit={async (e) => {
      const result = await handleSubmit(e);

      if (result?.success && result.question) {
        const questionId =
  result.question.questionId;

        try {
          const tasks: Promise<unknown>[] = [];

          // 🔹 Attachment (if supported & provided)
          if (
            selectedQuestionType?.supportsAttachments &&
            attachmentFile
          ) {
            tasks.push(
              dispatch(
                createQuestionAttachment({
                  questionId,
                  file: attachmentFile,
                })
              ).unwrap()
            );
          }

          // 🔹 Options (if supported)
          if (selectedQuestionType?.supportsOptions) {
            const validOptions = options.filter(
              (opt) => opt.optionText.trim() !== ""
            );

            validOptions.forEach((opt, index) => {
              tasks.push(
                dispatch(
                  createQuestionOption({
                    questionId,
                    optionText: opt.optionText,
                    isCorrect: opt.isCorrect,
                    optionOrder:
                      opt.optionOrder.trim() !== ""
                        ? Number(opt.optionOrder)
                        : index + 1,
                  })
                ).unwrap()
              );
            });
          }

          if (tasks.length > 0) {
            await Promise.all(tasks);
          }
        } catch (err) {
          console.error(
            "Failed to create question attachments/options",
            err
          );
        }

        setSnackbarMessage(
          typeof result.message === "string" &&
            result.message.length > 0
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
            <Typography
              variant="subtitle1"
              sx={{ mt: 2, mb: 1, color: "text.secondary" }}
            >
              Question Options
            </Typography>
          </Grid>

          {options.map((opt, index) => (
            <Grid
              key={index}
              size={{ xs: 12 }}
            >
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
                    handleOptionChange(
                      index,
                      "optionText",
                      e.target.value
                    )
                  }
                />
                <TextField
                  label="Order"
                  size="small"
                  type="number"
                  sx={{ width: 100 }}
                  value={opt.optionOrder}
                  disabled={isSubmitting}
                  onChange={(e) =>
                    handleOptionChange(
                      index,
                      "optionOrder",
                      e.target.value
                    )
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={opt.isCorrect}
                      onChange={(e) =>
                        handleOptionChange(
                          index,
                          "isCorrect",
                          e.target.checked
                        )
                      }
                      disabled={isSubmitting}
                    />
                  }
                  label="Correct"
                />
                <IconButton
                  aria-label="remove option"
                  size="small"
                  onClick={() =>
                    handleRemoveOption(index)
                  }
                  disabled={isSubmitting}
                >
                  <Delete fontSize="small" />
                </IconButton>
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
              disabled={isSubmitting}
            >
              Add Option
            </Button>
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
        <Alert
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
