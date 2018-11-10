import { AbstractAggregate, DendriteEvent } from '../';

export abstract class AggregateEventHandler<T extends AbstractAggregate> {

  abstract get identifier(): string;

  constructor(public aggregateContext: T) {}

  abstract handle(event: DendriteEvent): boolean;
}