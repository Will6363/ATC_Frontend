import { eq } from "drizzle-orm";
import type { ActionFunctionArgs } from "react-router";
import { database } from "~/database/context";
import * as schema from "~/database/schema";

export async function action({ request }: ActionFunctionArgs) {

    const db = database();

    switch (request.method) {
        case "POST": 
            {
                const formData = await request.formData();
                let name = formData.get("name");
                let manufacturer = formData.get("manufacturer");
                let type = formData.get("type");
                let fuel = formData.get("fuel");
                let weight = formData.get("weight");
                let thrust = formData.get("thrust");

                // typecheck
                if (typeof name !== "string" 
                    || typeof manufacturer !== "string" 
                    || typeof type !== "string"
                    || typeof fuel !== "string"
                    || typeof weight !== "number"
                    || typeof thrust !== "number"
                ) {
                    return { engineError: "Params are missing or incorrectly typed." };
                }

                // trim string and check not empty
                name = name.trim();
                manufacturer = manufacturer.trim();
                type = type.trim();
                fuel = fuel.trim();
                if (!name || !manufacturer || !type || !fuel || !!weight || !!thrust) {
                    return { engineError: "Param values cannot be empty." };
                }

                // create db entry
                try {
                    await db.insert(schema.engines).values({ name, manufacturer, type, fuel, weight, thrust });
                } catch (error) {
                    return { engineError: "There was an error with adding entry into engine table." };
                }
            }
        case "PUT":
            break;
        case "DELETE":
            {
                const formData = await request.formData();
                let name = formData.get("name");
                
                // typecheck
                if (typeof name !== "string") {
                    return { engineError: "name is required" };
                }

                // trim string and check not empty
                name = name.trim();
                if (!name) {
                    return { engineError: "name is required" };
                }

                //TODO! UPDATE SCHEMA TO USE ARCHIVE INSTEAD OF DIRECT DELETION
                // delete engine entry
                try {
                    await db.delete(schema.engines).where(eq(schema.engines.name, name))
                } catch {
                    return { engineError: "Unable to delete engine from table" };
                }
            }
    }
}

// For Getting information from table
export async function loader({ context }: ActionFunctionArgs) {
    const db = database();

    console.log("loader running");

    const engines = await db.query.engines.findMany({
        columns: {
            name: true,
            manufacturer: true,
            type: true,
        },
    });

    console.log("Engines Found", engines);

    return {
        engines,
        message: context.VALUE_FROM_EXPRESS
    };
}