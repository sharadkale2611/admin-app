import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/lib/store';
import {
    setFilter,
    unlockSession,
} from '@/lib/features/attendance/attendanceSessionSlice';

export function useAttendanceSession() {
    const dispatch = useDispatch<AppDispatch>();

    const filter = useSelector(
        (state: RootState) => state.attendanceSession.filter
    );

    const isLocked = useSelector(
        (state: RootState) => state.attendanceSession.isLocked
    );

    return {
        filter,
        isLocked,
        setFilter: (f: any) => dispatch(setFilter(f)),
        unlockSession: (reason: string) =>
            dispatch(unlockSession({ reason })),
    };
}
