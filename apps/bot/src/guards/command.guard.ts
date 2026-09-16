import type { Command } from "../types/command.js";

export function validateCommand(command: unknown, filename: string): asserts command is Command {
    if (!command || typeof command !== "object") {
        throw new Error(`[WARBLE] ${filename} n'exporte pas une commande valide.`);
    }

    const candidate = command as Partial<Command>;

    if (!candidate.name || typeof candidate.name !== "string") {
        throw new Error(`[WARBLE] ${filename} : propriété "name" invalide.`);
    }

    if (!/^[a-z0-9_-]{1,32}$/.test(candidate.name)) {
        throw new Error(`[WARBLE] ${filename} : nom de commande invalide "${candidate.name}".`);
    }

    if (!candidate.description || typeof candidate.description !== "string") {
        throw new Error(`[WARBLE] ${filename} : description absente.`);
    }

    if (candidate.description.length > 100) {
        throw new Error(`[WARBLE] ${filename} : description trop longue.`);
    }

    if (typeof candidate.execute !== "function") {
        throw new Error(`[WARBLE] ${filename} : fonction execute() absente.`);
    }

    if (candidate.cooldown !== undefined && (typeof candidate.cooldown !== "number" || candidate.cooldown < 0)) {
        throw new Error(`[WARBLE] ${filename} : cooldown invalide.`);
    }

    if (candidate.options) {
        const names = new Set<string>();

        for (const option of candidate.options ) {
            if (names.has(option.name)) {
                throw new Error(`[WARBLE] ${filename} : option dupliquée "${option.name}".`);
            }
            
            names.add(option.name,);
        }
    }
}