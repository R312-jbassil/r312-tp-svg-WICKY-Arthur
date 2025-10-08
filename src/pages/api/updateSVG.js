import pb from "../../utils/pb";
import { Collections } from "../../utils/pocketbase-types";

export async function POST({ request }) {
    const data = await request.json();
    console.log("Received data to update:", data);

    try {
        // Vérifier que l'ID est fourni
        if (!data.id) {
            throw new Error("ID is required for updating a record");
        }

        // Extraire l'ID et les autres données à mettre à jour
        const { id, ...updateData } = data;

        // Mettre à jour l'enregistrement SVG avec l'ID spécifié
        const record = await pb
            .collection(Collections.Svg)
            .update(id, updateData);

        console.log("SVG updated with ID:", record.id);

        return new Response(JSON.stringify({
            success: true,
            id: record.id,
            message: "SVG updated successfully"
        }), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error updating SVG:", error);
        return new Response(JSON.stringify({
            success: false,
            error: error.message
        }), {
            headers: { "Content-Type": "application/json" },
            status: 400, // Bad Request pour une erreur client
        });
    }
}