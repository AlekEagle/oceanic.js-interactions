import {
  RunnableComponent,
  RunnableComponentHandler,
} from "./RunnableComponent";
import {
  ComponentTypes,
  MessageComponent,
  ButtonStyles,
  PartialEmoji,
} from "oceanic.js";

export interface ButtonOptions {
  label?: string;
  emoji?: PartialEmoji;
  disabled?: boolean;
}

export abstract class ButtonBase extends RunnableComponent<ComponentTypes.BUTTON> {
  public override type: ComponentTypes.BUTTON = ComponentTypes.BUTTON;
  public abstract style: Exclude<ButtonStyles, ButtonStyles.LINK>;

  constructor(
    customID: string,
    handler?: RunnableComponentHandler,
    public options: ButtonOptions = {}
  ) {
    super(customID, handler);
  }

  public override get toComponentObject(): MessageComponent {
    return {
      type: this.type,
      customID: this.customID,
      style: this.style,
      ...this.options,
    };
  }
}

export class PrimaryButtonComponent extends ButtonBase {
  public override style: ButtonStyles.PRIMARY = ButtonStyles.PRIMARY;
}

export class SecondaryButtonComponent extends ButtonBase {
  public override style: ButtonStyles.SECONDARY = ButtonStyles.SECONDARY;
}

export class SuccessButtonComponent extends ButtonBase {
  public override style: ButtonStyles.SUCCESS = ButtonStyles.SUCCESS;
}

export class DangerButtonComponent extends ButtonBase {
  public override style: ButtonStyles.DANGER = ButtonStyles.DANGER;
}
