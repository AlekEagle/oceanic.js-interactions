import { BaseComponent } from "./BaseComponent";
import { ComponentTypes, MessageComponent, ButtonStyles } from "oceanic.js";
import type { ButtonOptions } from "./ButtonComponent";

export class PremiumButtonComponent extends BaseComponent<ComponentTypes.BUTTON> {
  public override type: ComponentTypes.BUTTON = ComponentTypes.BUTTON;
  public style: ButtonStyles.PREMIUM = ButtonStyles.PREMIUM;

  constructor(public skuID: string, public options: ButtonOptions = {}) {
    super();
  }

  public override get toComponentObject(): MessageComponent {
    return {
      type: this.type,
      style: this.style,
      skuID: this.skuID,
      ...this.options,
    };
  }
}
