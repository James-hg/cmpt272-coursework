import type { NominatimReverseResponse } from "../types";

// turn map coordinates into a readable address
export const reverseGeocode = async (
    lat: number,
    lon: number,
): Promise<string> => {
    // send the query values that nominatim expects
    const query = new URLSearchParams({
        format: "jsonv2",
        lat: String(lat),
        lon: String(lon),
    });

    const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?${query.toString()}`,
        {
            method: "GET",
            headers: { Accept: "application/json" },
        },
    );

    if (!response.ok) {
        throw new Error("Could not get address from map location.");
    }

    const data = (await response.json()) as NominatimReverseResponse;
    if (!data.display_name) {
        throw new Error("No address found for selected location.");
    }

    return data.display_name;
};
