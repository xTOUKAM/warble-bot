import {
    GatewayIntentBits,
} from "discord.js";

import "dotenv/config";

const env = {
    discordToken: process.env.DISCORD_TOKEN ?? "",
};

import { WarbleClient } from "./types/client.js";

import { loadCommands } from "./loaders/command.loaders.js";
import { deploySlashCommands } from "./loaders/slash.loader.js";

import { registerInteractionHandler } from "./events/interaction-create.event.js";

const client =
    new WarbleClient({
        intents: [
            GatewayIntentBits.Guilds,
        ],
    });

registerInteractionHandler(client);

client.once("clientReady", async () => {
        console.log("────────────────────────────────");
        console.log(" Warble Bot");
        console.log("────────────────────────────────");
        console.log(` Connecté : ${client.user?.tag}`);
        console.log(` Serveurs : ${client.guilds.cache.size}`);
        console.log("────────────────────────────────");

        try {
            await loadCommands(client);
            await deploySlashCommands(client, env.discordToken);
        } catch (error) {
            console.error("[WARBLE] Erreur pendant l'initialisation :", error);
            process.exit(1);
        }
    },
);

client.on("error", (error) => { console.error("[WARBLE] Erreur Discord :", error) });

process.on("unhandledRejection", (error) => {
        console.error("[WARBLE] Promise rejetée :", error);
    },
);

process.on("uncaughtException", (error) => {
        console.error("[WARBLE] Exception non gérée :", error);
        process.exit(1);
    },
);

try {
    await client.login(env.discordToken);
} catch (error) {
    console.error("[WARBLE] Échec de connexion à Discord :", error);
    process.exit(1);
}