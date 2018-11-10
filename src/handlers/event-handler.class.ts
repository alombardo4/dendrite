import { DendriteEvent } from '../events';

export abstract class EventHandler {

  abstract get identifier(): string;

  abstract handle(event: DendriteEvent): boolean;
}