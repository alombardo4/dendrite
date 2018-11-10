import { DendriteEventMetadata } from '../';

export abstract class DendriteEvent {
  readonly metadata: DendriteEventMetadata;

  constructor(name: string) {
    if (!name) {
      throw new Error('Metadata is undefined!');
    }
    this.metadata = new DendriteEventMetadata(name);
  }
}