import { DendriteAggregate } from '../aggregate';
import { DendriteCommand } from '../command/dendrite-command';
import { DendriteEvent } from '../event';

export abstract class DendriteCommandProcessor<
    A extends DendriteAggregate,
    C extends DendriteCommand<A>
> {
    abstract processCommand(agg: A, cmd: C): DendriteEvent<A>[];
}
