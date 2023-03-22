import { RunnableComponent } from "./RunnableComponent";
import {
  ChannelTypes,
  ComponentTypes,
  SelectMenuComponent,
  SelectOption,
} from "oceanic.js";

export type SelectMenuTypes =
  | ComponentTypes.STRING_SELECT
  | ComponentTypes.USER_SELECT
  | ComponentTypes.ROLE_SELECT
  | ComponentTypes.MENTIONABLE_SELECT
  | ComponentTypes.CHANNEL_SELECT;

export interface SelectMenuOptions {
  placeholder?: string;
  minValues?: number;
  maxValues?: number;
  disabled?: boolean;
}

export abstract class SelectMenuBase<
  T extends SelectMenuTypes = SelectMenuTypes
> extends RunnableComponent<SelectMenuTypes> {
  public abstract override type: T;
  public abstract override toComponentObject: SelectMenuComponent;
}

export class StringSelectMenuComponent extends SelectMenuBase<ComponentTypes.STRING_SELECT> {
  public override type: ComponentTypes.STRING_SELECT =
    ComponentTypes.STRING_SELECT;

  constructor(
    customID: string,
    private _options: Array<SelectOption>,
    public additionalOptions: SelectMenuOptions = {}
  ) {
    super(customID);
  }

  public override get toComponentObject(): SelectMenuComponent {
    return {
      type: ComponentTypes.STRING_SELECT,
      customID: this.customID,
      options: this._options,
      ...this.additionalOptions,
    };
  }
}

export class UserSelectMenuComponent extends SelectMenuBase<ComponentTypes.USER_SELECT> {
  public override type: ComponentTypes.USER_SELECT = ComponentTypes.USER_SELECT;

  constructor(
    customID: string,
    public additionalOptions: SelectMenuOptions = {}
  ) {
    super(customID);
  }

  public override get toComponentObject(): SelectMenuComponent {
    return {
      type: ComponentTypes.USER_SELECT,
      customID: this.customID,
      ...this.additionalOptions,
    };
  }
}

export class RoleSelectMenuComponent extends SelectMenuBase<ComponentTypes.ROLE_SELECT> {
  public override type: ComponentTypes.ROLE_SELECT = ComponentTypes.ROLE_SELECT;

  constructor(
    customID: string,
    public additionalOptions: SelectMenuOptions = {}
  ) {
    super(customID);
  }

  public override get toComponentObject(): SelectMenuComponent {
    return {
      type: ComponentTypes.ROLE_SELECT,
      customID: this.customID,
      ...this.additionalOptions,
    };
  }
}

export class MentionableSelectMenuComponent extends SelectMenuBase<ComponentTypes.MENTIONABLE_SELECT> {
  public override type: ComponentTypes.MENTIONABLE_SELECT =
    ComponentTypes.MENTIONABLE_SELECT;

  constructor(
    customID: string,
    public additionalOptions: SelectMenuOptions = {}
  ) {
    super(customID);
  }

  public override get toComponentObject(): SelectMenuComponent {
    return {
      type: ComponentTypes.MENTIONABLE_SELECT,
      customID: this.customID,
      ...this.additionalOptions,
    };
  }
}

export class ChannelSelectMenuComponent extends SelectMenuBase<ComponentTypes.CHANNEL_SELECT> {
  public override type: ComponentTypes.CHANNEL_SELECT =
    ComponentTypes.CHANNEL_SELECT;

  constructor(
    customID: string,
    private _channelTypes: Array<ChannelTypes>,
    public additionalOptions: SelectMenuOptions = {}
  ) {
    super(customID);
  }

  public override get toComponentObject(): SelectMenuComponent {
    return {
      type: ComponentTypes.CHANNEL_SELECT,
      customID: this.customID,
      channelTypes: this._channelTypes,
      ...this.additionalOptions,
    };
  }
}
