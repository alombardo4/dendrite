import { EventHandler, EventBus, DendriteEvent } from '..';

export class EventGateway {
  private eventHandlers: EventHandler[];

  private eventHandlerMappings: Map<string, EventHandler>;

  constructor(private eventBus: EventBus, eventHandlers: EventHandler[]) {
    this.eventHandlers = eventHandlers;
    this.eventHandlerMappings = new Map();
    this.eventHandlers.forEach(eh => {
      if (this.eventHandlerMappings.get(eh.identifier)) {
        console.error(`An event handle with identifer ${eh.identifier} has already been registered. Aborting!`);
      } else {
        this.eventHandlerMappings.set(eh.identifier, eh);
      }
    });

    eventBus.consumeEvents().subscribe((event: DendriteEvent) => {
      const eventName = event.metadata.name;
      try {
        this.eventHandlerMappings.get(eventName).handle(event);
      } catch (e) {
        console.error('An error occurred in event handling', e);
      }
    });
  }
}