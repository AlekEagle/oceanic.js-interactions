import type {
  ApplicationCommandOptionsSubCommand,
  ApplicationCommandOptionsSubCommandGroup,
  CreateChatInputApplicationCommandOptions,
  CreateMessageApplicationCommandOptions,
  CreateUserApplicationCommandOptions,
} from "oceanic.js";

export abstract class BaseCommand {
  public id: string | null = null;
  public abstract name: string;
  public abstract description: string;
  public abstract interactionObject:
    | CreateChatInputApplicationCommandOptions
    | CreateMessageApplicationCommandOptions
    | CreateUserApplicationCommandOptions
    | ApplicationCommandOptionsSubCommand
    | ApplicationCommandOptionsSubCommandGroup;
}
