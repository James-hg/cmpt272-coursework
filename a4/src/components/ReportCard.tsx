import { Link } from "react-router-dom";
import type { AnimalReport } from "../types";

interface ReportCardProps {
    report: AnimalReport;
}

export const ReportCard = ({ report }: ReportCardProps) => {
    return (
        <article className="card h-100 border-0 shadow-sm">
            <img
                src={report.imageUrl}
                alt={report.animalName}
                className="report-image"
            />
            <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                    <h3 className="h5 mb-0">{report.animalName}</h3>
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
                <p className="text-capitalize text-secondary mb-1">
                    {report.animalType}
                </p>
                <p className="small mb-3">{report.lastSeenAddress}</p>
                <Link to={`/reports/${report.id}`} className="btn btn-outline-primary btn-sm">
                    View Details
                </Link>
            </div>
        </article>
    );
};
