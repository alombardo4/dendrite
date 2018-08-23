import { DendriteEvent } from '.';

export class DendriteEventWrapper<T extends DendriteEvent> {
  private _event: T;

  constructor(body: T | string) {
    if (typeof body === 'string') {
      this._event = JSON.parse(body);
    } else {
      this._event = body;
    }
  }

  get event(): T {
    return this._event;
  }

  toString(): string {
    return JSON.stringify(this._event);
  }
}