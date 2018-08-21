import * as uuid from 'uuid';
import { EventHandler, RabbitEventBus, QueueConfig, EventGateway, DendriteConsumedEvent, DendriteEventBase, EventHandlerMapping } from '../../src';

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
    class TestEventHandler extends EventHandler {
      register(): EventHandlerMapping[] {
        return [
          {
            eventName: 'test.event.name1',
            handlerFunction: jest.fn()
          },
          {
            eventName: 'test.event.name2',
            handlerFunction: jest.fn()
          }
        ];
      }
    }

    // Act
    const eventGateway = new EventGateway(eventBus, [new TestEventHandler()]);

    // Assert
    expect(eventGateway['eventHandlers'].length).toBe(1);
    expect(eventGateway['eventHandlerMappings'].size).toBe(2);
  });

  it('should route events to their handler functions with a single handler class', (done) => {
    // Arrange
    let gotEvent1 = false;
    let gotEvent2 = false;
    class TestEventHandler extends EventHandler {
      mappings =  [
        {
          eventName: 'test.event.name1',
          handlerFunction: (event: DendriteConsumedEvent<TestEvent1>) => {
            gotEvent1 = true;
          }
        },
        {
          eventName: 'test.event.name2',
          handlerFunction: (event: DendriteConsumedEvent<TestEvent2>) => {
            gotEvent2 = true;
          }
        }
      ];
      register(): EventHandlerMapping[] {
        return this.mappings;
      }
    }

    class TestEvent1 implements DendriteEventBase {
      name = 'test.event.name1';
    }

    class TestEvent2 implements DendriteEventBase {
      name = 'test.event.name2';
    }

    const eventHandler = new TestEventHandler();
    // Act
    const eventGateway = new EventGateway(eventBus, [eventHandler]);
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

  it('should route events to their handler functions with a multiple handler classes', (done) => {
    // Arrange
    let gotEvent1 = false;
    let gotEvent2 = false;
    class TestEventHandler1 extends EventHandler {
      mappings =  [
        {
          eventName: 'test.event.name1',
          handlerFunction: (event: DendriteConsumedEvent<TestEvent1>) => {
            gotEvent1 = true;
          }
        }
      ];
      register(): EventHandlerMapping[] {
        return this.mappings;
      }
    }

    class TestEventHandler2 extends EventHandler {
      mappings =  [
        {
          eventName: 'test.event.name2',
          handlerFunction: (event: DendriteConsumedEvent<TestEvent2>) => {
            gotEvent2 = true;
          }
        }
      ];
      register(): EventHandlerMapping[] {
        return this.mappings;
      }
    }

    class TestEvent1 implements DendriteEventBase {
      name = 'test.event.name1';
    }

    class TestEvent2 implements DendriteEventBase {
      name = 'test.event.name2';
    }

    const eventHandler1 = new TestEventHandler1();
    const eventHandler2 = new TestEventHandler2();

    // Act
    const eventGateway = new EventGateway(eventBus, [eventHandler1, eventHandler2]);
    setTimeout(() => {
      eventBus.publishEvent(new TestEvent1());
      eventBus.publishEvent(new TestEvent2());
    }, 10);

    // Assert
    setTimeout(() => {
      expect(gotEvent1).toBeTruthy();
      expect(gotEvent2).toBeTruthy();
      done();
    }, 20);
  });
});