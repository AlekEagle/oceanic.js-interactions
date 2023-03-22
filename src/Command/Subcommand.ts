import {
  AnyTextChannel,
  ApplicationCommandOptionsSubCommand,
  CommandInteraction,
  Constants,
  InteractionOptionsSubCommand,
  TextableChannel,
} from "oceanic.js";
import { CommandInteractionType, RunnableCommand } from "./RunnableCommand";
import type { BaseCommandData } from "./BaseCommand";
import {
  OptionArgType,
  OptionTypes,
  ConvertInteractionOptions,
} from "./OptionBuilder";

export class Subcommand<
  O extends BaseCommandData = BaseCommandData,
  P extends { [option: string]: OptionTypes.AnyOption } = {
    [option: string]: OptionTypes.AnyOption;
  }
> extends RunnableCommand<O> {
  constructor(
    public name: string,
    public description: string,
    public options: O = {} as O,
    public params: P = {} as P,
    private handler: (
      args: OptionArgType<O, P>,
      interaction: CommandInteractionType<O>
    ) => void | Promise<void> = () => {}
  ) {
    super();
  }

  public get interactionObject(): ApplicationCommandOptionsSubCommand {
    return {
      type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
      name: this.name,
      description: this.description,
      options: Object.entries(this.params).map(([key, value]) => {
        return {
          name: key,
          description: value.description,
          type: value.type,
          required: value.required,
        };
      }),
      ...this.options,
    };
  }

  public async run(interaction: CommandInteractionType<O>) {
    let args: OptionArgType<O, P> = {} as OptionArgType<O, P>;
    // Check if this command is in a subcommand group.
    if (
      interaction.data.options.raw[0].type ===
      Constants.ApplicationCommandOptionTypes.SUB_COMMAND_GROUP
    ) {
      // If so, we need to get the subcommand group's options so we can get this subcommand's options and convert them to be passed to the handler.
      args = await ConvertInteractionOptions<O, P>(
        this.params,
        interaction,
        (
          interaction.data.options.raw[0]
            .options![0] as InteractionOptionsSubCommand
        ).options!
      );
    } else {
      // If not, we can just get the options and convert them to be passed to the handler.
      args = await ConvertInteractionOptions<O, P>(
        this.params,
        interaction,
        (interaction.data.options.raw[0] as InteractionOptionsSubCommand)
          .options!
      );
    }

    // Run the handler.
    await this.handler(args, interaction);
  }
}
