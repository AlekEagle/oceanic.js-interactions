import type { ComponentTypes, ComponentInteraction } from "oceanic.js";
import { BaseComponent } from "./BaseComponent";

export type RunnableComponentHandler = (
  interaction: ComponentInteraction
) => Promise<void> | void;

export abstract class RunnableComponent<
  T extends ComponentTypes = ComponentTypes
> extends BaseComponent<T> {
  constructor(
    public customID: string,
    private handler?: RunnableComponentHandler
  ) {
    super();
  }

  public async run(interaction: ComponentInteraction) {
    if (this.handler) {
      this.handler(interaction);
    }
  }
}
