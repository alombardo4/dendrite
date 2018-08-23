import { EventHandlerMapping } from '..';
import { AbstractAggregate } from './abstract-aggregate.class';

export abstract class AggregateEventHandler<T extends AbstractAggregate> {

  constructor(public aggregateContext: T) {}

  abstract register(): EventHandlerMapping[];
}