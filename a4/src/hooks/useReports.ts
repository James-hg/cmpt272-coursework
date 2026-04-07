import { useCallback, useEffect, useState } from "react";
import { getReports } from "../services";
import type { AnimalReport } from "../types";

export const useReports = () => {
    const [reports, setReports] = useState<AnimalReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // load the full reports list for pages that need all reports
    const reloadReports = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getReports();
            setReports(data);
        } catch (error) {
            setError(
                error instanceof Error ? error.message : "Could not load reports.",
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void reloadReports();
    }, [reloadReports]);

    return { reports, loading, error, reloadReports };
};
