import {
  User,
  Member,
  Constants,
  Channel,
  Role,
  CommandInteraction,
  InteractionOptions,
  AnyGuildTextChannel,
  AnyTextChannelWithoutGroup,
  Attachment,
} from "oceanic.js";
import type { BaseCommandData } from "./BaseCommand";

// Choice type for options. This is used to specify the choices for String, Integer, and Number options.
export type OptionChoice<T> = {
  name: string;
  value: T;
};

// Possible types of options. (Subcommands and subcommand groups are not included.)
export namespace OptionTypes {
  // String option.
  export type String = (
    | { type: Constants.ApplicationCommandOptionTypes.STRING }
    | {
        type: Constants.ApplicationCommandOptionTypes.STRING;
        minLength: number;
        maxLength: number;
      }
    | {
        type: Constants.ApplicationCommandOptionTypes.STRING;
        choices: OptionChoice<string>[];
      }
  ) & { description: string; required: boolean };

  // Integer option.
  export type Integer = (
    | { type: Constants.ApplicationCommandOptionTypes.INTEGER }
    | {
        type: Constants.ApplicationCommandOptionTypes.INTEGER;
        choices: OptionChoice<number>[];
      }
    | {
        type: Constants.ApplicationCommandOptionTypes.INTEGER;
        maxValue?: number;
        minValue?: number;
      }
  ) & { description: string; required: boolean };

  // Boolean option.
  export type Boolean = {
    type: Constants.ApplicationCommandOptionTypes.BOOLEAN;
  } & { description: string; required: boolean };

  // User option.
  export type User = {
    type: Constants.ApplicationCommandOptionTypes.USER;
  } & { description: string; required: boolean };

  // Channel option.
  export type Channel = {
    type: Constants.ApplicationCommandOptionTypes.CHANNEL;
  } & { description: string; required: boolean };

  // Role option.
  export type Role = {
    type: Constants.ApplicationCommandOptionTypes.ROLE;
  } & { description: string; required: boolean };

  // Mentionable option.
  export type Mentionable = {
    type: Constants.ApplicationCommandOptionTypes.MENTIONABLE;
  } & { description: string; required: boolean };

  // Number option.
  export type Number = (
    | { type: Constants.ApplicationCommandOptionTypes.NUMBER }
    | {
        type: Constants.ApplicationCommandOptionTypes.NUMBER;
        choices: OptionChoice<number>[];
      }
    | {
        type: Constants.ApplicationCommandOptionTypes.NUMBER;
        maxValue?: number;
        minValue?: number;
      }
  ) & { description: string; required: boolean };

  // Attachment option.
  export type Attachment = {
    type: Constants.ApplicationCommandOptionTypes.ATTACHMENT;
  } & { description: string; required: boolean };

  // Any option.
  export type AnyOption =
    | String
    | Integer
    | Boolean
    | User
    | Channel
    | Role
    | Mentionable
    | Number
    | Attachment;

  // Any option that has choices
  export type AnyOptionWithChoices = String | Integer | Number;

  // Any option that has min/max values
  export type AnyOptionWithMinMax = Integer | Number;
}

export type OptionKV = {
  [option: string]: OptionTypes.AnyOption;
};

// Option Argument Type. This is used to specify the type of the arguments passed to the handler function when the command is executed.
export type OptionArgType<O extends BaseCommandData, P extends OptionKV> = {
  [K in keyof P]: P[K]["type"] extends Constants.ApplicationCommandOptionTypes.STRING
    ? string
    : P[K]["type"] extends Constants.ApplicationCommandOptionTypes.INTEGER
    ? number
    : P[K]["type"] extends Constants.ApplicationCommandOptionTypes.USER
    ? Member | User
    : P[K]["type"] extends Constants.ApplicationCommandOptionTypes.CHANNEL
    ?
        | (O["dmPermissions"] extends true
            ? AnyTextChannelWithoutGroup
            : AnyGuildTextChannel)
        | Channel
    : P[K]["type"] extends Constants.ApplicationCommandOptionTypes.ROLE
    ? Role
    : P[K]["type"] extends Constants.ApplicationCommandOptionTypes.MENTIONABLE
    ? Member | User | Role
    : P[K]["type"] extends Constants.ApplicationCommandOptionTypes.NUMBER
    ? number
    : P[K]["type"] extends Constants.ApplicationCommandOptionTypes.ATTACHMENT
    ? Attachment
    : never;
};

