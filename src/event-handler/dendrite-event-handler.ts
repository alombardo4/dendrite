import { DendriteEvent } from '../event';

export abstract class DendriteEventHandler<E extends DendriteEvent<any>> {
    abstract handleEvent(event: E): Promise<void>;
}
