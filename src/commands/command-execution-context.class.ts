import { BaseCommand } from './base-command.class';
import uuid = require('uuid');

export class CommandExecutionContext<T extends BaseCommand> {
  readonly id: string;

  constructor(public readonly command: T) {
    this.id = uuid.v4();
  }

  rollback() {
    // TODO implement mongo remove
  }
}