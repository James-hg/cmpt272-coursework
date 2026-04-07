interface StatusMessageProps {
    type: "loading" | "error" | "info";
    text: string;
}

// keep loading, error, and info messages in one simple component
export const StatusMessage = ({ type, text }: StatusMessageProps) => {
    if (type === "loading") {
        return (
            <div className="d-flex align-items-center gap-2 alert alert-secondary mb-3">
                <div className="spinner-border spinner-border-sm" role="status"></div>
                <span>{text}</span>
            </div>
        );
    }

    if (type === "error") {
        return <div className="alert alert-danger mb-3">{text}</div>;
    }

    return <div className="alert alert-info mb-3">{text}</div>;
};
