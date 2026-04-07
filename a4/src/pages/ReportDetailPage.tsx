import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FoundStatusPanel } from "../components/FoundStatusPanel";
import { StatusMessage } from "../components/StatusMessage";
import { useReportDetail } from "../hooks/useReportDetail";
import { getReports, saveReports } from "../services";
import { ReportStatus } from "../types";

// show one full report and let the owner mark it as found
export const ReportDetailPage = () => {
    const navigate = useNavigate();
    const { reportId } = useParams();
    const { report, loading, error, reloadReport } = useReportDetail(reportId);
    const [updating, setUpdating] = useState(false);
    const [updateError, setUpdateError] = useState<string | null>(null);

    if (loading) {
        return <StatusMessage type="loading" text="Loading report details..." />;
    }

    if (error || !report || !reportId) {
        return <StatusMessage type="error" text={error || "Report not found."} />;
    }

    return (
        <article className="card border-0 shadow-sm">
            <div className="card-body">
                <img
                    src={report.imageUrl}
                    alt={report.animalName}
                    className="detail-image mb-3"
                />
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <h1 className="h3 mb-1">{report.animalName}</h1>
                        <p className="text-capitalize mb-1">{report.animalType}</p>
                    </div>
                    <span
                        className={`badge text-capitalize ${
                            report.status === "lost"
                                ? "text-bg-danger"
                                : "text-bg-success"
                        }`}
                    >
                        {report.status}
                    </span>
                </div>

                <h2 className="h5">Description</h2>
                <p>{report.description}</p>

                <h2 className="h5">Contact Information</h2>
                <p>{report.contactInfo}</p>

                <h2 className="h5">Last Seen Address</h2>
                <p>{report.lastSeenAddress}</p>

                {report.status === ReportStatus.Lost && (
                    <FoundStatusPanel
                        loading={updating}
                        error={updateError}
                        // check the password, change the status, save it, then go back home
                        onSubmit={async (password) => {
                            setUpdating(true);
                            setUpdateError(null);
                            try {
                                if (password !== report.ownerPassword) {
                                    throw new Error("Incorrect password.");
                                }

                                const allReports = await getReports();
                                // replace the one report we need to change because jsonbin stores the whole list
                                const updatedReports = allReports.map((item) =>
                                    item.id === reportId
                                        ? { ...item, status: ReportStatus.Found }
                                        : item,
                                );
                                await saveReports(updatedReports);
                                await reloadReport();
                                navigate("/");
                                return true;
                            } catch (error) {
                                setUpdateError(
                                    error instanceof Error
                                        ? error.message
                                        : "Could not mark as found.",
                                );
                                return false;
                            } finally {
                                setUpdating(false);
                            }
                        }}
                    />
                )}
            </div>
        </article>
    );
};
