import { AnimalType, ReportStatus } from "./enums";

export interface Coordinates {
    lat: number;
    lon: number;
}

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

export interface ReportsBinRecord {
    reports: AnimalReport[];
}
