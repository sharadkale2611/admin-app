const flattenErrors = (
    errors?: Record<string, string[]> | null
): string[] | null => {
    if (!errors) return null;
    return Object.values(errors).flat();
};

export default flattenErrors;