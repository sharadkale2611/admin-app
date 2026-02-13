import { createSlice } from "@reduxjs/toolkit";
import {
  fetchQuestionTypeRules,
  fetchQuestionTypeRuleById,
  createQuestionTypeRule,
  updateQuestionTypeRule,
  deleteQuestionTypeRule,
  fetchQuestionTypeRulesPaginated,
} from "./questionTypeRuleThunks";
import { ApiError, QuestionTypeRuleState } from "./questionTypeRuleTypes";

const initialState: QuestionTypeRuleState = {
  rules: [],
  currentRule: null,
  loading: false,
  error: null,
};

const questionTypeRuleSlice = createSlice({
  name: "questionTypeRules",
  initialState,
  reducers: {
    clearCurrentQuestionTypeRule(state) {
      state.currentRule = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ===============================
         GET ALL
      ================================ */
      .addCase(fetchQuestionTypeRules.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuestionTypeRules.fulfilled, (state, action) => {
        state.loading = false;
        state.rules = action.payload;
      })
      .addCase(fetchQuestionTypeRules.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as ApiError) ?? {
            error: "Failed to fetch rules",
            errors: null,
          };
      })

      /* ===============================
         GET PAGINATED
      ================================ */
      .addCase(fetchQuestionTypeRulesPaginated.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuestionTypeRulesPaginated.fulfilled, (state, action) => {
        state.loading = false;
        state.rules = action.payload.items;
      })
      .addCase(fetchQuestionTypeRulesPaginated.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as ApiError) ?? {
            error: "Failed to fetch rules",
            errors: null,
          };
      })

      /* ===============================
         CREATE
      ================================ */
      .addCase(createQuestionTypeRule.fulfilled, (state, action) => {
        if (action.payload.rule) {
          state.rules.unshift(action.payload.rule);
        }
      })

      /* ===============================
         GET BY ID
      ================================ */
      .addCase(fetchQuestionTypeRuleById.fulfilled, (state, action) => {
        state.currentRule = action.payload;
      })

      /* ===============================
         UPDATE
      ================================ */
      .addCase(updateQuestionTypeRule.fulfilled, (state, action) => {
        if (!action.payload.rule) return;

        state.rules = state.rules.map((rule) =>
          rule.ruleId === action.payload.rule!.ruleId
            ? action.payload.rule!
            : rule
        );

        if (
          state.currentRule?.ruleId ===
          action.payload.rule.ruleId
        ) {
          state.currentRule = action.payload.rule;
        }
      })

      /* ===============================
         DELETE
      ================================ */
      .addCase(deleteQuestionTypeRule.fulfilled, (state, action) => {
        state.rules = state.rules.filter(
          (rule) => rule.ruleId !== action.payload.id
        );
      });
  },
});

export const { clearCurrentQuestionTypeRule } =
  questionTypeRuleSlice.actions;

export default questionTypeRuleSlice.reducer;
