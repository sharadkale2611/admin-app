// app/dashboard/page.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/hooks';

export default function Dashboard() {
    const router = useRouter();
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    const initialCheckDone = useAppSelector(state => state.auth.initialCheckDone);

    useEffect(() => {
        // Only check after initial auth verification is complete
        if (initialCheckDone && !isAuthenticated) {
            console.log('Redirecting to login');
            router.push('/login?redirect=/dashboard');
        }
    }, [isAuthenticated, initialCheckDone, router]);

    // Show loading state while checking auth
    if (!initialCheckDone) {
        return <div>Loading...</div>;
    }

    return <div>Dashboard Content</div>;
}