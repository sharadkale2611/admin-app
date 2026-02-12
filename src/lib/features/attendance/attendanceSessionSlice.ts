import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AttendanceFilter =
    | 'All'
    | 'Present'
    | 'Absent'
    | 'Late'
    | 'Leave';

interface AttendanceSessionState {
    filter: AttendanceFilter;
    isLocked: boolean;
}

const initialState: AttendanceSessionState = {
    filter: 'All',
    isLocked: true, // dummy (API later)
};

const attendanceSessionSlice = createSlice({
    name: 'attendanceSession',
    initialState,
    reducers: {
        setFilter(state, action: PayloadAction<AttendanceFilter>) {
            state.filter = action.payload;
        },
        unlockSession(state, action: PayloadAction<{ reason: string }>) {
            console.log('Session unlocked:', action.payload.reason);
            state.isLocked = false;
        },
        lockSession(state) {
            state.isLocked = true;
        },
    },
});

export const {
    setFilter,
    unlockSession,
    lockSession,
} = attendanceSessionSlice.actions;

export default attendanceSessionSlice.reducer;
