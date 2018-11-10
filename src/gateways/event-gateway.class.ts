import { EventHandler, EventBus, DendriteEvent } from '..';

export class EventGateway {
  private eventHandlerMappings: Map<string, EventHandler>;

  constructor(private eventBus: EventBus, eventHandlers: EventHandler[]) {
    this.eventHandlerMappings = new Map();
    eventHandlers.forEach(eh => {
      this.register(eh);
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

  /**
   * Registers a new event handler.
   * @param handler The event handler to register
   */
  register(handler: EventHandler): void {
    if (this.eventHandlerMappings.get(handler.identifier)) {
      console.error(`An event handle with identifer ${handler.identifier} has already been registered. Aborting!`);
    } else {
      this.eventHandlerMappings.set(handler.identifier, handler);
    }
  }
}