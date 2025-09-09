import { useAppDispatch } from "@/lib/hooks";
import { createFirm } from "@/lib/features/firm/firmThunks";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface FormData {
    firmName: string;
    firmCode: string;
    isActive: boolean;
}

export const useCreateFirmViewModel = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        setError(null);

        try {
            await dispatch(createFirm(formData)).unwrap();
            router.push('/firms');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create firm');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        error,
        handleSubmit
    };
};