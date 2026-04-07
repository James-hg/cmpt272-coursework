import { useState } from "react";
import type { SyntheticEvent } from "react";

interface FoundStatusPanelProps {
    loading: boolean;
    error: string | null;
    onSubmit: (password: string) => Promise<boolean>;
}

export const FoundStatusPanel = ({
    loading,
    error,
    onSubmit,
}: FoundStatusPanelProps) => {
    const [password, setPassword] = useState("");

    // stop the page reload and send the password to the parent page
    const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        const ok = await onSubmit(password);
        if (ok) {
            // clear the input after a successful update
            setPassword("");
        }
    };

    return (
        <div className="card border-warning">
            <div className="card-body">
                <h2 className="h5">Mark as Found</h2>
                <p className="text-secondary mb-2">
                    Enter the report password to confirm.
                </p>
                {error && <div className="alert alert-danger py-2">{error}</div>}
                <form onSubmit={handleSubmit} className="d-flex gap-2">
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                        disabled={loading}
                    />
                    <button className="btn btn-warning" disabled={loading} type="submit">
                        {loading ? "Checking..." : "Confirm"}
                    </button>
                </form>
            </div>
        </div>
    );
};
