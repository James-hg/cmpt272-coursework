import { useCallback, useEffect, useState } from "react";
import { getReports } from "../services";
import type { AnimalReport } from "../types";

// load the full reports list for the map and browse pages
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
        // load the reports once when the page opens
        void reloadReports();
    }, [reloadReports]);

    return { reports, loading, error, reloadReports };
};
