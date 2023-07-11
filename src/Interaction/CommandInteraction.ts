import type { Interaction } from ".";
import {
  AnyInteractionChannel,
  Constants,
  InteractionContent,
  CommandInteraction as OceanicCommandInteraction,
  Uncached,
} from "oceanic.js";
import { InitialInteractionMessage } from "./InitialInteractionMessage";

export class CommandInteraction<
    T extends AnyInteractionChannel | Uncached =
      | AnyInteractionChannel
      | Uncached
  >
  extends OceanicCommandInteraction<T>
  implements Interaction
{
  static fromOceanicCommandInteraction(interaction: OceanicCommandInteraction) {
    const properties = Object.getOwnPropertyDescriptors(interaction);
    const extended = Object.create(this.prototype, properties);
    return extended;
  }

  /**
   * Identical to `super.defer()`. However, we recommend using `this.acknowledge()` for simplicity.
   */
  public override async defer(flags: number = 0): Promise<void> {
    await super.defer(flags);
  }

  public async acknowledge(
    ephemeral: boolean = false,
    suppressEmbeds: boolean = false
  ): Promise<InitialInteractionMessage> {
    const flags =
      (ephemeral ? Constants.MessageFlags.EPHEMERAL : 0) |
      (suppressEmbeds ? Constants.MessageFlags.SUPPRESS_EMBEDS : 0);
    await super.defer(flags);
    return new InitialInteractionMessage(this);
  }

  /**
   * Identical to `super.createMessage()`. However, we recommend using `this.createInitialMessage()` for simplicity.
   */
  public override async createMessage(data: InteractionContent) {
    await super.createMessage(data);
  }

  public async createInitialMessage(data: InteractionContent) {
    await super.createMessage(data);
    return new InitialInteractionMessage(this);
  }
}
