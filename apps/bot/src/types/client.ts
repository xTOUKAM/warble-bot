import { Client } from 'discord.js';
import type { ClientOptions } from 'discord.js';
import type { Command } from './command.js';

export class WarbleClient extends Client {
    public commands = new Map<string, Command>();

    constructor(options: ClientOptions) {
        super(options);
    }
}