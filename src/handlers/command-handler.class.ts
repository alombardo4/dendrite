import { BaseCommand, CommandExecutionContext } from '../';

export abstract class CommandHandler<T extends BaseCommand> {

  abstract get identifier(): string;

  abstract handle(commandExecutionContext: CommandExecutionContext<T>): boolean;
}