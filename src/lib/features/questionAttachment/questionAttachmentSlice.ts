import { createSlice } from "@reduxjs/toolkit";
import {
  fetchQuestionAttachments,
  fetchQuestionAttachmentById,
  createQuestionAttachment,
  updateQuestionAttachment,
  deleteQuestionAttachment,
} from "./questionAttachmentThunks";
import { ApiError, QuestionAttachmentState } from "./questionAttachmentTypes";

const initialState: QuestionAttachmentState = {
  attachments: [],
  currentAttachment: null,
  loading: false,
  error: null,
};

const questionAttachmentSlice = createSlice({
  name: "questionAttachments",
  initialState,
  reducers: {
    clearCurrentAttachment(state) {
      state.currentAttachment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ===============================
         GET ALL
      ================================ */
      .addCase(fetchQuestionAttachments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuestionAttachments.fulfilled, (state, action) => {
        state.loading = false;
        state.attachments = action.payload;
      })
      .addCase(fetchQuestionAttachments.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as ApiError) ?? {
            error: "Failed to fetch attachments",
            errors: null,
          };
      })

      /* ===============================
         GET BY ID
      ================================ */
      .addCase(fetchQuestionAttachmentById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuestionAttachmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAttachment = action.payload;
      })
      .addCase(fetchQuestionAttachmentById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as ApiError) ?? {
            error: "Failed to fetch attachment",
            errors: null,
          };
      })

      /* ===============================
         CREATE
      ================================ */
      .addCase(createQuestionAttachment.fulfilled, (state, action) => {
        if (action.payload.attachment) {
          state.attachments.unshift(action.payload.attachment);
        }
      })

      /* ===============================
         UPDATE
      ================================ */
      .addCase(updateQuestionAttachment.fulfilled, (state) => {
        // Backend does not return full updated entity
        // Best practice: refetch OR manually update if needed
      })

      /* ===============================
         DELETE
      ================================ */
      .addCase(deleteQuestionAttachment.fulfilled, (state, action) => {
        state.attachments = state.attachments.filter(
          (attachment) =>
            attachment.questionAttachmentId !== action.payload.id
        );
      });
  },
});

export const { clearCurrentAttachment } = questionAttachmentSlice.actions;

export default questionAttachmentSlice.reducer;
