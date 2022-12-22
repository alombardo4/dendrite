import { DendriteEvent } from '../event/dendrite-event';
import { DendriteEventHandler } from './dendrite-event-handler';

describe(DendriteEventHandler.name, () => {
    class MockEvent extends DendriteEvent {
        constructor(id: string, public increment: number) {
            super(id);
        }
    }
    class MockEventHandler extends DendriteEventHandler<MockEvent> {
        counter = 0;
        async handleEvent(event: MockEvent): Promise<void> {
            this.counter += event.increment;
        }
    }

    it('should compile and have an async handle event and maintain state', async () => {
        const handler = new MockEventHandler();

        const event1 = new MockEvent('1', 2);
        const event2 = new MockEvent('2', 5);

        await handler.handleEvent(event1);
        await handler.handleEvent(event2);

        expect(handler.counter).toEqual(7);
    });
});
