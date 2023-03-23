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
  emoji?: PartialEmoji;
  disabled?: boolean;
}

export class ButtonBaseComponent extends RunnableComponent<ComponentTypes.BUTTON> {
  public override type: ComponentTypes.BUTTON = ComponentTypes.BUTTON;
  public style: Exclude<ButtonStyles, ButtonStyles.LINK> = ButtonStyles.PRIMARY;

  constructor(
    customID: string,
    public label: string,
    handler?: RunnableComponentHandler,
    public options: ButtonOptions & {
      style?: Exclude<ButtonStyles, ButtonStyles.LINK>;
    } = {}
  ) {
    super(customID, handler);
  }

  public override get toComponentObject(): MessageComponent {
    return {
      type: this.type,
      customID: this.customID,
      style: this.style,
      label: this.label,
      ...this.options,
    };
  }
}

export class PrimaryButtonComponent extends ButtonBaseComponent {
  public override style: ButtonStyles.PRIMARY = ButtonStyles.PRIMARY;
}

export class SecondaryButtonComponent extends ButtonBaseComponent {
  public override style: ButtonStyles.SECONDARY = ButtonStyles.SECONDARY;
}

export class SuccessButtonComponent extends ButtonBaseComponent {
  public override style: ButtonStyles.SUCCESS = ButtonStyles.SUCCESS;
}

export class DangerButtonComponent extends ButtonBaseComponent {
  public override style: ButtonStyles.DANGER = ButtonStyles.DANGER;
}
