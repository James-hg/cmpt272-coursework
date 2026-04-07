import { Link } from "react-router-dom";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import type { AnimalReport } from "../types";

interface ReportsMapProps {
    reports: AnimalReport[];
}

export const ReportsMap = ({ reports }: ReportsMapProps) => {
    return (
        <MapContainer center={[49.2827, -123.1207]} zoom={11} className="tb-map">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {reports.map((report) => (
                <CircleMarker
                    key={report.id}
                    center={[report.lastSeenCoords.lat, report.lastSeenCoords.lon]}
                    radius={8}
                    pathOptions={{ color: "#d7263d" }}
                >
                    <Popup>
                        <div style={{ width: "180px" }}>
                            <img
                                src={report.imageUrl}
                                alt={report.animalName}
                                className="img-fluid rounded mb-2"
                            />
                            <p className="mb-1 fw-semibold">{report.animalName}</p>
                            <p className="mb-2 text-capitalize">{report.animalType}</p>
                            <Link to={`/reports/${report.id}`}>View details</Link>
                        </div>
                    </Popup>
                </CircleMarker>
            ))}
        </MapContainer>
    );
};
