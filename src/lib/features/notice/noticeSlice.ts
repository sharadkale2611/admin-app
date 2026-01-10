// notices/noticeSlice.ts

import { createSlice } from "@reduxjs/toolkit";
import {
  fetchNotices,
  fetchNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
} from "./noticeThunks";
import { ApiError, NoticeState } from "./noticeTypes";

const initialState: NoticeState = {
  notices: [],
  currentNotice: null,
  loading: false,
  error: null,
};

const noticeSlice = createSlice({
  name: "notices",
  initialState,
  reducers: {
    clearCurrentNotice(state) {
      state.currentNotice = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* GET ALL */
      .addCase(fetchNotices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotices.fulfilled, (state, action) => {
        state.loading = false;
        state.notices = action.payload;
      })
      .addCase(fetchNotices.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as ApiError) ?? { error: "Failed to fetch students", errors: null };
      })



       /* CREATE */
      .addCase(createNotice.fulfilled, (state, action) => {
        if (action.payload.notice) {
          state.notices.unshift(action.payload.notice);
        }
      })


       /* GET BY ID */
      .addCase(fetchNoticeById.fulfilled, (state, action) => {
        state.currentNotice = action.payload;
      })


        /* UPDATE */
      .addCase(updateNotice.fulfilled, (state, action) => {
        state.notices = state.notices.map((n) =>
          n.noticeId === action.payload.notice.noticeId
            ? action.payload.notice
            : n
        );
      })



        /* DELETE */
      .addCase(deleteNotice.fulfilled, (state, action) => {
        state.notices = state.notices.filter(
          (n) => n.noticeId !== action.payload.id
        );
      });





  } 
});

export const { clearCurrentNotice } = noticeSlice.actions;
export default noticeSlice.reducer;