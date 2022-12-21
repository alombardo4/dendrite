import { DendriteEvent } from '../event';

export abstract class DendriteEventHandler<E extends DendriteEvent> {
  abstract handleEvent(event: E): Promise<void>;
}
