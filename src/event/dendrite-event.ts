import { DendriteAggregate } from '../aggregate';

export abstract class DendriteEvent<A extends DendriteAggregate> {
    constructor(public readonly aggregateId: string) {}
}
