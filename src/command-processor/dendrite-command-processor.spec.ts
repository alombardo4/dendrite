import { DendriteAggregate } from '../aggregate';
import { DendriteCommand } from '../command/dendrite-command';
import { DendriteEvent } from '../event';
import { DendriteCommandProcessor } from './dendrite-command-processor';

describe(DendriteCommandProcessor.name, () => {
    class MockAggregate extends DendriteAggregate {
        constructor() {
            super();
            this.aggregateId = '1';
        }
        handleEvent<E extends DendriteEvent<this>>(event: E): this {
            return this;
        }
    }

    class MockEvent extends DendriteEvent<MockAggregate> {
        constructor(aggregateId: string, public readonly value: string) {
            super(aggregateId);
        }
    }

    class MockCommand extends DendriteCommand<MockAggregate> {
        constructor(
            public readonly aggregateId: string,
            public readonly value: string
        ) {
            super();
        }
    }

    class MockCommandProcessor extends DendriteCommandProcessor<
    MockAggregate,
    MockCommand
    > {
        processCommand(
            agg: MockAggregate,
            cmd: MockCommand
        ): DendriteEvent<MockAggregate>[] {
            return [new MockEvent(agg.aggregateId, cmd.value)];
        }
    }

    it('processCommand should return a set of events with merged state', () => {
        const agg = new MockAggregate();
        const cmd = new MockCommand('2', 'value');
        const processor = new MockCommandProcessor();
        const events = processor.processCommand(agg, cmd);
        expect(events[0].aggregateId).toEqual('1');
        expect((events[0] as MockEvent).value).toEqual('value');
    });
});
