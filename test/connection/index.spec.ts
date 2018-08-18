import { RabbitEventBus } from '../../src/eventbus/implementations/rabbit-event-bus.class';
import * as amqp  from "amqplib";
import { DendriteProducedEvent } from 'src/models/dendrite-published-event';
import { DendriteEventBase } from 'src/models/dendrite-event-base.interface';
import { DendriteConsumedEvent } from 'src/models/dendrite-consumed-event';

describe('Rabbit Event Bus Implementation', () => {
    const connectionString = 'amqp://localhost:5672';
    const queueName = 'testqueue';

    class TestEvent implements DendriteEventBase {
        name = 'test.event.name';
        word = 'Bird';
    }

    afterEach(() => {
        let connection: amqp.Connection;
        let channel: amqp.Channel;

        return amqp.connect(connectionString)
            .then(conn => {
                connection = conn;
                return conn.createChannel();
            })
            .then(chan => {
                channel = chan;
                return channel.deleteExchange('eventbus');
            })
            .then(_ => {
                return channel.deleteQueue(queueName);
            })
            .then(_ => {
                return connection.close();
            })
            .catch(err => {
                console.error(err);
                throw err;
            });
    });

    it('should be able to connect to Rabbit', (done) => {
        // Arrange
        const connectionString = 'amqp://localhost:5672';
        const queueName = 'testqueue';

        // Act
        const rabbitEventBus: RabbitEventBus = new RabbitEventBus(connectionString, queueName);

        // Assert
        rabbitEventBus.connect()
            .subscribe(
                _ => {
                    expect(rabbitEventBus['connection']).not.toBeUndefined();
                    done();
                },
                err => done(err));
    });

    it('should create a queue', (done) => {
        // Arrange
        const connectionString = 'amqp://localhost:5672';
        const queueName = 'testqueue';

        // Act
        const rabbitEventBus: RabbitEventBus = new RabbitEventBus(connectionString, queueName, { isConsumer: true });

        // Assert
        rabbitEventBus.connect()
            .subscribe(_ => {
                rabbitEventBus['channel'].checkQueue(queueName)
                    .then(() => {
                        expect(true).toBe(true);
                        done();
                    });
            });
    });

    it('should publish an event to the eventbus', (done) => {
        // Arrange
        const connectionString = 'amqp://localhost:5672';
        const queueName = 'testqueue';

        const rabbitEventBus: RabbitEventBus = new RabbitEventBus(connectionString, queueName);
        rabbitEventBus.connect()
            .subscribe(_ => {
                rabbitEventBus['channel'].assertQueue(queueName);
                rabbitEventBus['channel'].bindQueue(queueName, 'eventbus', '*')
                    .then(_ => {
                        return rabbitEventBus['channel'].consume(queueName, (msg) => {
                            if (msg) {
                                expect(msg.fields.routingKey).toBe(new TestEvent().name);
                                expect(msg.fields.exchange).toBe('eventbus');
                                const eventBody: TestEvent = JSON.parse(msg.content.toString());
                                expect(eventBody.word).toBe('Bird');
                                done();
                            }
                        });
                    })
                    .then(_ => {
                        const result = rabbitEventBus.publishEvent(new TestEvent());
                        expect(result).toBe(true);
                    });
            });
    });

    it('should resolve when events are received', (done) => {
        // Arrange
        const connectionString = 'amqp://localhost:5672';
        const queueName = 'testqueue';

        const rabbitEventBus: RabbitEventBus = new RabbitEventBus(connectionString, queueName, { isConsumer: true, isProducer: true});
        rabbitEventBus.connect()
            .subscribe(
                _ => {
                    let eventCounter = 0;
                    rabbitEventBus.consumeEvents().subscribe((event: DendriteConsumedEvent<any>) => {
                        eventCounter++;
                        if (eventCounter === 3) {
                            expect(eventCounter).toBe(3);
                            done();
                        }
                    });
                    rabbitEventBus.publishEvent(new TestEvent());
                    rabbitEventBus.publishEvent(new TestEvent());
                    rabbitEventBus.publishEvent(new TestEvent());
                },
                err => done(err)
            );
    });
});