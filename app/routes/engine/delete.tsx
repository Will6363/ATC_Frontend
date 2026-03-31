import { eq } from "drizzle-orm";
import { database } from "~/database/context";
import { engines } from "~/database/schema";
import type { Route } from "./+types/delete";
import { Form, useNavigation, useActionData } from "react-router";
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

// Action runs when the delete form is submitted
export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();

    // Multiple checkboxes named 'selectedEngine'. getAll returns an array of selected values.
    const selected = formData.getAll("selectedEngine");

    // Type narrowing, map to string names and trim whitespace
    const selectedNames = selected
        .filter((value): value is string => typeof value === "string")
        .map((name) => name.trim())
        .filter(Boolean);

    if (selectedNames.length === 0) {
        return {
            success: false,
            message: "Please select at least one engine to delete.",
        };
    }

    const db = database();

    try {
        // Delete each selected engine by its name. This assumes `name` is a unique key.
        for (const name of selectedNames) {
            await db.delete(engines).where(eq(engines.name, name));
        }

        return {
            success: true,
            deletedCount: selectedNames.length,
            message: `Deleted ${selectedNames.length} engine(s).`,
        };
    } catch (error) {
        console.error("Unable to delete selected engines", error);

        return {
            success: false,
            message: "Unable to delete selected engines. Please try again.",
        };
    }
}

// Main page component renders table, checkboxes, and submit button 
export default function EnginesDelete({ loaderData }: any) {
    const navigation = useNavigation();
    const actionData = useActionData();

    const enginesList = (loaderData?.engines ?? []) as Array<{ name: string; manufacturer?: string; type?: string }>;
    const dbError = loaderData?.dbError;
    const message = actionData?.message ?? loaderData?.message;

    return (
        <div className="engines-page">
            <h1>Delete Engines</h1>
            <p>Select rows and click Delete to remove engines from the database.</p>

            {dbError ? (
                <p className={textStyles["error-message"]} role="alert">
                    {message}
                </p>
            ) : (
                <Form method="post" className={tableStyles["database-content"]}>
                    <table>
                        <thead>
                            <tr>
                                <th>Select</th>
                                <th>Name</th>
                                <th>Manufacturer</th>
                                <th>Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enginesList.map((engine) => (
                                <tr key={engine.name}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            name="selectedEngine"
                                            value={engine.name}
                                            aria-label={`Select engine ${engine.name}`}
                                        />
                                    </td>
                                    <td>{engine.name}</td>
                                    <td>{engine.manufacturer ?? ""}</td>
                                    <td>{engine.type ?? ""}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <button type="submit" disabled={navigation.state === "submitting"} className={tableStyles["submit-button"]}>
                        {navigation.state === "submitting" ? "Deleting..." : "Delete selected engines"}
                    </button>

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
        </div>
    );
}
