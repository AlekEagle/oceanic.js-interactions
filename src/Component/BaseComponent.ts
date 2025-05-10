import type {
  ComponentTypes,
  MessageActionRow,
  AnyMessageComponent,
} from "oceanic.js";

export abstract class BaseComponent<T extends ComponentTypes = ComponentTypes> {
  public abstract type: T;

  constructor() {}

  public abstract get toComponentObject(): T extends ComponentTypes.ACTION_ROW
    ? MessageActionRow
    : AnyMessageComponent;
}
