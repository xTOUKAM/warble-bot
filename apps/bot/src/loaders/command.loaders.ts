import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import type { Client } from 'discord.js';

import type { Command } from '../types/command.js';

export async function loadCommands(client: Client & { commands?: Map<string, Command>; }, ): Promise<void> {
    client.commands = new Map();

    const commandsPath = path.resolve(process.cwd(), "apps/bot/src/commands");

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
            const moduleUrl = pathToFileURL(filePath).href;
            const imported = await import(moduleUrl);

            const command = imported.default as Command;

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