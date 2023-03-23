import {
  Interaction,
  Client,
  CommandInteraction as OceanicCommandInteraction,
  ComponentInteraction,
} from "oceanic.js";
import { EventEmitter } from "events";
import { SlashCommand, SlashCommandHandler } from "./Command/SlashCommand";
import type { BaseCommandData } from "./Command/BaseCommand";
import type { OptionKV } from "./Command/OptionBuilder";
import type { RunnableComponent } from "./Component/RunnableComponent";
import { CommandInteraction } from "./Interaction/CommandInteraction";

export declare interface CommandHandlerEvents {
  error: (interaction: CommandInteraction, error: Error) => void;
  unhandledMessageComponent: (interaction: ComponentInteraction) => void;
}

/**
 * The oceanic.js addon that handles application commands in a simple manner.
 */
export default class CommandHandler extends EventEmitter {
  private _unpublishedCommands: SlashCommand[] = [];
  private _commands: SlashCommand[] = [];
  private _components: RunnableComponent[] = [];
  private _unpublishedAutocomplete: any;
  private _autocomplete: any;

  //TODO: Add pre-handlers and post-handlers for commands, components, and autocomplete.

  constructor(private _client: Client) {
    // Call the EventEmitter constructor.
    super();
    // Bind the handleInteraction method to the client's interactionCreate event.
    this._client.on("interactionCreate", this.handleInteraction.bind(this));
  }

  // Interaction handler.
  private async handleInteraction(interaction: Interaction) {
    // TODO: Handle autocomplete interactions.
    if (interaction instanceof OceanicCommandInteraction) {
      const command = this._commands.find((c) => c.id === interaction.data.id);
      if (command == null) return;
      else
        await command.run(
          CommandInteraction.fromOceanicCommandInteraction(interaction)
        );
    } else if (interaction instanceof ComponentInteraction) {
      const component = this._components.find(
        (c) => c.customID === interaction.data.customID
      );
      if (component == null) {
        const unhandledMessageComponentEventHandled = this.emit(
          "unhandledMessageComponent",
          interaction
        );
        if (!unhandledMessageComponentEventHandled) {
          console.warn(
            `Unhandled message component: ${interaction.data.customID}`
          );
        }
      } else {
        await component.run(interaction);
        // TODO: Add and handle persistent components.
        this._components = this._components.filter((c) => c !== component);
      }
    }
  }

  public createCommand<
    O extends BaseCommandData = BaseCommandData,
    P extends OptionKV = OptionKV
  >(
    name: string,
    description: string,
    options: O = {} as O,
    params: P = {} as P,
    handler: SlashCommandHandler<O, P>
  ) {
    this.registerCommand(
      new SlashCommand(name, description, options, params, handler) as any
    );
  }

  /**
   * Add a command to the queue of unpublished commands.
   * @param command The command to add.
   * @returns The command handler.
   */
  public registerCommand(command: SlashCommand) {
    this._unpublishedCommands.push(command);
    return this;
  }

  /**
   * Register a component to the handler.
   * These don't need to be published to the Discord API to be used, but they need to be registered with the handler so the handler knows that it should handle them.
   * @param component The component to register.
   * @returns The command handler.
   */
  public registerComponent(component: RunnableComponent) {
    this._components.push(component);
    return this;
  }

  /**
   * Publish the unpublished commands to the Discord API.
   */
  public async publishCommands() {
    // Check if at least one shard is ready (this is required to use the application functions on the client).
    if (!this._client.shards.some((s) => s.ready))
      throw new Error("At least one shard must be ready to publish commands.");

    const interactions = this._unpublishedCommands.map(
      (c) => c.interactionObject
    );

    // Publish the commands to the Discord API.
    const publishedCommands =
      await this._client.application.bulkEditGlobalCommands(interactions);

    // Set the id of the commands to the id of the published commands and move them from unpublished to published.
    for (let publishedCommand of publishedCommands) {
      const command = this._unpublishedCommands.find(
        (c) => c.name === publishedCommand.name
      );
      if (command == null) continue;
      command.id = publishedCommand.id;
      this._commands.push(command);
      this._unpublishedCommands.splice(
        this._unpublishedCommands.indexOf(command),
        1
      );
    }
  }

  // Getters
  public get commands() {
    return this._commands;
  }

  public get components() {
    return this._components;
  }

  public get autocomplete() {
    return this._autocomplete;
  }

  // Override the EventEmitter methods to provide type safety.
  override on<U extends keyof CommandHandlerEvents>(
    event: U,
    listener: CommandHandlerEvents[U]
  ): this {
    super.on(event, listener);
    return this;
  }

  override once<U extends keyof CommandHandlerEvents>(
    event: U,
    listener: CommandHandlerEvents[U]
  ): this {
    super.once(event, listener);
    return this;
  }

  override off<U extends keyof CommandHandlerEvents>(
    event: U,
    listener: CommandHandlerEvents[U]
  ): this {
    super.off(event, listener);
    return this;
  }

  override addListener<U extends keyof CommandHandlerEvents>(
    event: U,
    listener: CommandHandlerEvents[U]
  ): this {
    super.addListener(event, listener);
    return this;
  }

  override emit<U extends keyof CommandHandlerEvents>(
    event: U,
    ...args: Parameters<CommandHandlerEvents[U]>
  ): boolean {
    return super.emit(event, ...args);
  }
}
