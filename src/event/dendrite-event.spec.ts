import { DendriteEvent } from './dendrite-event';

describe(DendriteEvent.name, () => {
    class MockEvent extends DendriteEvent {}
    it('should have an aggregateId property', () => {
        const ev = new MockEvent('1');
        expect(ev.aggregateId).toEqual('1');
    });
});
