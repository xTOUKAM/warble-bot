import {
    MessageFlags,
} from "discord.js";

import type { Command } from "../../types/command.js";

const command: Command = {
    name: "ping",
    description: "Affiche la latence du bot.",
    enabled: true,
    dm: true,
    permissions: null,
    botPermissions: null,
    cooldown: 3,

    async execute(interaction) { const websocketPing = interaction.client.ws.ping;
        await interaction.reply({
            content: `Pong ! Latence Discord : ${websocketPing} ms`,
            flags: MessageFlags.Ephemeral,
        });
    },
};

export default command;