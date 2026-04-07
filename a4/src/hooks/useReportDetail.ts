import { useCallback, useEffect, useState } from "react";
import { getReports } from "../services";
import type { AnimalReport } from "../types";

// load one report using the id from the route
export const useReportDetail = (reportId: string | undefined) => {
    const [report, setReport] = useState<AnimalReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // load all reports first, then find the one for this page
    const reloadReport = useCallback(async () => {
        if (!reportId) {
            setError("Missing report id.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const reports = await getReports();
            const found = reports.find((item) => item.id === reportId) ?? null;
            if (!found) {
                setError("Report not found.");
                setReport(null);
            } else {
                setReport(found);
            }
        } catch (error) {
            setError(
                error instanceof Error ? error.message : "Could not load report.",
            );
        } finally {
            setLoading(false);
        }
    }, [reportId]);

    useEffect(() => {
        // load again if the route id changes
        void reloadReport();
    }, [reloadReport]);

    return { report, loading, error, reloadReport };
};
