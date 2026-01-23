'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/services/apiService';

export default function ApiTestPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const testApi = async () => {
            try {
                const response = await api.post<any>(
                    'https://apirsa.ysaasinfotech.com/api/test'
                );

                // 🔥 IMPORTANT: actual payload is in response.data
                setData(response.data);
            } catch (err: any) {
                setError(err.message || 'Failed to call API');
            } finally {
                setLoading(false);
            }
        };

        testApi();
    }, []);

    return (
        <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
            <h1>API Test Page</h1>

            {loading && <p>⏳ Calling API...</p>}

            {error && (
                <p style={{ color: 'red' }}>
                    ❌ Error: {error}
                </p>
            )}

            {data && (
                <>
                    <p style={{ color: 'green' }}>
                        ✅ API is working!
                    </p>
                    <pre
                        style={{
                            background: '#f5f5f5',
                            padding: 16,
                            borderRadius: 6,
                            overflowX: 'auto',
                        }}
                    >
                        {JSON.stringify(data, null, 2)}
                    </pre>
                </>
            )}
        </div>
    );
}
