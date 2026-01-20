'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import api from '@/lib/services/apiService';
import API_ENDPOINTS from '@/lib/config/apiConfig';

export type AttendanceStatus =
  | 'Present'
  | 'Absent'
  | 'Late'
  | 'Leave'
  | 'Pending';

const normalizeStatus = (value: any): AttendanceStatus => {
  const s = String(value ?? '').toLowerCase();
  if (s === 'present') return 'Present';
  if (s === 'absent') return 'Absent';
  if (s === 'late') return 'Late';
  if (s === 'leave') return 'Leave';
  return 'Pending';
};

const normalizeAttendanceBySession = (raw: any): AttendanceBySession | null => {
  if (!raw || typeof raw !== 'object') return null;

  const sessionRaw = raw.session ?? raw.Session;
  const summaryRaw = raw.summary ?? raw.Summary;
  const studentsRaw = raw.studentAttendance ?? raw.StudentAttendance;

  if (!sessionRaw || !summaryRaw || !Array.isArray(studentsRaw)) return null;

  const session = {
    sessionId: Number(sessionRaw.sessionId ?? sessionRaw.SessionId ?? 0),
    date: String(sessionRaw.date ?? sessionRaw.Date ?? ''),
    time: String(sessionRaw.time ?? sessionRaw.Time ?? ''),
    batchName: String(sessionRaw.batchName ?? sessionRaw.BatchName ?? 'Unknown'),
    staffName: String(sessionRaw.staffName ?? sessionRaw.StaffName ?? 'Unknown'),
    moduleName: String(sessionRaw.moduleName ?? sessionRaw.ModuleName ?? 'N/A'),
    remarks: (sessionRaw.remarks ?? sessionRaw.Remarks) ?? null,
  };

  const summary = {
    present: Number(summaryRaw.present ?? summaryRaw.Present ?? 0),
    absent: Number(summaryRaw.absent ?? summaryRaw.Absent ?? 0),
    late: Number(summaryRaw.late ?? summaryRaw.Late ?? 0),
    leave: Number(summaryRaw.leave ?? summaryRaw.Leave ?? 0),
    total: Number(summaryRaw.total ?? summaryRaw.Total ?? 0),
  };

  const studentAttendance = studentsRaw.map((a: any) => ({
    attendanceId: Number(a.attendanceId ?? a.AttendanceId ?? 0),
    studentId: Number(a.studentId ?? a.StudentId ?? 0),
    rollNo: (a.rollNo ?? a.RollNo) ?? null,
    studentName: String(a.studentName ?? a.StudentName ?? 'Unknown'),
    status: normalizeStatus(a.status ?? a.Status),
  }));

  return { session, summary, studentAttendance };
};

export type AttendanceBySession = {
  session: {
    sessionId: number;
    date: string;
    time: string;
    batchName: string;
    staffName: string;
    moduleName: string;
    remarks?: string | null;
  };
  summary: {
    present: number;
    absent: number;
    late: number;
    leave: number;
    total: number;
  };
  studentAttendance: Array<{
    attendanceId: number;
    studentId: number;
    rollNo: string | null;
    studentName: string;
    status: AttendanceStatus;
  }>;
};

export type UpdateAttendanceStatusRequest = {
  sessionId: number;
  attendanceUpdates: Array<{
    attendanceId: number;
    studentId: number;
    status: AttendanceStatus;
  }>;
};

type AttendanceSessionDataContextValue = {
  loading: boolean;
  error: string | null;
  data: AttendanceBySession | null;
  updating: boolean;
  updateError: string | null;
  refetch: () => Promise<void>;
  updateStatuses: (
    updates: UpdateAttendanceStatusRequest['attendanceUpdates']
  ) => Promise<boolean>;
};

const AttendanceSessionDataContext =
  createContext<AttendanceSessionDataContextValue | null>(null);

export function AttendanceSessionDataProvider({
  sessionId,
  children,
}: {
  sessionId: number;
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AttendanceBySession | null>(null);

  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get<AttendanceBySession>(
        `${API_ENDPOINTS.ATTENDANCE.GET_BY_SESSION}/${sessionId}`,
        { withCredentials: true }
      );

      if (!res?.success) {
        throw new Error(res?.error || res?.message || 'Failed to load session');
      }

      setData(normalizeAttendanceBySession(res.data) ?? null);
    } catch (e: any) {
      setData(null);
      setError(e?.message || 'Failed to load session');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    let active = true;

    const run = async () => {
      if (!active) return;
      await fetchData();
    };

    run();

    return () => {
      active = false;
    };
  }, [fetchData]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  const updateStatuses = useCallback(
    async (
      updates: UpdateAttendanceStatusRequest['attendanceUpdates']
    ) => {
      try {
        setUpdating(true);
        setUpdateError(null);

        const payload: UpdateAttendanceStatusRequest = {
          sessionId,
          attendanceUpdates: updates,
        };

        const res = await api.put<any>(
          API_ENDPOINTS.ATTENDANCE.PUT_UPDATE_STATUS,
          payload,
          { withCredentials: true }
        );

        if (!res?.success) {
          throw new Error(
            res?.error || res?.message || 'Failed to update attendance'
          );
        }

        await fetchData();
        return true;
      } catch (e: any) {
        setUpdateError(e?.message || 'Failed to update attendance');
        return false;
      } finally {
        setUpdating(false);
      }
    },
    [fetchData, sessionId]
  );

  const value = useMemo<AttendanceSessionDataContextValue>(
    () => ({
      loading,
      error,
      data,
      updating,
      updateError,
      refetch,
      updateStatuses,
    }),
    [loading, error, data, updating, updateError, refetch, updateStatuses]
  );

  return (
    <AttendanceSessionDataContext.Provider value={value}>
      {children}
    </AttendanceSessionDataContext.Provider>
  );
}

export function useAttendanceSessionData() {
  const ctx = useContext(AttendanceSessionDataContext);
  if (!ctx) {
    throw new Error(
      'useAttendanceSessionData must be used inside AttendanceSessionDataProvider'
    );
  }
  return ctx;
}
