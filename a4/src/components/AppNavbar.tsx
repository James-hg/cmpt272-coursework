import { NavLink } from "react-router-dom";

const getClassName = ({ isActive }: { isActive: boolean }) =>
    `nav-link ${isActive ? "active" : ""}`;

export const AppNavbar = () => {
    return (
        <nav className="navbar navbar-expand navbar-dark app-navbar">
            <div className="container">
                <NavLink to="/" className="navbar-brand fw-bold">
                    TailBlazer
                </NavLink>
                <ul className="navbar-nav ms-auto">
                    <li className="nav-item">
                        <NavLink to="/" className={getClassName}>
                            Map
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/reports" className={getClassName}>
                            Browse
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/reports/new" className={getClassName}>
                            New Report
                        </NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    );
};
