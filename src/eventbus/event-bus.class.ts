import { Observable } from 'rxjs';
import { QueueConfig, DendriteEvent } from '..';

export abstract class EventBus {
    constructor(protected connectionString: string, protected queueConfig?: QueueConfig,  protected queueName?: string) {}

    abstract connect(bindings?: string[]): Observable<void>;

    abstract publishEvent(event: DendriteEvent): boolean;

    abstract consumeEvents(): Observable<DendriteEvent>;
}