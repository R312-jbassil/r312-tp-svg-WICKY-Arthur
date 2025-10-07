import pb from "../../utils/pb";
import { Collections } from "../../utils/pocketbase-types";

export const POST = async ({ request, cookies }) => {
    try {
        // Récupère les données d'inscription envoyées dans la requête
        const { email, password, name } = await request.json();

        // Crée un nouvel utilisateur dans PocketBase
        const data = {
            email: email,
            password: password,
            passwordConfirm: password, // PocketBase requiert une confirmation du mot de passe
            name: name,
        };

        // Création du compte utilisateur
        const newUser = await pb.collection(Collections.Users).create(data);
        console.log(newUser)
        // Authentifie l'utilisateur immédiatement après l'inscription
        const authData = await pb.collection(Collections.Users).authWithPassword(email, password);
        console.log(authData)
        // Enregistre le token d'authentification dans un cookie sécurisé
        cookies.set("pb_auth", pb.authStore.exportToCookie(), {
            path: "/", // Le cookie est valide sur tout le site
            httpOnly: true, // Empêche l'accès au cookie côté client (JavaScript)
            sameSite: "strict", // Limite le cookie aux requêtes du même site pour plus de sécurité
            expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Expire dans 1 an
        });

        // Retourne les informations de l'utilisateur créé et authentifié
        return new Response(JSON.stringify({ user: authData.record }), { status: 200 });
    } catch (err) {
        console.error("Erreur d'inscription :", err);

        // Gestion des différentes erreurs possibles
        if (err.response && err.response.message) {
            return new Response(
                JSON.stringify({
                    message: err.response.message,
                    data: err.response.data
                }),
                { status: 400 }
            );
        }

        // Erreur générique
        return new Response(
            JSON.stringify({ message: "Impossible de créer le compte" }),
            { status: 500 }
        );
    }
};