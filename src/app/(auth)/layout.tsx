'use client'
import { AuthProvider } from '@/lib/features/auth/authProvider'
import { useEffect } from 'react'

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    useEffect(()=>{
        console.log('from auth login layout useEffect ...');
        
    })
    return (
        <AuthProvider>
                {children}
        </AuthProvider>
    )
}