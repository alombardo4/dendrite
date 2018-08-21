import { DendriteEventBase } from '.';

export abstract class DendriteEvent<T extends DendriteEventBase> {
    protected _name: string;

    protected constructor(name: string) {
        this._name = name;
    }

    get name(): string {
        return this._name;
    }

}