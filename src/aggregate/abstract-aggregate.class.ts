import { EventBus, DendriteEvent, AggregateEventHandler, DendriteEventWrapper, EventHandler } from '..';

export abstract class AbstractAggregate {


  private eventHandlerMappings: Map<string, EventHandler>;

  constructor(protected eventBus: EventBus) {
    this.eventHandlerMappings = new Map();
  }

  registerEventHandler(eventHandler: AggregateEventHandler<any>): void {
    this.eventHandlerMappings.set(eventHandler.identifier, eventHandler);
  }

  apply(event: DendriteEvent): void {
    this.eventBus.publishEvent(event);
  }
}