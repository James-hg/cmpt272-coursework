import { ReportsMap } from "../components/ReportsMap";
import { StatusMessage } from "../components/StatusMessage";
import { useReports } from "../hooks/useReports";
import { ReportStatus } from "../types";

export const HomePage = () => {
    const { reports, loading, error } = useReports();
    const lostReports = reports.filter((item) => item.status === ReportStatus.Lost);

    return (
        <section>
            <h1 className="h3 mb-2">Lost Animal Map</h1>
            <p className="text-secondary mb-3">
                Active lost-animal reports are shown as red markers.
            </p>
            {error && <StatusMessage type="error" text={error} />}
            {loading ? (
                <StatusMessage type="loading" text="Loading map reports..." />
            ) : (
                <ReportsMap reports={lostReports} />
            )}
        </section>
    );
};
