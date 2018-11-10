import * as uuid from 'uuid';
import { EventHandler, RabbitEventBus, QueueConfig, EventGateway, DendriteEvent, DendriteEventMetadata } from '../../src';

describe('EventGateway', () => {

  const connectionString = 'amqp://localhost:5672';

  let eventBus: RabbitEventBus;
  let queueName: string;
  const queueConfig: QueueConfig = {
    isProducer: true,
    isConsumer: true,
    durable: false
  };

  beforeEach((done) => {
    queueName = uuid.v4();
    eventBus = new RabbitEventBus(connectionString, queueConfig, queueName);
    eventBus.connect(['test.event.name1', 'test.event.name2']).subscribe(_ => done());
  });

  afterEach(() => {
    return eventBus['channel'].deleteQueue(queueName).then(() => {
      return eventBus['channel'].deleteExchange('eventbus');
    });
  });

  it('should register event handler mappings in constructor', () => {
    // Arrange
    class TestEventHandler1 extends EventHandler {
      handle(event: DendriteEvent): boolean {
        return true;
      }
      identifier = 'test.event.name1';

    }

    class TestEventHandler2 extends EventHandler {
      identifier = 'test.event.name2';
      handle(event: DendriteEvent): boolean {
        return true;
      }
    }
    // Act
    const eventGateway = new EventGateway(eventBus, [new TestEventHandler1(), new TestEventHandler2()]);

    // Assert
    expect(eventGateway['eventHandlerMappings'].size).toBe(2);
  });

  it('should route events to their handler functions with handler classes', (done) => {
    // Arrange
    let gotEvent1 = false;
    let gotEvent2 = false;
    class TestEventHandler1 extends EventHandler {
      identifier = 'test.event.name1';
      handle(event: TestEvent1): boolean {
        gotEvent1 = true;
        return true;
      }
    }

    class TestEventHandler2 extends EventHandler {
      identifier = 'test.event.name2';
      handle(event: TestEvent2): boolean {
        gotEvent2 = true;
        return true;
      }
    }

    class TestEvent1 extends DendriteEvent {
      constructor() {
        super('test.event.name1');
      }
    }

    class TestEvent2 extends DendriteEvent {
      constructor() {
        super('test.event.name2');
      }
    }

    // Act
    const eventGateway = new EventGateway(eventBus, [new TestEventHandler1(), new TestEventHandler2()]);
    setTimeout(() => {
      eventBus.publishEvent(new TestEvent2());
    }, 10);

    // Assert
    setTimeout(() => {
      expect(gotEvent1).toBeFalsy();
      expect(gotEvent2).toBeTruthy();
      done();
    }, 20);
  });
});