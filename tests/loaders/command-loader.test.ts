import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { GatewayIntentBits } from "discord.js";

import { WarbleClient } from "../../apps/bot/src/types/client";
import { loadCommands } from "../../apps/bot/src/loaders/command.loaders";

describe("CommandLoader", () => {
    let client: WarbleClient;
    let tempDir: string;

    beforeEach(() => {
        client = new WarbleClient({ intents: [GatewayIntentBits.Guilds] });
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "command-loader-"));

        vi.spyOn(console, "log").mockImplementation(() => {});
        vi.spyOn(console, "warn").mockImplementation(() => {});
        vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        client.destroy();

        fs.rmSync(tempDir, { recursive: true, force: true });
        vi.restoreAllMocks();
    });

    it("Charge une commande valide", async () => {
        createCommand("utility", "ping.ts", `
                    export default {
                        name: "ping",
                        description: "Affiche la latence du bot.",
                        enabled: true,
                        dm: true,
                        execute: async () => {}
                    };`);
        await loadCommands(client, tempDir);
        expect(client.commands.size).toBe(1);
        expect(client.commands.has("ping")).toBe(true);

        const ping = client.commands.get("ping");
        expect(ping?.name).toBe("ping");
        expect(ping?.description).toBe("Affiche la latence du bot.");
        expect(ping?.enabled).toBe(true);
        expect(ping?.dm).toBe(true);
        expect(typeof ping?.execute).toBe("function");
        expect(ping?.category).toBe("utility");
    });

    it("Ignore une commande désactivée", async () => {
        createCommand("utility", "disabled.ts", `
                    export default {
                        name: "disabled",
                        description: "Commande désactivée.",
                        enabled: false,
                        dm: true,
                        execute: async () => {}
                    };`);
        await loadCommands(client, tempDir);
        expect(client.commands.size).toBe(0);
        expect(console.log).toHaveBeenCalledWith("[WARBLE] disabled désactivée.");
    });

    it("Ignore une commande invalide", async () => {
        createCommand("utility", "invalid.ts", `
                    export default {
                        description: "Commande invalide.",
                        enabled: true,
                        dm: true,
                        execute: async () => {}
                    };`);
        await loadCommands(client, tempDir);
        expect(client.commands.size).toBe(0);
    });

    it("Ignore une commande avec le nom manquant", async () => {
        createCommand("utility", "noname.ts", `
                    export default {
                        description: "Commande sans nom.",
                        enabled: true,
                        dm: true,
                        execute: async () => {}
                    };`);
        await loadCommands(client, tempDir);
        expect(client.commands.size).toBe(0);
    });

    it("Ignore une commande avec un doublon", async () => {
        createCommand("utility", "ping1.ts", `
                    export default {
                        name: "ping",
                        description: "Commande ping 1.",
                        enabled: true,
                        dm: true,
                        execute: async () => {}
                    };`);
        createCommand("utility", "ping2.ts", `
                    export default {
                        name: "ping",
                        description: "Commande ping 2.",
                        enabled: true,
                        dm: true,
                        execute: async () => {}
                    };`);
        await loadCommands(client, tempDir);
        expect(client.commands.size).toBe(1);
    });

    it("Continue de charger les autres commandes même si une commande échoue à l'importation", async () => {
        createCommand("utility", "valid.ts", `
                    export default {
                        name: "valid",
                        description: "Commande valide.",
                        enabled: true,
                        dm: true,
                        execute: async () => {}
                    };`);
        createCommand("utility", "invalid.ts", `
                    export default {
                        name: "",
                        description: "Commande invalide.",
                        enabled: true,
                        dm: true,
                        execute: async () => {}
                    };`);

        createCommand("utility", "valid2.ts", `
                    export default {
                        name: "valid2",
                        description: "Commande valide 2.",
                        enabled: true,
                        dm: true,
                        execute: async () => {}
                    };`);
        await loadCommands(client, tempDir);
        expect(client.commands.size).toBe(2);
        expect(client.commands.has("valid")).toBe(true);
        expect(client.commands.has("valid2")).toBe(true);
    });

    it("Ne charge pas les fichiers non .ts ou .js", async () => {
        createCommand("utility", "ping.txt", `
                    export default {
                        name: "ping",
                        description: "Commande ping.",
                        enabled: true,
                        dm: true,
                        execute: async () => {}
                    };`);
        await loadCommands(client, tempDir);
        expect(client.commands.size).toBe(0);
    });

    it("Lève une exception si le dossier des commandes n'existe pas", async () => {
        const nonExistentPath = path.join(tempDir, "nonexistent");
        await expect(loadCommands(client, nonExistentPath)).rejects.toThrow(
            `[WARBLE] Le dossier des commandes est introuvable : ${nonExistentPath}`,
        );
    });

    function createCommand(category: string, filename: string, content: string): void {
        const categoryPath =
            path.join(tempDir, category);
        fs.mkdirSync(categoryPath, { recursive: true });
        fs.writeFileSync(path.join(categoryPath, filename),
            content,
            "utf8",
        );
    }
});

