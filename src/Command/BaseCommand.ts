import type {
  ApplicationCommandOptionsSubCommand,
  ApplicationCommandOptionsSubCommandGroup,
  CreateChatInputApplicationCommandOptions,
  CreateMessageApplicationCommandOptions,
  CreateUserApplicationCommandOptions,
} from "oceanic.js";

export type BaseCommandData = {
  defaultMemberPermissions?: string;
  nsfw?: boolean;
  dmPermissions?: boolean;
};

export abstract class BaseCommand<O extends BaseCommandData = BaseCommandData> {
  public id: string | null = null;
  public abstract name: string;
  public abstract description: string;
  public abstract options: O;
  public abstract interactionObject:
    | CreateChatInputApplicationCommandOptions
    | CreateMessageApplicationCommandOptions
    | CreateUserApplicationCommandOptions
    | ApplicationCommandOptionsSubCommand
    | ApplicationCommandOptionsSubCommandGroup;
}
