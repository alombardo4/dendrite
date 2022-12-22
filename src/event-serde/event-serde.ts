import { DendriteEvent } from '../event/dendrite-event';

export abstract class EventSerde {
    abstract serialize<T extends DendriteEvent>(obj: T): string;
    abstract deserialize<T extends DendriteEvent>(raw: string, constructor: T): T;
}
