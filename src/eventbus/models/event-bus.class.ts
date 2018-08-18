import { QueueConfig } from "./queue-config.class";
import * as Bluebird from 'bluebird';
import { DendriteProducedEvent } from "../../models/dendrite-published-event";
import { DendriteConsumedEvent } from "../../models/dendrite-consumed-event";
import { DendriteEventBase } from "../../models/dendrite-event-base.interface";
import { Observable } from "rxjs";

export abstract class EventBus {
    constructor(protected connectionString: string, protected queueName: string, protected queueConfig?: QueueConfig) {
    }

    abstract connect(): Observable<void>;

    abstract publishEvent(event: DendriteEventBase): boolean;

    abstract consumeEvents(): Observable<DendriteConsumedEvent<any>>;
}