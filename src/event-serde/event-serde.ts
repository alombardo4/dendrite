import { DendriteEvent } from '../types';
import { DendriteAggregate } from '../types/aggregate';

export abstract class EventSerde {
    abstract serialize<A extends DendriteAggregate, T extends DendriteEvent<A>>(
        obj: T
    ): string;
    abstract deserialize<A extends DendriteAggregate, T extends DendriteEvent<A>>(
        raw: string,
        constructor: T
    ): T;
}
