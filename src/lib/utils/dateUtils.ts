// lib/utils/dateUtils.ts
export const formatDate = (
    dateString?: string | null,
    fallback: string = 'Not specified'
) =>
    dateString
        ? new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
        : fallback;

export const formatDateTime = (
    dateString?: string | null,
    fallback: string = '—'
) => {
    if (!dateString) return fallback;

    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return fallback;

    return date.toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
};
