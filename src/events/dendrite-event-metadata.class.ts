export class DendriteEventMetadata {
  readonly name: string;
  readonly aggregateId: string;
  readonly timestamp: Date;
  readonly sequenceNumber: number;

  constructor(name: string, aggregateId?: string, timestamp?: Date, sequenceNumber?: number) {
    this.name = name;
    this.aggregateId = aggregateId;
    this.timestamp = timestamp;
    this.sequenceNumber = sequenceNumber;
    Object.seal(this);
  }
}