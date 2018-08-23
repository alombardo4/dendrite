import { AbstractAggregate, EventBus, AggregateEventHandler, EventHandlerMapping, DendriteEvent } from '../../src';
import { NAME as createdEventName, ItemCreatedEvent } from './events/item-created.event';

export class TestAggregate extends AbstractAggregate {
  eventCount = 0;

  constructor(eventBus: EventBus) {
    super(eventBus);
    this.registerEventHandler(new EventHandler1(this));
  }

  apply(event: DendriteEvent) {
    this.eventBus.publishEvent(event);
  }

  load() {}
}

class EventHandler1 extends AggregateEventHandler<TestAggregate> {

  register(): EventHandlerMapping[] {
    return [
      {
        eventName: createdEventName,
        handlerFunction: (event: ItemCreatedEvent) => {
          this.aggregateContext.eventCount++;
        }
      }
    ];
  }

}