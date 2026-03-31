import type { Route } from "./+types/view";
import { database } from "~/database/context";
import tableStyles from "~/styles/tableStyles.module.css";
import textStyles from "~/styles/textStyles.module.css";

export async function loader({ context }: Route.LoaderArgs) {
    const db = database();

    console.log("loader running");

    try {
        const engines = await db.query.engines.findMany({
            columns: {
                name: true,
                manufacturer: true,
                type: true,
            },
        });

        console.log("Engines Found", engines);
        context.VALUE_FROM_EXPRESS = new Date().toLocaleTimeString();

        return {
            engines,
            message: context.VALUE_FROM_EXPRESS,
            dbError: false,
        };
    } catch (error) {
        console.error("Database connection error", error);

        return {
            engines: [],
            message: "Unable to connect to the database. Please try again later.",
            dbError: true,
        };
    }
}

export default function EnginesView({ loaderData }: Route.ComponentProps) {
    const { engines, message, dbError } = loaderData;

    return (
        <div className="engines-page">
            <p>View Engines</p>
            {dbError ? (
                <p className={textStyles["error-message"]} role="alert">
                    {message}
                </p>
            ) : (
                <div className={tableStyles["database-content"]}>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Manufacturer</th>
                                <th>Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {engines.map((engine) => (
                                <tr key={engine.name}>
                                    <td>{engine.name}</td>
                                    <td>{engine.manufacturer}</td>
                                    <td>{engine.type}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p>{message}</p>
                </div>
            )}
        </div>
    );
}