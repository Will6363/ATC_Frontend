import { type RouteConfig, index, route, layout, prefix } from "@react-router/dev/routes";

export default [
    layout("layouts/root-layout.tsx", [
        index("routes/home.tsx"),
        route("about", "routes/about.tsx"),
        route("engines", "layouts/crud-selector-layout.tsx", [
            index("routes/engine/view.tsx"),
            route("create", "routes/engine/create.tsx"),
            route("update", "routes/engine/update.tsx"),
            route("delete", "routes/engine/delete.tsx"),
        ]),
        route("manufacturers", "layouts/crud-selector-layout.tsx", [
            index("routes/manufacturers/view.tsx"),
            route("create", "routes/manufacturers/create.tsx"),
            route("update", "routes/manufacturers/update.tsx"),
            route("delete", "routes/manufacturers/delete.tsx"),
        ]),
        
        route("*", "routes/notFoundPage.tsx")
    ])
] satisfies RouteConfig;