import type {
  AnyTextChannelWithoutGroup,
  PrivateChannel,
  Uncached,
} from "oceanic.js";
import { BaseCommand, BaseCommandData } from "./BaseCommand";
import type { CommandInteraction } from "../Interaction/CommandInteraction";

export type CommandInteractionType<O extends BaseCommandData> =
  CommandInteraction<
    | (O["dmPermissions"] extends true
        ? AnyTextChannelWithoutGroup
        : Exclude<AnyTextChannelWithoutGroup, PrivateChannel>)
    | Uncached
  >;

export abstract class RunnableCommand<
  O extends BaseCommandData = BaseCommandData
> extends BaseCommand<O> {
  public abstract run(
    interaction: CommandInteractionType<O>
  ): void | Promise<void>;
}
