// app/(auth)/login/LoginClient.tsx
'use client';

import dynamic from 'next/dynamic';

const LoginPage = dynamic(() => import('./LoginPage'), {
    ssr: false,
});

export default function LoginClient() {
    return <LoginPage />;
}
