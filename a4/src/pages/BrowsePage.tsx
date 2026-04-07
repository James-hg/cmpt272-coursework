import { useState } from "react";
import { ReportCard } from "../components/ReportCard";
import { StatusMessage } from "../components/StatusMessage";
import { useReports } from "../hooks/useReports";
import { AnimalType, ReportStatus } from "../types";

// show all reports with simple filters on this page
export const BrowsePage = () => {
    const { reports, loading, error } = useReports();
    const [animalType, setAnimalType] = useState<AnimalType | "all">("all");
    const [status, setStatus] = useState<ReportStatus | "all">("all");

    // keep only the reports that match both filter dropdowns
    const filteredReports = reports.filter((report) => {
        const typeMatch = animalType === "all" || report.animalType === animalType;
        const statusMatch = status === "all" || report.status === status;
        return typeMatch && statusMatch;
    });

    return (
        <section>
            <h1 className="h3 mb-3">Browse Reports</h1>
            <div className="card border-0 shadow-sm mb-3">
                <div className="card-body row g-3">
                    <div className="col-md-6">
                        <label className="form-label">Animal Type</label>
                        <select
                            className="form-select"
                            value={animalType}
                            onChange={(event) =>
                                setAnimalType(event.target.value as AnimalType | "all")
                            }
                        >
                            <option value="all">All types</option>
                            <option value={AnimalType.Dog}>Dog</option>
                            <option value={AnimalType.Cat}>Cat</option>
                            <option value={AnimalType.Bird}>Bird</option>
                            <option value={AnimalType.Rabbit}>Rabbit</option>
                            <option value={AnimalType.Other}>Other</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Status</label>
                        <select
                            className="form-select"
                            value={status}
                            onChange={(event) =>
                                setStatus(event.target.value as ReportStatus | "all")
                            }
                        >
                            <option value="all">All statuses</option>
                            <option value={ReportStatus.Lost}>Lost</option>
                            <option value={ReportStatus.Found}>Found</option>
                        </select>
                    </div>
                </div>
            </div>

            {error && <StatusMessage type="error" text={error} />}
            {loading && <StatusMessage type="loading" text="Loading reports..." />}
            {!loading && filteredReports.length === 0 && (
                <StatusMessage
                    type="info"
                    text="No reports match the current filters."
                />
            )}

            <div className="row g-3">
                {filteredReports.map((report) => (
                    <div className="col-md-6 col-lg-4" key={report.id}>
                        <ReportCard report={report} />
                    </div>
                ))}
            </div>
        </section>
    );
};
