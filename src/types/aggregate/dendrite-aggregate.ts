import { DendriteEvent } from '../event';

export abstract class DendriteAggregate {
    public aggregateId: string;

    abstract handleEvent<E extends DendriteEvent<this>>(event: E): this;
}
