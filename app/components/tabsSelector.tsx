import { useState } from "react";
import tabStyle from '../styles/tabsSelector.module.css'
import { NavLink } from "react-router";
// import type { Route } from "./+types/tabSelector";

export function TabSelector({ tabs }: 
    // Route.ComponentProps
    { tabs: {id: string, label: string, to: string, end?:boolean }[];}
)

    {
    // const [activeTab, setActiveTab] = useState(tabs[0].id);

    // console.log("TabSelector rendering, activeTab:", activeTab);

    return (
            <nav>
                {tabs.map((tab) => (
                    <NavLink
                        key={tab.id}
                        to={tab.to}
                        end={tab.end}
                        onClick={() => {
                            console.log("Clicked tab:", tab.id);
                            console.log("Path is:", tab.to)
                        }}
                    >
                        {({ isActive }) => (
                            <span
                                className={`
                                    ${tabStyle.tab}
                                    ${ isActive ? tabStyle.active : tabStyle.inactive}
                        `}>
                                {tab.label}
                            </span>
                        )}   
                    </NavLink>
                ))}
            </nav>
    )
}