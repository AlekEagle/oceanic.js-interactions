import {
  ApplicationCommandOptionsSubCommand,
  ApplicationCommandOptionsSubCommandGroup,
  Constants,
  InteractionOptionsSubCommandGroup,
} from "oceanic.js";
import type { BaseCommandData } from "./BaseCommand";
import { CommandInteractionType, RunnableCommand } from "./RunnableCommand";
import type { Subcommand } from "./Subcommand";

export class SubcommandGroup<
  O extends BaseCommandData = BaseCommandData
> extends RunnableCommand<O> {
  public subcommands: Subcommand[] = [];
  constructor(
    public name: string,
    public description: string,
    public options: O = {} as O
  ) {
    super();
  }

  public get interactionObject(): ApplicationCommandOptionsSubCommandGroup {
    return {
      type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
      name: this.name,
      description: this.description,
      options: this.subcommands.map(
        (command) => command.interactionObject
      ) as Array<ApplicationCommandOptionsSubCommand>,
      ...this.options,
    };
  }

  public addSubcommand(command: Subcommand) {
    this.subcommands.push(command);
  }

  public async run(interaction: CommandInteractionType<O>) {
    // Technically, a subcommand group can't be run, but we're using RunnableCommand to make it easier to handle subcommands in a hierarchical way.
    // Since we're in a subcommand group, we already know that what we're looking for is a subcommand.
    const subcommand = this.subcommands.find(
      (subcommand) =>
        subcommand.name ===
        (interaction.data.options.raw[0] as InteractionOptionsSubCommandGroup)
          .options![0].name
    );

    if (!subcommand)
      throw new Error("Subcommand not found, this should never happen.");

    await subcommand.run(interaction);
  }
}
