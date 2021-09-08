import {
  Client,
  ClientOptions,
  MessageContent,
  Message,
  Emoji,
  JSONCache,
  SimpleJSON,
  Member,
  Uncached
} from 'eris';

declare function ECH(
  token: string,
  options?: ClientOptions,
  commandOptions?: ECH.CommandClientOptions
): ECH.CommandClient;

declare namespace ECH {
  type CommandGenerator =
    | CommandGeneratorFunction
    | MessageContent
    | MessageContent[]
    | CommandGeneratorFunction[];
  type CommandGeneratorFunction = (
    msg: Message,
    args: string[]
  ) => GeneratorFunctionReturn;
  type GeneratorFunctionReturn =
    | Promise<MessageContent>
    | Promise<void>
    | MessageContent
    | void;
  type GenericCheckFunction<T> = (msg: Message) => T | Promise<T>;
  type ReactionButtonsFilterFunction = (
    msg: Message,
    emoji: Emoji,
    userID: string
  ) => boolean;
  type ReactionButtonsGenerator =
    | ReactionButtonsGeneratorFunction
    | MessageContent
    | MessageContent[]
    | ReactionButtonsGeneratorFunction[];
  type ReactionButtonsGeneratorFunction = (
    msg: Message,
    args: string[],
    userID: string
  ) => GeneratorFunctionReturn;

  interface CommandReactionButtons extends CommandReactionButtonsOptions {
    execute: (
      msg: Message,
      args: string[],
      userID: string
    ) => string | GeneratorFunctionReturn;
    responses: ((() => string) | ReactionButtonsGeneratorFunction)[];
  }
  interface CommandReactionButtonsOptions {
    emoji: string;
    filter: ReactionButtonsFilterFunction;
    response: string | ReactionButtonsGeneratorFunction;
    type: 'edit' | 'cancel';
  }
  interface CommandRequirements {
    custom?: GenericCheckFunction<boolean>;
    permissions?:
      | { [s: string]: boolean }
      | GenericCheckFunction<{ [s: string]: boolean }>;
    roleIDs?: string[] | GenericCheckFunction<string[]>;
    roleNames?: string[] | GenericCheckFunction<string[]>;
    userIDs?: string[] | GenericCheckFunction<string[]>;
  }
  interface Hooks {
    postCheck?: (msg: Message, args: string[], checksPassed: boolean) => void;
    postCommand?: (msg: Message, args: string[], sent?: Message) => void;
    postExecution?: (
      msg: Message,
      args: string[],
      executionSuccess: boolean
    ) => void;
    preCommand?: (msg: Message, args: string[]) => void;
  }

  interface CommandCooldownExclusions {
    channelIDs?: string[];
    guildIDs?: string[];
    userIDs?: string[];
  }

  interface CommandOptions {
    aliases?: string[];
    argsRequired?: boolean;
    caseInsensitive?: boolean;
    cooldown?: number;
    cooldownExclusions?: CommandCooldownExclusions;
    cooldownMessage?:
      | MessageContent
      | GenericCheckFunction<MessageContent>
      | false;
    cooldownReturns?: number;
    defaultSubcommandOptions?: CommandOptions;
    deleteCommand?: boolean;
    description?: string;
    dmOnly?: boolean;
    errorMessage?: MessageContent | GenericCheckFunction<MessageContent>;
    fullDescription?: string;
    guildOnly?: boolean;
    hidden?: boolean;
    hooks?: Hooks;
    invalidUsageMessage?:
      | MessageContent
      | GenericCheckFunction<MessageContent>
      | false;
    permissionMessage?:
      | MessageContent
      | GenericCheckFunction<MessageContent>
      | false;
    reactionButtons?: CommandReactionButtonsOptions[] | null;
    reactionButtonTimeout?: number;
    requirements?: CommandRequirements;
    restartCooldown?: boolean;
    usage?: string;
    removeWhitespace?: boolean;
    whitespaceSeparator?: RegExp;
  }

  interface CommandClientOptions {
    argsSplitter?: (str: string) => string[];
    defaultCommandOptions?: CommandOptions;
    defaultHelpCommand?: boolean;
    description?: string;
    ignoreBots?: boolean;
    ignoreSelf?: boolean;
    name?: string;
    owner?: string;
    prefix?: string | string[];
    whitespaceSeparator?: RegExp;
  }

  interface ActiveMessages {
    args: string[];
    command: Command;
    timeout: NodeJS.Timer;
  }

  class CommandClient extends Client {
    activeMessage: { [s: string]: ActiveMessages };
    commandAliases: { [s: string]: string };
    commandOptions: CommandClientOptions;
    commands: { [s: string]: Command };
    guildPrefixes: { [s: string]: string | string[] };
    preReady?: true;
    constructor(
      token: string,
      options?: ClientOptions,
      commandOptions?: CommandClientOptions
    );
    checkPrefix(msg: Message): void;
    onMessageCreate(msg: Message): Promise<void>;
    onMessageReactionEvent(
      msg: Message,
      emoji: Emoji,
      reactor: Member | Uncached | string
    ): Promise<void>;
    registerCommand(
      label: string,
      generator: CommandGenerator,
      options?: CommandOptions
    ): Command;
    registerCommandAlias(alias: string, label: string): void;
    registerGuildPrefix(guildID: string, prefix: string[] | string): void;
    resolveCommand(label: string): Command;
    unregisterCommand(label: string): void;
    unwatchMessage(id: string, channelID: string): void;
    toString(): string;
  }

  class Command implements CommandOptions, SimpleJSON {
    aliases: string[];
    argsRequired: boolean;
    caseInsensitive: boolean;
    cooldown: number;
    cooldownExclusions: CommandCooldownExclusions;
    cooldownMessage:
      | MessageContent
      | false
      | GenericCheckFunction<MessageContent>;
    cooldownReturns: number;
    defaultSubcommandOptions: CommandOptions;
    deleteCommand: boolean;
    description: string;
    dmOnly: boolean;
    errorMessage: MessageContent | GenericCheckFunction<MessageContent>;
    fullDescription: string;
    fullLabel: string;
    guildOnly: boolean;
    hidden: boolean;
    hooks: Hooks;
    invalidUsageMessage:
      | MessageContent
      | false
      | GenericCheckFunction<MessageContent>;
    label: string;
    parentCommand?: Command;
    permissionMessage:
      | MessageContent
      | false
      | GenericCheckFunction<MessageContent>;
    reactionButtons: null | CommandReactionButtons[];
    reactionButtonTimeout: number;
    requirements: CommandRequirements;
    restartCooldown: boolean;
    subcommandAliases: { [alias: string]: string };
    subcommands: { [s: string]: Command };
    usage: string;
    constructor(
      label: string,
      generate: CommandGenerator,
      options?: CommandOptions
    );
    cooldownCheck(msg: Message): boolean;
    cooldownExclusionCheck(msg: Message): boolean;
    executeCommand(
      msg: Message,
      args: string[]
    ): Promise<GeneratorFunctionReturn>;
    permissionCheck(msg: Message): Promise<boolean>;
    process(
      args: string[],
      msg: Message
    ): Promise<void | GeneratorFunctionReturn>;
    registerSubcommand(
      label: string,
      generator: CommandGenerator,
      options?: CommandOptions
    ): Command;
    registerSubcommandAlias(alias: string, label: string): void;
    unregisterSubcommand(label: string): void;
    toString(): string;
    toJSON(props?: string[]): JSONCache;
  }
}

export default ECH;
