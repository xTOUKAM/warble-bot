import { describe, expect, it } from "vitest";
import command from "../../apps/bot/src/commands/utility/ping.js";

describe("/ping", () => {
    it("possède un nom", () => {
        expect(command.name).toBe("ping");
    });

    it("est activé", () => {
        expect(command.enabled).toBe(true);
    });

    it("possède execute ()", () => {
        expect(command.execute).toBeDefined();
    });

    it("possède une description", () => {
        expect(command.description).toBeDefined();
    });

    it("possède un cooldown", () => {
        expect(command.cooldown).toBeDefined();
    });

    it("possède des permissions", () => {
        expect(command.permissions).toBeDefined();
    });
})