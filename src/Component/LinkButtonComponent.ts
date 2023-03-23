import { BaseComponent } from "./BaseComponent";
import { ComponentTypes, MessageComponent, ButtonStyles } from "oceanic.js";
import type { ButtonOptions } from "./ButtonComponent";

export class LinkButtonComponent extends BaseComponent<ComponentTypes.BUTTON> {
  public override type: ComponentTypes.BUTTON = ComponentTypes.BUTTON;
  public style: ButtonStyles.LINK = ButtonStyles.LINK;

  constructor(
    public url: string,
    public label: string,
    public options: ButtonOptions = {}
  ) {
    super();
  }

  public override get toComponentObject(): MessageComponent {
    return {
      type: this.type,
      style: this.style,
      url: this.url,
      ...this.options,
    };
  }
}
