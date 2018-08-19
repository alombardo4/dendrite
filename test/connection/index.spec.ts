import { RabbitEventBus } from '../../src/eventbus/implementations/rabbit-event-bus.class';
import * as amqp  from 'amqplib';
import { DendriteEventBase } from '../../src/models/dendrite-event-base.interface';
import { DendriteConsumedEvent } from '../../src/models/dendrite-consumed-event';
import { switchMap } from 'rxjs/operators';
import * as uuid from 'uuid';

describe('Rabbit Event Bus Implementation', () => {
    const connectionString = 'amqp://localhost:5672';

    let queueNames: string[] = [];

    class TestEvent implements DendriteEventBase {
        name = 'test.event.name';
        word = 'Bird';
    }

    beforeEach(() => {
        queueNames = [];
    });

    afterEach((done) => {
        amqp.connect(connectionString)
            .then(connection => {
                return connection.createChannel();
            })
            .then(channel => {
                channel.deleteExchange('eventbus');
                queueNames.forEach(name => channel.deleteQueue(name));
                done();

            });
    });

    it('should be able to connect to Rabbit', (done) => {
        // Arrange
        const queueName = uuid.v4();
        queueNames.push(queueName);

        // Act
        const rabbitEventBus: RabbitEventBus = new RabbitEventBus(connectionString, {}, queueName);

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
        const queueName = uuid.v4();
        queueNames.push(queueName);

        // Act
        const rabbitEventBus: RabbitEventBus = new RabbitEventBus(connectionString, { isConsumer: true }, queueName);

        // Assert
        rabbitEventBus.connect(['dummy.topic.binding'])
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
        const queueName = uuid.v4();
        queueNames.push(queueName);

        const rabbitEventBus: RabbitEventBus = new RabbitEventBus(connectionString, {}, queueName);
        rabbitEventBus.connect()
            .subscribe(_ => {
                rabbitEventBus['channel'].assertQueue(queueName);
                rabbitEventBus['channel'].bindQueue(queueName, 'eventbus', 'test.event.name')
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
        const queueName = `recv-${uuid.v4()}`;
        queueNames.push(queueName);
        const numberOfEvents = 100;

        const rabbitEventBus: RabbitEventBus = new RabbitEventBus(connectionString, { isConsumer: true, isProducer: true}, queueName);
        rabbitEventBus.connect(['test.event.name'])
            .subscribe(
                _ => {
                    let eventCounter = 0;
                    rabbitEventBus.consumeEvents().subscribe((event: DendriteConsumedEvent<any>) => {
                        eventCounter++;
                        if (eventCounter === numberOfEvents) {
                            expect(eventCounter).toBe(numberOfEvents);
                            done();
                        }
                    });
                    setTimeout(() => {
                        for (let i = 0; i < numberOfEvents; i++) {
                            rabbitEventBus.publishEvent(new TestEvent());
                        }
                    }, 100);

                },
                err => done(err)
            );
    });

    it('publish and receive should both work', (done) => {
        const queueName = uuid.v4();
        queueNames.push(queueName);

        const producerEventBus = new RabbitEventBus(connectionString, {isProducer: true });
        const consumerEventBus = new RabbitEventBus(connectionString, { isConsumer: true }, queueName);

        consumerEventBus.connect(['test.event.name'])
            .subscribe(_ => {
                let eventCounter = 0;
                consumerEventBus.consumeEvents().subscribe(event => {
                    eventCounter++;
                    if (eventCounter === 2) {
                        expect(event.name).toEqual('test.event.name');
                        done();
                    }

                });
                setTimeout(() => {
                    producerEventBus.connect().subscribe(_ => {
                        producerEventBus.publishEvent(new TestEvent());
                        producerEventBus.publishEvent(new TestEvent());
                    });
                }, 100)


            });
    });

    it('should resolve only for topics it cares about', (done) => {
        // Arrange
        const queueName = `recv-${uuid.v4()}`;
        queueNames.push(queueName);
        const numberOfEvents = 100;

        class TestEvent2 implements DendriteEventBase {
            name = 'test.event.name2';
        }

        const rabbitEventBus: RabbitEventBus = new RabbitEventBus(connectionString, { isConsumer: true, isProducer: true}, queueName);
        rabbitEventBus.connect(['test.event.name'])
            .subscribe(
                _ => {
                    let eventCounter = 0;
                    const expectedNumber = 50;
                    rabbitEventBus.consumeEvents().subscribe((event: DendriteConsumedEvent<any>) => {
                        eventCounter++;
                        if (eventCounter === expectedNumber) {
                            expect(eventCounter).toBe(expectedNumber);
                            done();
                        } else if (eventCounter > expectedNumber) {
                            throw new Error(`Expected ${expectedNumber} and got ${eventCounter} events.`);
                        }
                    });
                    setTimeout(() => {
                        for (let i = 0; i < numberOfEvents; i++) {
                            if ( i % 2 === 0) {
                                rabbitEventBus.publishEvent(new TestEvent());
                            } else {
                                rabbitEventBus.publishEvent(new TestEvent2());
                            }
                        }
                    }, 100);

                },
                err => done(err)
            );
    });

    it('should resolve for all topics it cares about', (done) => {
        // Arrange
        const queueName = `recv-${uuid.v4()}`;
        queueNames.push(queueName);
        const numberOfEvents = 90;

        class TestEvent2 implements DendriteEventBase {
            name = 'test.event.name2';
        }

        class TestEvent3 implements DendriteEventBase {
            name = 'test.event.name3';
        }

        const rabbitEventBus: RabbitEventBus = new RabbitEventBus(connectionString, { isConsumer: true, isProducer: true}, queueName);
        rabbitEventBus.connect(['test.event.name', 'test.event.name2'])
            .subscribe(
                _ => {
                    let eventCounter = 0;
                    const expectedNumber = 60;
                    rabbitEventBus.consumeEvents().subscribe((event: DendriteConsumedEvent<any>) => {
                        eventCounter++;
                        if (eventCounter === expectedNumber) {
                            rabbitEventBus['channel'].checkQueue(queueName)
                                .then(value => {
                                    expect(eventCounter).toBe(expectedNumber);
                                    expect(value.messageCount).toEqual(0);
                                    done();
                                });
                        } else if (eventCounter > expectedNumber) {
                            throw new Error(`Expected ${expectedNumber} and got ${eventCounter} events.`);
                        }
                    });
                    setTimeout(() => {
                        for (let i = 0; i < numberOfEvents; i++) {
                            switch (i % 3) {
                                case 0:
                                    rabbitEventBus.publishEvent(new TestEvent());
                                    break;
                                case 1:
                                    rabbitEventBus.publishEvent(new TestEvent2());
                                    break;
                                case 2:
                                    rabbitEventBus.publishEvent(new TestEvent3());
                                    break;
                            }
                        }
                    }, 100);

                },
                err => done(err)
            );
    });
});