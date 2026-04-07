import { useNavigate } from "react-router-dom";
import { ReportForm } from "../components/ReportForm";
import { useCreateReport } from "../hooks/useCreateReport";

// connect the report form to the create report hook on this page
export const NewReportPage = () => {
    const navigate = useNavigate();
    const { submitting, error, pickAddress, submitReport } = useCreateReport();

    return (
        <section>
            <ReportForm
                submitting={submitting}
                submitError={error}
                onPickAddress={pickAddress}
                onSubmit={async (draft) => {
                    // leave the form only after the save actually works
                    const ok = await submitReport(draft);
                    if (ok) {
                        navigate("/reports");
                    }
                }}
            />
        </section>
    );
};
