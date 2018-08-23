import { EventBus, EventHandlerMapping, DendriteEvent } from '..';
import { AggregateEventHandler } from './aggregate-event-handler.class';
import { DendriteEventWrapper } from '../events';


export abstract class AbstractAggregate {


  private eventHandlerMappings: Map<string, EventHandlerMapping>;

  constructor(protected eventBus: EventBus) {
    this.eventHandlerMappings = new Map();
  }

  registerEventHandler(eventHandler: AggregateEventHandler) {
    const mappings = eventHandler.register();
    eventHandler.register().forEach(map => {
      this.eventHandlerMappings.set(map.eventName, map);
    });
  }

  apply(event: DendriteEvent): void {
    this.eventBus.publishEvent(event);
  }
}