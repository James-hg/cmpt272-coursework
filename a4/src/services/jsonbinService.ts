import type {
    AnimalReport,
    JsonBinReadResponse,
    JsonBinWriteResponse,
    ReportsBinRecord,
} from "../types";

const binId = import.meta.env.VITE_JSONBIN_BIN_ID;
const masterKey = import.meta.env.VITE_JSONBIN_MASTER_KEY;

if (!binId) {
    throw new Error("Missing VITE_JSONBIN_BIN_ID in .env");
}

if (!masterKey) {
    throw new Error("Missing VITE_JSONBIN_MASTER_KEY in .env");
}

const baseUrl = `https://api.jsonbin.io/v3/b/${binId}`;

const getHeaders = (): HeadersInit => ({
    "Content-Type": "application/json",
    "X-Master-Key": masterKey,
});

// show the real api error instead of a vague fetch error
const parseApiError = async (
    response: Response,
    fallbackMessage: string,
): Promise<string> => {
    try {
        const data = (await response.json()) as {
            message?: string;
            error?: string;
        };
        return (
            data.message ||
            data.error ||
            `${fallbackMessage} (status ${response.status})`
        );
    } catch {
        return `${fallbackMessage} (status ${response.status})`;
    }
};

// get the current reports list from jsonbin
export const getReports = async (): Promise<AnimalReport[]> => {
    const response = await fetch(`${baseUrl}/latest`, {
        method: "GET",
        headers: getHeaders(),
    });

    if (!response.ok) {
        const message = await parseApiError(
            response,
            "Could not load reports from JSONbin",
        );
        throw new Error(message);
    }

    const data =
        (await response.json()) as JsonBinReadResponse<ReportsBinRecord>;
    return data.record?.reports ?? [];
};

// save the full reports list back to jsonbin
export const saveReports = async (
    reports: AnimalReport[],
): Promise<AnimalReport[]> => {
    const response = await fetch(baseUrl, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ reports }),
    });

    if (!response.ok) {
        const message = await parseApiError(
            response,
            "Could not save reports to JSONbin",
        );
        throw new Error(message);
    }

    const data =
        (await response.json()) as JsonBinWriteResponse<ReportsBinRecord>;
    return data.record.reports;
};
