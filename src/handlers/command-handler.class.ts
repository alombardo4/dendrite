import { BaseCommand } from '../commands/base-command.class';
import { CommandExecutionContext } from '../commands/command-execution-context.class';

export abstract class CommandHandler<T extends BaseCommand> {

  abstract get identifier(): string;

  abstract handle(commandExecutionContext: CommandExecutionContext<T>): boolean;
}