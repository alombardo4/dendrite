import { BaseCommand } from '../commands/base-command.class';

export abstract class CommandHandler {

  abstract identifier(): string;

  abstract handle(command: BaseCommand): boolean;
}