import {
    Events,
    GatewayIntentBits,
} from "discord.js";

import "dotenv/config";

const env = {
    discordToken: process.env.DISCORD_TOKEN ?? "",
};

import { logError } from "./errors/error-handler.js";

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
            logError("Erreur pendant l'initialisation", error);
            process.exit(1);
        }
    },
);

client.on(Events.Error, (error) => { logError("Erreur Discord", error) });
client.on(Events.ShardError, (error) => { logError("Erreur WebSocket Discord", error) });

process.on("unhandledRejection", (error) => { logError("Promise rejetée", error)});
process.on("uncaughtException",(error) => { logError("Exception non gérée", error)});

try {
    await client.login(env.discordToken);
} catch (error) {
    logError("Impossible de se connecter à Discord", error);
    process.exitCode = 1;
}