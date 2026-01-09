// lib/utils/dateUtils.ts
export const formatDate = (dateString?: string | null) =>
    dateString
        ? new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
        : 'Not specified';
