import { AnimalType, ReportStatus } from "./enums";

// keep the simple lat/lon shape used by the maps
export interface Coordinates {
    lat: number;
    lon: number;
}

// keep the full report shape saved in jsonbin
export interface AnimalReport {
    id: string;
    animalName: string;
    animalType: AnimalType;
    imageUrl: string;
    description: string;
    contactInfo: string;
    lastSeenCoords: Coordinates;
    lastSeenAddress: string;
    ownerPassword: string;
    status: ReportStatus;
}

// keep the form state before a report is saved
export interface ReportDraft {
    animalName: string;
    animalType: AnimalType;
    description: string;
    contactInfo: string;
    ownerPassword: string;
    location: Coordinates | null;
    locationAddress: string;
    photoFile: File | null;
}

// keep all reports inside one jsonbin record object
export interface ReportsBinRecord {
    reports: AnimalReport[];
}
