import { CircleMarker, MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import type { Coordinates } from "../types";

interface LocationPickerMapProps {
    selectedLocation: Coordinates | null;
    onPickLocation: (coords: Coordinates) => void;
}

// this turns a map click into the lat/lon object the form uses
const MapClickHandler = ({
    onPickLocation,
}: {
    onPickLocation: (coords: Coordinates) => void;
}) => {
    useMapEvents({
        click(event) {
            onPickLocation({
                lat: event.latlng.lat,
                lon: event.latlng.lng,
            });
        },
    });

    return null;
};

export const LocationPickerMap = ({
    selectedLocation,
    onPickLocation,
}: LocationPickerMapProps) => {
    return (
        <MapContainer center={[49.2827, -123.1207]} zoom={11} className="tb-map">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler onPickLocation={onPickLocation} />
            // show the picked spot so the user knows what will be saved
            {selectedLocation && (
                <CircleMarker
                    center={[selectedLocation.lat, selectedLocation.lon]}
                    radius={10}
                    pathOptions={{ color: "#f18f01" }}
                />
            )}
        </MapContainer>
    );
};
