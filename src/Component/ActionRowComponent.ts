import {
  Constants,
  ComponentTypes,
  MessageActionRowComponent,
} from "oceanic.js";
import { BaseComponent } from "./BaseComponent";

export class ActionRowComponent extends BaseComponent {
  public type: Constants.ComponentTypes.ACTION_ROW =
    Constants.ComponentTypes.ACTION_ROW;
  private components: BaseComponent<
    Extract<ComponentTypes, MessageActionRowComponent>
  >[] = [];

  constructor() {
    super();
  }

  public override get toComponentObject() {
    return {
      type: this.type,
      components: this.components.map(
        (component) => component.toComponentObject
      ),
    };
  }

  public addComponent(
    component: BaseComponent<Extract<ComponentTypes, MessageActionRowComponent>>
  ) {
    this.components.push(component);
  }
}
