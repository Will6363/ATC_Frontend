import { database } from "~/database/context";
import { engines } from "~/database/schema";
import type { Route } from "./+types/create";
import { Form, useNavigation, useActionData } from "react-router";
import tableStyles from "../../styles/tableStyles.module.css";
import textStyle from "../../styles/textStyles.module.css";
import { useEffect, useRef } from "react";

export async function action({ request, context }: Route.ActionArgs) {

    const formData = await request.formData();

    let name = formData.get("name");
    let manufacturer = formData.get("manufacturer");
    let type = formData.get("type");

    //Type Check
    let errorMessage = "";
    if (typeof name !== "string" || !name.trim()) {
        errorMessage = "Name is required";
    } else if (typeof manufacturer !== "string" || !manufacturer.trim()) {
        errorMessage = "Manufacturer is required";
    } else if (typeof type !== "string" || !type.trim()) {
        errorMessage = "Type is required";
    }

    //Error Message set if any of the above checks fail
    if (errorMessage) {
        return {
            success: false,
            message: errorMessage,
        };
    }


    try {
        const db = database();

        // Insert new engine into the database
        const newEngine = await db.insert(engines).values({
            name,
            manufacturer,
            type,
        }).execute();

        return {
            success: true,
            name,
        };
        
    } catch (error) {
        console.error("Error inserting engine into database", error);

        // Type guard to check if error is an object with code property
        if (error instanceof Error) {
            console.log("ERROR INSTANCE DETECTED!!!");
            const errorMessage = error.message.toLowerCase();
            
            // Check error code property (common in database errors)
            if ('code' in error && error.code === 'ECONNREFUSED') {
                console.log("ECONNREFUSED detected - Connection refused");
                return {
                    success: false,
                    message: "Unable to connect to the database. Please check if PostgreSQL is running.",
                };
            } 
            // Check error message for duplicate key
            else if (errorMessage.includes("duplicate") || errorMessage.includes("unique")) {
                console.log("DUPLICATE ENTRY DETECTED!!!");
                return {
                    success: false,
                    message: `An engine with the name "${name}" already exists. Please use a different name.`,
                };
            } 
            // Fallback for other errors
            else {
                console.log("UNKNOWN ERROR TYPE DETECTED!!!",  error);
                return {
                    success: false,
                    message: "Unable to create engine. Please try again.",
                };
            }
        } else {
            // Fallback for other errors
            console.log("UNKNOWN ERROR TYPE DETECTED!!!",  error);
            return {
                success: false,
                message: "Unable to create engine. Please try again.",
            };
        }
    }
}

export default function EnginesCreate() {
    const navigation = useNavigation();
    const actionData = useActionData();
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (actionData?.success && navigation.state === "idle") {
            formRef.current?.reset();
        }
    }, [actionData, navigation.state]);

    return (
        <div className="engines-page">
            <p>Create Engines</p>
            <Form method="POST" ref={formRef}
                onSubmit={(event) => {
                if (navigation.state === "submitting") {
                  event.preventDefault();
                }
              }}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" className={tableStyles["input-field"]} />
                </div>
                <div>
                    <label htmlFor="manufacturer">Manufacturer:</label>
                    <input type="text" id="manufacturer" name="manufacturer" className={tableStyles["input-field"]} />
                </div>
                <div>
                    <label htmlFor="type">Type:</label>
                    <input type="text" id="type" name="type" className={tableStyles["input-field"]} />
                </div>
                <button type="submit" disabled={navigation.state === "submitting"} className={tableStyles["submit-button"]}>
                    {navigation.state === "submitting" ? "Creating..." : "Create Engine"}
                </button>
            </Form>
            {actionData?.success 
                ? <p>Successfully inserted engine: {actionData.name}</p>
                : actionData?.message && <p className={textStyle["error-message"]}>{actionData.message}</p>}
        </div>
    )
}