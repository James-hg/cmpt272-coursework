import { useState } from "react";
import {
    getReports,
    reverseGeocode,
    saveReports,
    uploadImage,
} from "../services";
import { ReportStatus, type AnimalReport, type Coordinates, type ReportDraft } from "../types";

// handle the create report flow and its loading and error state
export const useCreateReport = () => {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // get the address when the user clicks the map in the form
    const pickAddress = async (coords: Coordinates): Promise<string> => {
        return reverseGeocode(coords.lat, coords.lon);
    };

    // run the whole submit flow from image upload to saving the updated list
    const submitReport = async (draft: ReportDraft): Promise<boolean> => {
        setSubmitting(true);
        setError(null);

        try {
            if (!draft.photoFile) {
                throw new Error("Photo is required.");
            }
            if (!draft.location) {
                throw new Error("Please select a location on the map.");
            }
            if (!draft.ownerPassword.trim()) {
                throw new Error("Password is required.");
            }

            const imageUrl = await uploadImage(draft.photoFile);

            // make the final report object that will be saved to jsonbin
            const report: AnimalReport = {
                id: crypto.randomUUID(),
                animalName: draft.animalName.trim(),
                animalType: draft.animalType,
                imageUrl,
                description: draft.description.trim(),
                contactInfo: draft.contactInfo.trim(),
                lastSeenCoords: draft.location,
                lastSeenAddress: draft.locationAddress.trim(),
                ownerPassword: draft.ownerPassword,
                status: ReportStatus.Lost,
            };

            // add the new report to the front because jsonbin stores one array
            const existing = await getReports();
            await saveReports([report, ...existing]);
            return true;
        } catch (error) {
            setError(
                error instanceof Error ? error.message : "Could not submit report.",
            );
            return false;
        } finally {
            setSubmitting(false);
        }
    };

    return { submitting, error, pickAddress, submitReport };
};
