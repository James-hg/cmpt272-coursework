import { useNavigate } from "react-router-dom";
import { ReportForm } from "../components/ReportForm";
import { useCreateReport } from "../hooks/useCreateReport";

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
                    const ok = await submitReport(draft);
                    if (ok) {
                        navigate("/reports");
                    }
                }}
            />
        </section>
    );
};
