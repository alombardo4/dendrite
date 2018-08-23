export class DendriteEventMetadata {
  readonly name: string;
  readonly aggregateId: string;
  readonly timestamp: Date;

  constructor(name: string, aggregateId?: string, timestamp?: Date) {
    this.name = name;
    this.aggregateId = aggregateId;
    this.timestamp = timestamp;
    Object.seal(this);
  }
}