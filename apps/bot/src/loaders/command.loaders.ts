import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import type { Client } from 'discord.js';

import type { Command } from '../types/command.js';

import { validateCommand } from "../guards/command.guard.js";

export async function loadCommands(
    client: Client & { commands?: Map<string, Command> },
    commandsPath: string = path.resolve(process.cwd(), "apps/bot/src/commands"),
): Promise<void> {
    client.commands = new Map();

    if (!fs.existsSync(commandsPath)) {
        throw new Error(`[WARBLE] Le dossier des commandes est introuvable : ${commandsPath}`);
    }

    const categories = fs.readdirSync(commandsPath, { withFileTypes: true })
            .filter((entry) => entry.isDirectory());

    console.log("────────────────────────────────");
    console.log("[WARBLE] Chargement des commandes");
    console.log("────────────────────────────────");

    for (const category of categories) {
        const categoryPath = path.join(commandsPath, category.name);

        const files = fs.readdirSync(categoryPath)
                .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

        for (const file of files) {
            const filePath = path.join(categoryPath, file);
            let command: Command;

            try {
                const moduleUrl = pathToFileURL(filePath).href;

                const imported = await import(
                    `${moduleUrl}?update=${Date.now()}`
                );

                command = imported.default as Command;
            } catch (error) {
                console.error(
                    `[WARBLE] Impossible de charger ${file} :`,
                    error,
                );

                continue;
            }

            try {
                validateCommand(command, file);
            } catch (error) {
                console.error(error);
                continue;
            }

            if (!command?.name) {
                console.warn(`[WARBLE] ${file} ignoré : aucun nom défini.`);
                continue;
            }

            if (command.enabled === false) {
                console.log(`[WARBLE] ${command.name} désactivée.`);
                continue;
            }

            if (client.commands.has(command.name)) {
                console.warn(`[WARBLE] Doublon détecté : ${command.name}`);
                continue;
            }

            command.category = category.name;

            client.commands.set(command.name, command);

            console.log(`[WARBLE] ${category.name} → ${command.name}`);
        }
    }
    console.log(`[WARBLE] ${client.commands.size} commande(s) chargée(s).`);
}