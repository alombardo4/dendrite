import * as Bluebird from 'bluebird';
import { Observable } from 'rxjs';
import { QueueConfig } from '..';
import { DendriteEventBase, DendriteConsumedEvent } from '../..';

export abstract class EventBus {
    constructor(protected connectionString: string, protected queueConfig?: QueueConfig,  protected queueName?: string) {
    }

    abstract connect(bindings?: string[]): Observable<void>;

    abstract publishEvent(event: DendriteEventBase): boolean;

    abstract consumeEvents(): Observable<DendriteConsumedEvent<any>>;
}