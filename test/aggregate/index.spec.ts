import { TestAggregate } from './test-aggregate';
import { RabbitEventBus } from '../../src';
import { ItemCreatedEvent, NAME } from './events/item-created.event';
import * as uuid from 'uuid';

describe('aggregate loader', () => {
  let eventBus: RabbitEventBus;
  const connectionString = 'amqp://localhost:5672';

  beforeEach((done) => {
    eventBus = new RabbitEventBus(connectionString, { isProducer: true, isConsumer: true, queueName: uuid.v4() });
    eventBus.connect([NAME]).subscribe(() => done());
  });

  it('should contruct', () => {
    // Arrange

    // Act
    const aggregate = new TestAggregate(eventBus);

    // Assert
    expect(aggregate).not.toBeUndefined();
  });

  it('should publish events on apply', (done) => {
    // Arrange
    const aggregate = new TestAggregate(eventBus);
    let counter = 0;
    eventBus.consumeEvents().subscribe(event => {
      counter++;
    });

    // Act
    setTimeout(() => {
      aggregate.apply(new ItemCreatedEvent('id', 'name'));
    }, 10);

    // Assert
    setTimeout(() => {
      expect(counter).toEqual(1);
      done();
    }, 20);
  };
});