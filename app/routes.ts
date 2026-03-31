import { type RouteConfig, index, route, layout, prefix } from "@react-router/dev/routes";

export default [
    layout("layouts/root-layout.tsx", [
        index("routes/home.tsx"),
        route("about", "routes/about.tsx"),
        route("engines", "layouts/crud-selector-layout.tsx", {id: "engine-layout"}, [
            index("routes/engine/view.tsx"),
            route("create", "routes/engine/create.tsx"),
            route("update", "routes/engine/update.tsx"),
            route("delete", "routes/engine/delete.tsx"),
        ]),
        
        route("*", "routes/notFoundPage.tsx")
    ])
] satisfies RouteConfig;