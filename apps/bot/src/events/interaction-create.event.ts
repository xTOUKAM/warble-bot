import { Events, MessageFlags } from "discord.js";
import type { InteractionReplyOptions } from "discord.js";
import type { WarbleClient } from "../types/client.js";

export function registerInteractionHandler(client: WarbleClient ): void {
    client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isChatInputCommand()) {
            return;
        }
        
        const command = client.commands.get(interaction.commandName);

        if (!command) {
            console.warn(`[WARBLE] Commande introuvable : ${interaction.commandName}`);
            return;
        }

        if (command.enabled === false) {
            await interaction.reply({ content: "Cette commande est actuellement désactivée.", 
                flags: MessageFlags.Ephemeral
            });
            return;
        }

        if (command.dm === false && !interaction.inGuild()) {
            await interaction.reply({ content: "Cette commande ne peut être utilisée que dans un serveur.",
                    flags: MessageFlags.Ephemeral
            });
            return;
        }

        if (command.permissions && interaction.inGuild()) {
            const memberPermissions = interaction.memberPermissions;
            
            if (!memberPermissions?.has(command.permissions)) {
                await interaction.reply({ content: "Vous n'avez pas la permission nécessaire pour utiliser cette commande.",
                    flags: MessageFlags.Ephemeral
                });
                return;
            }
        }

        if (command.botPermissions && interaction.inGuild()) {
            const guild = interaction.guild;
            if (!guild) return;
            
            const me = guild.members.me;

            if (!me?.permissions.has(command.botPermissions)) {
                await interaction.reply({ content: "Le bot ne possède pas les permissions nécessaires pour exécuter cette commande.",
                    flags: MessageFlags.Ephemeral,
                });
                return;
            }
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`[WARBLE] Erreur pendant l'exécution de /${interaction.commandName} :`, error);
            
            const errorMessage: InteractionReplyOptions = { content: " Une erreur est survenue pendant l'exécution de la commande.",
                flags: MessageFlags.Ephemeral,
            };

            if (interaction.replied || interaction.deferred ) {
                await interaction.followUp(errorMessage);
            } else {
                await interaction.reply(errorMessage);
            }
        }
    });
}