import * as Bluebird from 'bluebird';
import { Observable } from 'rxjs';
import { QueueConfig } from '..';
import { DendriteEvent } from '../../events';

export abstract class EventBus {
    constructor(protected connectionString: string, protected queueConfig?: QueueConfig,  protected queueName?: string) {
    }

    abstract connect(bindings?: string[]): Observable<void>;

    abstract publishEvent(event: DendriteEvent): boolean;

    abstract consumeEvents(): Observable<DendriteEvent>;
}