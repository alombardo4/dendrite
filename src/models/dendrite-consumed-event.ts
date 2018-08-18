import { DendriteEvent } from "./dendrite-event";
import { DendriteEventBase } from "./dendrite-event-base.interface";

export class DendriteConsumedEvent<T extends DendriteEventBase> extends DendriteEvent<T> {
    private _body: T;

    constructor(body: string) {
        const b = JSON.parse(body);
        super(b.name);
        this._body = b;
    }


    get body(): T {
        return this._body;
    }
}