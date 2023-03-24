import { BaseCommand } from "./BaseCommand";
import type { CommandInteraction } from "../Interaction/CommandInteraction";

export abstract class RunnableCommand extends BaseCommand {
  public abstract run(interaction: CommandInteraction): void | Promise<void>;
}
