import { DendriteEvent } from '../../../src';

export const NAME = 'test.item.created';

export class ItemCreatedEvent extends DendriteEvent {
  constructor(public id: string, public itemName: string) {
    super(NAME);
  }
}