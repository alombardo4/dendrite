import { EventBus } from '../models/event-bus.class';
import * as amqp  from 'amqplib';
import { DendriteProducedEvent } from '../../models/dendrite-published-event';
import { DendriteConsumedEvent } from '../../models/dendrite-consumed-event';
import { DendriteEventBase } from '../../models/dendrite-event-base.interface';
import { Observable, Observer } from 'rxjs';

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
            return;
        }
        if (!bindings || bindings.length === 0) {
            throw new Error('At least one topic binding must be provided');
            return;
        }
        if (!this.connection || !this.channel) {
            throw new Error('A connection to rabbit must be established before registering topic bindings');
            return;
        }
        bindings.forEach(binding => {
            this.channel.bindQueue(this.queueName, this.EVENT_BUS, binding);
        });
    }

    publishEvent(event: DendriteEventBase): boolean {
        const publishEvent = new DendriteProducedEvent(event);
        return this.channel.publish('eventbus', event.name, new Buffer(publishEvent.toString()));
    }
    consumeEvents(): Observable<DendriteConsumedEvent<any>> {
        return Observable.create((observer: Observer<DendriteConsumedEvent<any>>) => {
            this.channel.consume(this.queueName, (msg: amqp.Message | null) => {
                if (msg) {
                    const rawEvent = new DendriteConsumedEvent(msg.content.toString());
                    observer.next(rawEvent);
                }
            });
        });
    }
}