export namespace OptionBuilder {
  export function String(
    description: string,
    required: boolean = true,
    options:
      | { choices: OptionChoice<string>[] }
      | { minLength?: number; maxLength?: number } = {}
  ): OptionTypes.String {
    return {
      type: Constants.ApplicationCommandOptionTypes.STRING,
      description,
      required,
      ...options,
    };
  }

  export function Integer(
    description: string,
    required: boolean = true,
    options:
      | { choices: OptionChoice<number>[] }
      | { minValue?: number; maxValue?: number } = {}
  ): OptionTypes.Integer {
    return {
      type: Constants.ApplicationCommandOptionTypes.INTEGER,
      description,
      required,
      ...options,
    };
  }

  export function Boolean(
    description: string,
    required: boolean = true
  ): OptionTypes.Boolean {
    return {
      type: Constants.ApplicationCommandOptionTypes.BOOLEAN,
      description,
      required,
    };
  }

  export function User(
    description: string,
    required: boolean = true
  ): OptionTypes.User {
    return {
      type: Constants.ApplicationCommandOptionTypes.USER,
      description,
      required,
    };
  }

  export function Channel(
    description: string,
    required: boolean = true
  ): OptionTypes.Channel {
    return {
      type: Constants.ApplicationCommandOptionTypes.CHANNEL,
      description,
      required,
    };
  }

  export function Role(
    description: string,
    required: boolean = true
  ): OptionTypes.Role {
    return {
      type: Constants.ApplicationCommandOptionTypes.ROLE,
      description,
      required,
    };
  }

  export function Mentionable(
    description: string,
    required: boolean = true
  ): OptionTypes.Mentionable {
    return {
      type: Constants.ApplicationCommandOptionTypes.MENTIONABLE,
      description,
      required,
    };
  }

  export function Number(
    description: string,
    required: boolean = true,
    options:
      | { choices: OptionChoice<number>[] }
      | { minValue?: number; maxValue?: number } = {}
  ): OptionTypes.Number {
    return {
      type: Constants.ApplicationCommandOptionTypes.NUMBER,
      description,
      required,
      ...options,
    };
  }

  export function Attachment(
    description: string,
    required: boolean = true
  ): OptionTypes.Attachment {
    return {
      type: Constants.ApplicationCommandOptionTypes.ATTACHMENT,
      description,
      required,
    };
  }
}

export async function ConvertInteractionOptions<
  O extends BaseCommandData,
  P extends OptionKV
>(
  schema: P,
  interaction: CommandInteraction,
  rawOptions: InteractionOptions[]
): Promise<OptionArgType<O, P>> {
  const options: any = {};
  for (const option of rawOptions) {
    if (
      // @ts-ignore Added elsewhere.
      schema[option.name].type ==
        Constants.ApplicationCommandOptionTypes.SUB_COMMAND ||
      // @ts-ignore
      schema[option.name].type ==
        Constants.ApplicationCommandOptionTypes.SUB_COMMAND_GROUP
    ) {
      continue;
    } else if (!schema[option.name]) {
      throw new Error("Discord sent an option that was not in the schema.");
    } else if (schema[option.name].type != option.type) {
      throw new Error(
        "Discord sent an option that was in the schema but doesn't match the type in the schema."
      );
    } else {
      switch (option.type) {
        case Constants.ApplicationCommandOptionTypes.USER:
          options[option.name] = interaction.data.resolved.members.has(
            option.value
          )
            ? interaction.data.resolved.members.get(option.value)
            : interaction.data.resolved.users.get(option.value);
          break;
        case Constants.ApplicationCommandOptionTypes.CHANNEL:
          options[option.name] = interaction.data.resolved.channels.get(
            option.value
          );
          break;
        case Constants.ApplicationCommandOptionTypes.ROLE:
          options[option.name] = interaction.data.resolved.roles.get(
            option.value
          );
          break;
        case Constants.ApplicationCommandOptionTypes.MENTIONABLE:
          options[option.name] = interaction.data.resolved.members.has(
            option.value
          )
            ? interaction.data.resolved.members.get(option.value)
            : interaction.data.resolved.users.has(option.value)
            ? interaction.data.resolved.users.get(option.value)
            : interaction.data.resolved.roles.has(option.value)
            ? interaction.data.resolved.roles.get(option.value)
            : null;
          break;
        case Constants.ApplicationCommandOptionTypes.ATTACHMENT:
          options[option.name] = interaction.data.resolved.attachments.get(
            option.value
          );
          break;
        default:
          options[option.name] = option.value;
          break;
      }
    }
  }
  return options as OptionArgType<O, P>;
}
