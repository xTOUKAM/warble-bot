import { PermissionsBitField, REST, Routes, SlashCommandBuilder } from "discord.js";
import type { Client } from "discord.js";

import type { Command, CommandOption } from "../types/command.js";

function addOption(builder: SlashCommandBuilder, option: CommandOption): SlashCommandBuilder {
    switch (
        option.type
    ) {
        case "string":
            builder.addStringOption((slashOption) => slashOption
                .setName(option.name)
                .setDescription(option.description)
                .setRequired(option.required ?? false)
                .setAutocomplete(option.autocomplete ?? false),
            );
            break;

        case "integer":
            builder.addIntegerOption((slashOption) => slashOption
                .setName(option.name)
                .setDescription(option.description)
                .setRequired(option.required ?? false)
                .setAutocomplete(option.autocomplete ?? false),
            );
            break;

        case "number":
            builder.addNumberOption((slashOption) => slashOption
                .setName(option.name)
                .setDescription(option.description)
                .setRequired(option.required ?? false)
                .setAutocomplete(option.autocomplete ?? false),
            );
            break;

        case "boolean":
            builder.addBooleanOption((slashOption) => slashOption
                .setName(option.name)
                .setDescription(option.description)
                .setRequired(option.required ?? false),
            );
            break;

        case "user":
            builder.addUserOption((slashOption) => slashOption
                .setName(option.name)
                .setDescription(option.description)
                .setRequired(option.required ?? false),
            );
            break;

        case "channel":
            builder.addChannelOption((slashOption) => slashOption
                .setName(option.name)
                .setDescription(option.description)
                .setRequired(option.required ?? false),
            );
            break;

        case "role":
            builder.addRoleOption((slashOption) => slashOption
                .setName(option.name)
                .setDescription(option.description)
                .setRequired(option.required ?? false),
            );
            break;

        case "mentionable":
            builder.addMentionableOption((slashOption) => slashOption
                .setName(option.name)
                .setDescription(option.description)
                .setRequired(option.required ?? false),
            );
            break;

        case "attachment":
            builder.addAttachmentOption((slashOption) => slashOption
                .setName(option.name)
                .setDescription(option.description)
                .setRequired(option.required ?? false),
            );
            break;
    }
    return builder;
}

export async function deploySlashCommands(client: Client & { commands?: Map<string, Command> }, token: string): Promise<void> {
    if (!client.user) {
        throw new Error("Le client Discord n'est pas connecté.");
    }

    if (!client.commands) {
        throw new Error("Les commandes ne sont pas chargées.");
    }

    const slashCommands = [];

    for (const command of client.commands.values()) {
        const slash = new SlashCommandBuilder()
                .setName(command.name)
                .setDescription(command.description)
                .setDMPermission(command.dm ?? false );

        if (command.permissions) {
            slash.setDefaultMemberPermissions(PermissionsBitField.resolve(command.permissions));
        }

        if (command.options) {
            for (const option of command.options) {
                addOption(slash, option);
            }
        }

        slashCommands.push(slash.toJSON());
    }

    const rest =
        new REST({version: "10"}).setToken(token);

    await rest.put(Routes.applicationCommands(client.user.id), { body: slashCommands });
    console.log(`[WARBLE] ${slashCommands.length} slash command(s) déployée(s).`);
}