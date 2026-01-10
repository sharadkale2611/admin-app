'use client';

import { createContext, useContext, useState } from 'react';

export type AttendanceFilter =
    | 'ALL'
    | 'PRESENT'
    | 'ABSENT'
    | 'LATE'
    | 'LEAVE';

interface AttendanceFilterContextValue {
    filter: AttendanceFilter;
    setFilter: (filter: AttendanceFilter) => void;

    // 🔐 Session Lock (Step 7)
    isLocked: boolean;
    unlockSession: (reason: string) => void;
}

const AttendanceFilterContext =
    createContext<AttendanceFilterContextValue | null>(null);

export function AttendanceFilterProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [filter, setFilter] =
        useState<AttendanceFilter>('ALL');

    // 🔐 Dummy lock state (API later)
    const [isLocked, setIsLocked] = useState(true);

    const unlockSession = (reason: string) => {
        console.log('Attendance session unlocked:', reason);
        setIsLocked(false);
    };

    return (
        <AttendanceFilterContext.Provider
            value={{
                filter,
                setFilter,
                isLocked,
                unlockSession,
            }}
        >
            {children}
        </AttendanceFilterContext.Provider>
    );
}

export function useAttendanceFilter() {
    const ctx = useContext(AttendanceFilterContext);
    if (!ctx) {
        throw new Error(
            'useAttendanceFilter must be used inside AttendanceFilterProvider'
        );
    }
    return ctx;
}
