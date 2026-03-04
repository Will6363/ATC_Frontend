import { NavLink, Outlet } from "react-router";
import { TabSelector } from "~/components/tabsSelector";

export default function RootLayout() {
    const tabs = [
        { id: 'aboutTab', label: "About", to:"about" },
        { id: 'manufacturersTab', label: "Manufacturers", to: "manufacturers" },
        { id: 'enginesTab', label: "Engines", to: "engines" },
    ];

    return (
        <div className="root-layout">
            <TabSelector
                tabs = {tabs}
            />
            <div className="root-tab-content">
                <Outlet />
            </div>
            <NavLink
                key="HOME"
                to="/"
            >
                <h3>END</h3>
            </NavLink>
        </div>
    )
}