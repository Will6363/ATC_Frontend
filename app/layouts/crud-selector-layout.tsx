import { NavLink, Outlet, useLocation } from "react-router";
import { TabSelector } from "~/components/tabsSelector";

export default function CrudLayout() {
    const location = useLocation();

    const tabs = [
        { id: 'view', label: "view", to: "." , end:true},
        { id: 'create', label: "create", to: './create' },
        { id: 'update', label: "update", to: './update' },
        { id: 'delete', label: "delete", to: './delete' }
    ];

    return (
        <div className="crud-layout">
            <TabSelector
                tabs = {tabs}
            />
            <div className="crud-tab-content">
                <Outlet />
            </div>
        </div>
    )
}