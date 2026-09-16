import type { ChatInputCommandInteraction, PermissionResolvable } from 'discord.js';

export type CommandOptionType = | "string" | "integer" | "boolean" | "user"
    | "channel" | "role"  | "mentionable" | "number" | "attachment";

export interface CommandOption {
    type: CommandOptionType;
    name: string;
    description: string;
    required?: boolean;
    autocomplete?: boolean;
}

export interface Command {
    name: string;
    description: string;
    enabled?: boolean;
    dm?: boolean;
    permissions?: PermissionResolvable | null;
    botPermissions?: PermissionResolvable | null;
    options?: CommandOption[];
    cooldown?: number;
    category?: string;
    
    execute(interaction: ChatInputCommandInteraction): Promise<void>;
}