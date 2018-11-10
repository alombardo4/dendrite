import * as amqp  from 'amqplib';
import { Observable, Observer } from 'rxjs';
import { EventBus, DendriteEvent, DendriteEventWrapper } from '../';

export class RabbitEventBus extends EventBus {
    private connection: amqp.Connection;
    private channel: amqp.Channel;
    private readonly EVENT_BUS = 'eventbus';

    connect(bindings?: string[]): Observable<void> {
        return Observable.create((observer: Observer<any>) => {
            amqp.connect(this.connectionString)
                .then(connection => {
                    this.connection = connection;
                    return this.connection.createChannel();
                })
                .then(channel => {
                    this.channel = channel;
                    this.channel.assertExchange(this.EVENT_BUS, 'topic', {
                        durable: true
                    });

                    if (this.queueConfig && this.queueConfig.isConsumer) {
                        this.channel.assertQueue(this.queueName, {
                            durable: this.queueConfig && this.queueConfig.durable,
                            exclusive: this.queueConfig && this.queueConfig.clusterExclusive
                        });
                        return this.registerTopicBindings(bindings);
                    } else {
                        observer.next(undefined);
                        observer.complete();
                    }
                })
                .then(_ => {
                    observer.next(undefined);
                    observer.complete();
                })
                .catch(err => {
                    observer.error(err);
                    observer.complete();
                });
        });
    }

    private registerTopicBindings(bindings: string[]) {
        if (!this.queueConfig || !this.queueConfig.isConsumer) {
            throw new Error('Topic bindings can only be registered by consumers');
        }
        if (!bindings || bindings.length === 0) {
            throw new Error('At least one topic binding must be provided');
        }
        if (!this.connection || !this.channel) {
            throw new Error('A connection to rabbit must be established before registering topic bindings');
        }
        bindings.forEach(binding => {
            this.channel.bindQueue(this.queueName, this.EVENT_BUS, binding);
        });
    }

    publishEvent(event: DendriteEvent): boolean {
        const wrappedEvent = new DendriteEventWrapper(event);
        return this.channel.publish('eventbus', event.metadata.name, new Buffer(wrappedEvent.toString()));
    }

    consumeEvents(): Observable<DendriteEvent> {
        return Observable.create((observer: Observer<DendriteEvent>) => {
            this.channel.consume(this.queueName, (msg: amqp.Message | null) => {
                if (msg) {
                    const rawEvent = new DendriteEventWrapper(msg.content.toString());
                    observer.next(rawEvent.event);
                }
            });
        });
    }
}