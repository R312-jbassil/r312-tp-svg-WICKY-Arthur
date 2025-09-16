// src/pages/api/generate-svg.js
import { OpenAI } from 'openai';

// Récupération des variables d'environnement
const HF_TOKEN = import.meta.env.HF_TOKEN;
const HF_URL = import.meta.env.HF_URL;
const NOM_MODEL = import.meta.env.NOM_MODEL;

// Définir le modèle à utiliser
// Vous devrez remplacer ceci par un modèle qui fonctionne avec l'API que vous utilisez

// Fonction exportée pour gérer les requêtes POST
export const POST = async ({ request }) => {
    try {
        console.log("API request received");

        // Extraction du prompt du corps de la requête
        const { prompt } = await request.json();
        console.log("Prompt received:", prompt);

        // Initialisation du client OpenAI avec l'URL de base et le token d'API
        const client = new OpenAI({
            baseURL: HF_URL,
            apiKey: HF_TOKEN,
        });

        console.log("Making API call to model:", NOM_MODEL);

        const chatCompletion = await client.chat.completions.create({
            model: NOM_MODEL,
            messages: [
                {
                    role: "system",
                    content: "You are an SVG code generator. Generate only valid SVG code for the following prompt. Include the full <svg> tag with appropriate dimensions and attributes. Do not include any explanation, just return the SVG code."
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            max_tokens: 1000, // Ajuster selon vos besoins
        });

        // Récupération du message généré par l'API
        const message = chatCompletion.choices[0].message.content || "";
        console.log('API response received, length:', message.length);

        // Recherche d'un élément SVG dans le message généré
        const svgMatch = message.match(/<svg[\s\S]*?<\/svg>/i);
        const svg = svgMatch ? svgMatch[0] : "";

        console.log('SVG found:', !!svg);

        // Retourne une réponse JSON contenant le SVG ou une chaîne vide
        return new Response(JSON.stringify({ svg }), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error in API:", error);

        return new Response(
            JSON.stringify({
                error: error.message,
                svg: ""
            }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        }
        );
    }
};