import { Link } from "react-router-dom";

// show this page when the route does not exist
export const NotFoundPage = () => {
    return (
        <section className="card border-0 shadow-sm">
            <div className="card-body">
                <h1 className="h3">Page Not Found</h1>
                <p className="text-secondary">The page you requested does not exist.</p>
                <Link to="/" className="btn btn-primary">
                    Back to Home
                </Link>
            </div>
        </section>
    );
};
