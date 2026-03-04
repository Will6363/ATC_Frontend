// import { database } from "~/database/context";
// import * as schema from "~/database/schema";

import type { Route } from "./+types/home";
// import { Welcome } from "../welcome/welcome";
import { TabSelector } from "~/components/tabsSelector";
import { Outlet } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

const tabsArray = [
  { id: 'manufacturers', label: 'Manufacture', to: '/manufacturers' },
  { id: 'engines', label: 'Engine', to:'/engines' },
  { id: 'models', label: 'Model', to:'/models' }
]

export default function Home({}: Route.ComponentProps) {
  return (
    <>
    <TabSelector
      tabs={ tabsArray }
    />
    <div className="main-content">
      <Outlet />
    </div>
    </>
  );
}
