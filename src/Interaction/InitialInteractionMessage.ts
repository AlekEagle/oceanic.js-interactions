import { CommandInteraction, Constants, InteractionContent } from "oceanic.js";

export class InitialInteractionMessage {
  public constructor(public readonly interaction: CommandInteraction) {}

  public async edit(data: InteractionContent) {
    await this.interaction.editOriginal(data);
  }

  public async delete() {
    await this.interaction.deleteOriginal();
  }

  public async isEphemeral() {
    const message = await this.interaction.getOriginal();
    return message.flags & Constants.MessageFlags.EPHEMERAL;
  }

  public async suppressesEmbeds() {
    const message = await this.interaction.getOriginal();
    return message.flags & Constants.MessageFlags.SUPPRESS_EMBEDS;
  }
}
