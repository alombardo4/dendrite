import { DendriteEvent } from "./dendrite-event";
import { DendriteEventBase } from "./dendrite-event-base.interface";

export class DendriteProducedEvent<T extends DendriteEventBase> extends DendriteEvent<T> {
    private _body: T;

    constructor(body: T) {
        super(body.name);
        this._body = body;
    }


    get body(): T {
        return this._body;
    }

    toString(): string {
        return JSON.stringify(this._body);
    }
}