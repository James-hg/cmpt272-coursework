import { Navigate, Route, Routes } from "react-router-dom";
import { AppNavbar } from "./components/AppNavbar";
import { BrowsePage } from "./pages/BrowsePage";
import { HomePage } from "./pages/HomePage";
import { NewReportPage } from "./pages/NewReportPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ReportDetailPage } from "./pages/ReportDetailPage";

// set up the main page routes here
function App() {
    return (
        <div className="app-shell">
            <AppNavbar />
            <main className="container py-4">
                <Routes>
                    {/* show the home page map here */}
                    <Route path="/" element={<HomePage />} />
                    {/* show the browse page here */}
                    <Route path="/reports" element={<BrowsePage />} />
                    {/* show the new report form here */}
                    <Route path="/reports/new" element={<NewReportPage />} />
                    <Route
                        path="/reports/:reportId"
                        element={<ReportDetailPage />}
                    />
                    <Route path="/404" element={<NotFoundPage />} />
                    <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
