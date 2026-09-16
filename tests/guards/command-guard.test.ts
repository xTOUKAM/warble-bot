import { describe, expect, it } from "vitest";
import { validateCommand } from "../../apps/bot/src/guards/command.guard.js";

describe("validateCommand", () => {
        it("accepte une commande valide", () => {
            const command = {
                name: "ping",
                description: "Ping",
                execute: async () => {},
            };

            expect(() => validateCommand(command, "ping.ts")).not.toThrow();
        }),

        it("refuse une commande sans nom", () => {
            const command = {
                description: "Ping",
                execute: async () => {},
            };
            expect(() => validateCommand(command, "ping.ts")).toThrow();
        });

        it("refuse une commande sans execute", () => {
            const command = {
                name: "ping",
                description: "Ping",
            };
            
            expect(() => validateCommand(command, "ping.ts")).toThrow();
        });

        it("refuse les options dupliquées", () => {
            const command = {
                name: "test",
                description: "Test",
                options: [
                    {
                        type: "string",
                        name: "user",
                        description: "A",
                    },
                    {
                        type: "string",
                        name: "user",
                        description: "B",
                    },
                ],
                execute:
                    async () => {},
            };
            
            expect(() => validateCommand(command, "test.ts")).toThrow();
        });
    },
);