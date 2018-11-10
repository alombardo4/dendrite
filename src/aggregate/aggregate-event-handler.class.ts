import { AbstractAggregate } from './abstract-aggregate.class';
import { DendriteEvent } from '../events';

export abstract class AggregateEventHandler<T extends AbstractAggregate> {

  abstract get identifier(): string;

  constructor(public aggregateContext: T) {}

  abstract handle(event: DendriteEvent): boolean;
}