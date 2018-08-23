import { EventHandler, EventBus, EventHandlerMapping, DendriteEvent } from '..';

export class EventGateway {
  private eventHandlers: EventHandler[];

  private eventHandlerMappings: Map<string, EventHandlerMapping>;

  constructor(private eventBus: EventBus, eventHandlers: EventHandler[]) {
    this.eventHandlers = eventHandlers;
    this.eventHandlerMappings = new Map();
    this.eventHandlers.forEach(eh => {
      const mappingsForHandler = eh.register();
      mappingsForHandler.forEach(map => {
        this.eventHandlerMappings.set(map.eventName, map);
      });
    });

    eventBus.consumeEvents().subscribe((event: DendriteEvent) => {
      const eventName = event.metadata.name;
      try {
        this.eventHandlerMappings.get(eventName).handlerFunction(event);
      } catch (e) {
        console.error('An error occurred in event handling', e);
      }
    });
  }
}