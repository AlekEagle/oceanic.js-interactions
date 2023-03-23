import {
  CommandInteraction,
  Constants,
  TextableChannel,
  CreateChatInputApplicationCommandOptions,
  AnyTextChannel,
} from "oceanic.js";
import {
  OptionArgType,
  ConvertInteractionOptions,
  OptionKV,
} from "./OptionBuilder";

import type { BaseCommandData } from "./BaseCommand";
import { CommandInteractionType, RunnableCommand } from "./RunnableCommand";
import type { Subcommand } from "./Subcommand";
import type { SubcommandGroup } from "./SubcommandGroup";

export type SlashCommandHandler<
  O extends BaseCommandData,
  P extends OptionKV
> = (
  args: OptionArgType<O, P>,
  interaction: CommandInteractionType<O>
) => void | Promise<void>;

export class SlashCommand<
  O extends BaseCommandData = BaseCommandData,
  P extends OptionKV = OptionKV
> extends RunnableCommand<O> {
  private subcommands: Subcommand<O>[] = [];
  private subcommandGroups: SubcommandGroup<O>[] = [];
  constructor(
    public name: string,
    public description: string,
    public options: O = {} as O,
    public params: P = {} as P,
    private handler: SlashCommandHandler<O, P> = () => {}
  ) {
    super();
  }

  public get interactionObject(): CreateChatInputApplicationCommandOptions {
    // If subcommands or subcommand groups exist as well as parameters, throw an error.
    if (
      (this.subcommands.length > 0 || this.subcommandGroups.length > 0) &&
      Object.keys(this.params).length > 0
    )
      throw new Error(
        "Slash commands with subcommands or subcommand groups cannot have parameters."
      );
    return {
      type: Constants.ApplicationCommandTypes.CHAT_INPUT,
      name: this.name,
      description: this.description,
      options:
        Object.keys(this.params).length > 0
          ? Object.entries(this.params).map(([key, value]) => {
              return {
                name: key,
                ...value,
              };
            })
          : [
              ...this.subcommands.map((command) => command.interactionObject),
              ...this.subcommandGroups.map(
                (command) => command.interactionObject
              ),
            ],
      ...this.options,
    };
  }

  public async run(interaction: CommandInteractionType<O>) {
    // If there are no subcommands or subcommand groups, run the handler.
    if (this.subcommands.length === 0 && this.subcommandGroups.length === 0) {
      // Setup runtime blah blah blah.

      const options = await ConvertInteractionOptions(
        this.params,
        interaction,
        interaction.data.options.raw
      );

      await this.handler(options, interaction);
    } else {
      // Get the subcommand from the options, it could be in a subcommand group.
      if (
        interaction.data.options.raw[0].type ===
        Constants.ApplicationCommandOptionTypes.SUB_COMMAND_GROUP
      ) {
        // Find the subcommand group.
        const subcommandGroup = this.subcommandGroups.find(
          (subcommandGroup) =>
            subcommandGroup.name === interaction.data.options.raw[0].name
        );

        if (!subcommandGroup)
          throw new Error(
            "Subcommand group not found, this should never happen."
          );

        await subcommandGroup.run(interaction);
      } else if (
        interaction.data.options.raw[0].type ===
        Constants.ApplicationCommandOptionTypes.SUB_COMMAND
      ) {
        // Subcommand.
        const subcommand = this.subcommands.find(
          (subcommand) =>
            subcommand.name === interaction.data.options.raw[0].name
        );
        if (!subcommand)
          throw new Error("Subcommand not found, this should never happen.");

        await subcommand.run(interaction);
      }
    }
  }

  public addSubcommand(subcommand: Subcommand<O>) {
    this.subcommands.push(subcommand);
  }

  public addSubcommandGroup(subcommandGroup: SubcommandGroup<O>) {
    this.subcommandGroups.push(subcommandGroup);
  }
}
