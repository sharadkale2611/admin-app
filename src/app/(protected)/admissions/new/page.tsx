'use client';
// src/app/(protected)/admissions/new/page.tsx

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Entry point for Admission Wizard
 * Always redirect to step-1
 */
export default function AdmissionsNewPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/admissions/new/step-1');
    }, [router]);

    return null;
}
