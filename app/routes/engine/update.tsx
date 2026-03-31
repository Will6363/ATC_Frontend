import { eq } from "drizzle-orm";
import { database } from "~/database/context";
import { engines } from "~/database/schema";
import type { Route } from "./+types/delete";
import { Form, useNavigation, useActionData } from "react-router";
import { useState, useEffect } from "react";
import tableStyles from "~/styles/tableStyles.module.css";
import textStyles from "~/styles/textStyles.module.css";

// Loader loads existing engine rows from the database so we can display them in the table
export async function loader({ context }: any) {
    const db = database();

    try {
        const engineRows = await db.query.engines.findMany({
            columns: {
                name: true,
                manufacturer: true,
                type: true,
            },
        });

        return {
            engines: engineRows,
            message: "",
            dbError: false,
        };
    } catch (error) {
        console.error("Engines loader failed", error);

        return {
            engines: [],
            message: "Unable to fetch engines from database.",
            dbError: true,
        };
    }
}

// Action runs when the update form is submitted
export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const action = formData.get("_action");

    if (action !== "updateEngine") {
        return {
            success: false,
            message: "Unsupported action.",
        };
    }

    const name = formData.get("name");
    const manufacturer = formData.get("manufacturer");
    const type = formData.get("type");

    if (typeof name !== "string" || !name.trim()) {
        return { success: false, message: "Engine name is required." };
    }

    if (typeof manufacturer !== "string" || !manufacturer.trim()) {
        return { success: false, message: "Manufacturer is required." };
    }

    if (typeof type !== "string" || !type.trim()) {
        return { success: false, message: "Type is required." };
    }

    const db = database();

    try {
        await db.update(engines)
            .set({ manufacturer: manufacturer.trim(), type: type.trim() })
            .where(eq(engines.name, name.trim()));

        return {
            success: true,
            message: `Engine '${name.trim()}' updated successfully.`,
        };
    } catch (error) {
        console.error("Unable to update engine", error);

        if (error instanceof Error && (error.message.toLowerCase().includes("econnrefused") || error.message.toLowerCase().includes("connection refused"))) {
            return {
                success: false,
                message: "Unable to connect to the database. Please try again later.",
            };
        }

        return {
            success: false,
            message: "Unable to update engine. Please try again.",
        };
    }
}

// Main page component renders table, checkboxes, and submit button 
export default function EnginesUpdate({ loaderData }: any) {
    const navigation = useNavigation();
    const actionData = useActionData();

    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const [editableEngine, setEditableEngine] = useState<{ name: string; manufacturer: string; type: string } | null>(null);
    const [manufacturer, setManufacturer] = useState("");
    const [type, setType] = useState("");

    const enginesList = (loaderData?.engines ?? []) as Array<{ name: string; manufacturer?: string; type?: string }>;
    const dbError = loaderData?.dbError;
    const message = actionData?.message ?? loaderData?.message;

    const openEngineEditor = (engine: { name: string; manufacturer?: string; type?: string }) => {
        setEditableEngine({
            name: engine.name,
            manufacturer: engine.manufacturer ?? "",
            type: engine.type ?? "",
        });
        setManufacturer(engine.manufacturer ?? "");
        setType(engine.type ?? "");
        setIsOverlayOpen(true);
    };

    const closeOverlay = () => {
        setIsOverlayOpen(false);
        setEditableEngine(null);
    };

    useEffect(() => {
        if (actionData?.success) {
            closeOverlay();
        }
    }, [actionData]);

    return (
        <div className="engines-page">
            <h1>Update Engines</h1>
            <p>Select a row and click "Edit" to update the engine fields.</p>
            {dbError ? (
                <p className={textStyles["error-message"]} role="alert">
                    {message}
                </p>
            ) : (
                <Form method="post" className={tableStyles["database-content"]}>
                    <table>
                        <thead>
                            <tr>
                                <th>Action</th>
                                <th>Name</th>
                                <th>Manufacturer</th>
                                <th>Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enginesList.map((engine) => (
                                <tr key={engine.name}>
                                    <td>
                                        <button
                                            type="button"
                                            onClick={() => openEngineEditor(engine)}
                                            className={tableStyles["submit-button"]}
                                        >
                                            Edit
                                        </button>
                                    </td>
                                    <td>{engine.name}</td>
                                    <td>{engine.manufacturer ?? ""}</td>
                                    <td>{engine.type ?? ""}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* TODO: Add confirmation dialog!! */}

                    {message && (
                        <p className={actionData?.success
                         ? textStyles["success-message"]
                         : textStyles["error-message"]} role="status">
                            {message}
                        </p>
                    )}
                </Form>
            )}
            {isOverlayOpen && editableEngine && (
                <div className={tableStyles["overlay"]} role="dialog" aria-modal="true" aria-labelledby="update-engine-title">
                    <div className={tableStyles["overlay-content"]}>
                        <h2 id="update-engine-title">Update Engine - {editableEngine.name}</h2>
                        <Form method="post">
                            <input type="hidden" name="_action" value="updateEngine" />
                            <input type="hidden" name="name" value={editableEngine.name} />
                            <div>
                                <label htmlFor="engine-name">Name:</label>
                                <input
                                    id="engine-name"
                                    type="text"
                                    name="displayName"
                                    value={editableEngine.name}
                                    disabled
                                    className={tableStyles["input-field"]}
                                />
                            </div>
                            <div>
                                <label htmlFor="engine-manufacturer">Manufacturer:</label>
                                <input
                                    id="engine-manufacturer"
                                    type="text"
                                    name="manufacturer"
                                    value={manufacturer}
                                    onChange={(e) => setManufacturer(e.target.value)}
                                    className={tableStyles["input-field"]}
                                />
                            </div>
                            <div>
                                <label htmlFor="engine-type">Type:</label>
                                <input
                                    id="engine-type"
                                    type="text"
                                    name="type"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className={tableStyles["input-field"]}
                                />
                            </div>
                            <div className={tableStyles["confirmation-buttons"]}>
                                <button type="submit" className={tableStyles["submit-button"]}>
                                    {navigation.state === "submitting" ? "Saving..." : "Save Changes"}
                                </button>
                                <button type="button" onClick={closeOverlay} className={tableStyles["cancel-button"]}>
                                    Cancel
                                </button>
                            </div>
                        </Form>
                    </div>
                </div>
            )}
        </div>
    );
}
