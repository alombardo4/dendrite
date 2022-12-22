import { DendriteEvent } from '../event';
import { DendriteAggregate } from './dendrite-aggregate';

describe(DendriteAggregate.name, () => {
    class MockUpdateNameEvent extends DendriteEvent<MockAggregate> {
        constructor(aggregateId: string, public readonly name: string) {
            super(aggregateId);
        }
    }

    class BadEvent extends DendriteEvent<any> {}

    class MockAggregate extends DendriteAggregate {
        name: string;

        handleEvent<E extends DendriteEvent<MockAggregate>>(event: E): this {
            if (event instanceof MockUpdateNameEvent) {
                this.aggregateId = event.aggregateId;
                this.name = event.name;
            } else {
                throw new Error('Unsupported event received');
            }
            return this;
        }
    }

    it('should handle event and update state', () => {
        const agg = new MockAggregate();
        const event = new MockUpdateNameEvent('1', 'name');
        agg.handleEvent(event);
        expect(agg.name).toEqual('name');
        expect(agg.aggregateId).toEqual('1');
    });

    it('should be able to throw when the event is unidentified', () => {
        const agg = new MockAggregate();
        const event = new BadEvent('1');
        expect(() => agg.handleEvent(event)).toThrowError(
            'Unsupported event received'
        );
    });
});
