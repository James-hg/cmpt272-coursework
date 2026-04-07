import { useState } from "react";
import type { FormEvent } from "react";
import { AnimalType, type Coordinates, type ReportDraft } from "../types";
import { LocationPickerMap } from "./LocationPickerMap";
import { StatusMessage } from "./StatusMessage";

interface ReportFormProps {
    submitting: boolean;
    submitError: string | null;
    onPickAddress: (coords: Coordinates) => Promise<string>;
    onSubmit: (draft: ReportDraft) => Promise<void>;
}

const initialDraft: ReportDraft = {
    animalName: "",
    animalType: AnimalType.Dog,
    description: "",
    contactInfo: "",
    ownerPassword: "",
    location: null,
    locationAddress: "",
    photoFile: null,
};

export const ReportForm = ({
    submitting,
    submitError,
    onPickAddress,
    onSubmit,
}: ReportFormProps) => {
    const [draft, setDraft] = useState<ReportDraft>(initialDraft);
    const [locationLoading, setLocationLoading] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);

    // this lets the form update one field without making lots of handlers
    const updateDraft = <K extends keyof ReportDraft>(
        key: K,
        value: ReportDraft[K],
    ) => {
        setDraft((prev) => ({ ...prev, [key]: value }));
    };

    const canSubmit =
        draft.animalName.trim().length > 0 &&
        draft.description.trim().length > 0 &&
        draft.contactInfo.trim().length > 0 &&
        draft.ownerPassword.trim().length > 0 &&
        draft.location !== null &&
        draft.locationAddress.trim().length > 0 &&
        draft.photoFile !== null;

    // when the map is clicked, save the spot and try to fill the address too
    const handlePickLocation = async (coords: Coordinates) => {
        setLocationLoading(true);
        setLocationError(null);
        try {
            const address = await onPickAddress(coords);
            updateDraft("location", coords);
            updateDraft("locationAddress", address);
        } catch (error) {
            setLocationError(
                error instanceof Error
                    ? error.message
                    : "Could not read map location.",
            );
        } finally {
            setLocationLoading(false);
        }
    };

    // send the whole draft up to the page when the form is submitted
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await onSubmit(draft);
    };

    return (
        <form className="card border-0 shadow-sm" onSubmit={handleSubmit}>
            <div className="card-body">
                <h1 className="h3 mb-3">Create Lost Animal Report</h1>
                {submitError && <StatusMessage type="error" text={submitError} />}
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">Animal Name</label>
                        <input
                            className="form-control"
                            value={draft.animalName}
                            onChange={(event) =>
                                updateDraft("animalName", event.target.value)
                            }
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Animal Type</label>
                        <select
                            className="form-select text-capitalize"
                            value={draft.animalType}
                            onChange={(event) =>
                                updateDraft(
                                    "animalType",
                                    event.target.value as AnimalType,
                                )
                            }
                        >
                            <option value={AnimalType.Dog}>Dog</option>
                            <option value={AnimalType.Cat}>Cat</option>
                            <option value={AnimalType.Bird}>Bird</option>
                            <option value={AnimalType.Rabbit}>Rabbit</option>
                            <option value={AnimalType.Other}>Other</option>
                        </select>
                    </div>
                    <div className="col-12">
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-control"
                            rows={4}
                            value={draft.description}
                            onChange={(event) =>
                                updateDraft("description", event.target.value)
                            }
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Contact Information</label>
                        <input
                            className="form-control"
                            value={draft.contactInfo}
                            onChange={(event) =>
                                updateDraft("contactInfo", event.target.value)
                            }
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={draft.ownerPassword}
                            onChange={(event) =>
                                updateDraft("ownerPassword", event.target.value)
                            }
                            required
                        />
                    </div>
                    <div className="col-12">
                        <label className="form-label">Photo</label>
                        <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={(event) =>
                                updateDraft(
                                    "photoFile",
                                    event.target.files?.[0] ?? null,
                                )
                            }
                            required
                        />
                    </div>
                    <div className="col-12">
                        <label className="form-label">Last Seen Location</label>
                        <LocationPickerMap
                            selectedLocation={draft.location}
                            onPickLocation={handlePickLocation}
                        />
                    </div>
                    <div className="col-12">
                        <label className="form-label">Last Seen Address</label>
                        <input
                            className="form-control"
                            value={draft.locationAddress}
                            onChange={(event) =>
                                updateDraft("locationAddress", event.target.value)
                            }
                            placeholder="Click the map to autofill, then edit if needed"
                            required
                        />
                    </div>
                    <div className="col-12">
                        {locationLoading && (
                            <StatusMessage
                                type="loading"
                                text="Resolving address from map click..."
                            />
                        )}
                        {locationError && (
                            <StatusMessage type="error" text={locationError} />
                        )}
                    </div>
                </div>
            </div>
            <div className="card-footer bg-transparent border-0 pb-4 px-4">
                <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={!canSubmit || submitting}
                >
                    {submitting ? "Submitting..." : "Submit Report"}
                </button>
            </div>
        </form>
    );
};
